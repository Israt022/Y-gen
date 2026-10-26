import { AnimeItem, AnimeDetail } from "../types/anime.types";

const ANILIST_GRAPHQL_URL =
  process.env.ANILIST_API_URL || "https://graphql.anilist.co";

/**
 * Strips HTML tags and excessive linebreaks from AniList descriptions.
 */
function cleanDescription(raw?: string | null): string {
  if (!raw) return "";
  return raw
    .replace(/<br\s*[\/]?>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\n\s*\n/g, "\n\n")
    .trim();
}

/**
 * Execute GraphQL queries against AniList with revalidation/caching support.
 */
async function fetchAniList<T>(
  query: string,
  variables: Record<string, unknown> = {},
  revalidateSeconds = 3600
): Promise<T> {
  const response = await fetch(ANILIST_GRAPHQL_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ query, variables }),
    next: { revalidate: revalidateSeconds },
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => "");
    throw new Error(
      `AniList API error (Status ${response.status}): ${errorText || response.statusText}`
    );
  }

  const json = await response.json();
  if (json.errors && json.errors.length > 0) {
    throw new Error(json.errors[0]?.message || "AniList GraphQL error");
  }

  return json.data as T;
}

// Interfaces matching AniList schema
interface AniListMedia {
  id: number;
  type: string;
  title: {
    romaji: string;
    english: string | null;
    native: string | null;
  };
  description: string | null;
  bannerImage: string | null;
  coverImage: {
    extraLarge: string | null;
    large: string | null;
    medium: string | null;
    color: string | null;
  };
  averageScore: number | null;
  meanScore?: number | null;
  popularity?: number;
  favourites?: number;
  status: string | null;
  format: string | null;
  episodes: number | null;
  duration?: number | null;
  season: string | null;
  seasonYear: number | null;
  genres: string[];
  studios?: {
    nodes: Array<{ name: string }>;
  };
  nextAiringEpisode?: {
    episode: number;
    airingAt?: number;
    timeUntilAiring?: number;
  } | null;
  trailer?: {
    id: string;
    site: string;
  } | null;
}

interface AniListPageResponse {
  Page: {
    pageInfo: {
      currentPage: number;
      hasNextPage: boolean;
      total?: number;
    };
    media: AniListMedia[];
  };
}

function mapToAnimeItem(media: AniListMedia, rank?: number): AnimeItem {
  return {
    id: media.id,
    title: {
      romaji: media.title.romaji,
      english: media.title.english,
      native: media.title.native,
    },
    synopsis: cleanDescription(media.description),
    bannerImage: media.bannerImage,
    coverImage: {
      extraLarge: media.coverImage.extraLarge,
      large: media.coverImage.large,
      medium: media.coverImage.medium,
      color: media.coverImage.color,
    },
    score: media.averageScore,
    status: media.status,
    format: media.format,
    episodes: media.episodes,
    season: media.season,
    seasonYear: media.seasonYear,
    genres: media.genres || [],
    rank,
    trailer: media.trailer,
  };
}

export class AnimeService {
  /**
   * Fetch all-time or seasonally popular anime.
   */
  async getPopularAnime(
    page = 1,
    perPage = 10
  ): Promise<{
    anime: AnimeItem[];
    pageInfo: { currentPage: number; hasNextPage: boolean };
  }> {
    const query = `
      query ($page: Int, $perPage: Int) {
        Page(page: $page, perPage: $perPage) {
          pageInfo {
            currentPage
            hasNextPage
            total
          }
          media(type: ANIME, sort: POPULARITY_DESC, isAdult: false) {
            id
            title {
              romaji
              english
              native
            }
            description(asHtml: false)
            bannerImage
            coverImage {
              extraLarge
              large
              medium
              color
            }
            averageScore
            status
            format
            episodes
            season
            genres
            trailer {
              id
              site
            }
          }
        }
      }
    `;

    const data = await fetchAniList<AniListPageResponse>(
      query,
      { page, perPage },
      1800 // Cache 30 mins
    );

    const startRank = (page - 1) * perPage + 1;
    const anime = (data.Page.media || []).map((m, idx) =>
      mapToAnimeItem(m, startRank + idx)
    );

    return {
      anime,
      pageInfo: data.Page.pageInfo,
    };
  }

  /**
   * Fetch recently released or currently airing anime.
   */
  async getLatestAnime(
    page = 1,
    perPage = 10
  ): Promise<{
    anime: AnimeItem[];
    pageInfo: { currentPage: number; hasNextPage: boolean };
  }> {
    const query = `
      query ($page: Int, $perPage: Int) {
        Page(page: $page, perPage: $perPage) {
          pageInfo {
            currentPage
            hasNextPage
            total
          }
          media(
            type: ANIME,
            status: RELEASING,
            sort: [POPULARITY_DESC, START_DATE_DESC],
            isAdult: false
          ) {
            id
            title {
              romaji
              english
              native
            }
            description(asHtml: false)
            bannerImage
            coverImage {
              extraLarge
              large
              medium
              color
            }
            averageScore
            status
            format
            episodes
            season
            seasonYear
            genres
          }
        }
      }
    `;

    const data = await fetchAniList<AniListPageResponse>(
      query,
      { page, perPage },
      900 // Cache 15 mins for airing anime
    );

    const anime = (data.Page.media || []).map((m) => mapToAnimeItem(m));

    return {
      anime,
      pageInfo: data.Page.pageInfo,
    };
  }

  /**
   * Fetch detailed anime information by ID.
   */
  async getAnimeById(id: number): Promise<AnimeDetail | null> {
    const query = `
      query ($id: Int) {
        Media(id: $id, type: ANIME) {
          id
          title {
            romaji
            english
            native
          }
          description(asHtml: false)
          bannerImage
          coverImage {
            extraLarge
            large
            medium
            color
          }
          averageScore
          meanScore
          popularity
          favourites
          status
          format
          episodes
          duration
          season
          seasonYear
          genres
          studios(isMain: true) {
            nodes {
              name
            }
          }
          nextAiringEpisode {
            episode
            airingAt
            timeUntilAiring
          }
          trailer {
            id
            site
          }
        }
      }
    `;

    const data = await fetchAniList<{ Media: AniListMedia | null }>(
      query,
      { id },
      3600 // Cache 1 hour
    );

    if (!data.Media) {
      return null;
    }

    const base = mapToAnimeItem(data.Media);
    return {
      ...base,
      meanScore: data.Media.meanScore,
      popularity: data.Media.popularity,
      favourites: data.Media.favourites,
      duration: data.Media.duration,
      studios: data.Media.studios?.nodes.map((n) => n.name) || [],
      nextAiringEpisode: data.Media.nextAiringEpisode,
      trailer: data.Media.trailer,
    };
  }

  /**
   * Fetch a featured hero anime (popular with high score and landscape banner).
   */
  async getFeaturedAnime(): Promise<AnimeItem | null> {
    const list = await this.getHeroAnimeList(5);
    return list[0] || null;
  }

  /**
   * Fetch a curated list of iconic featured anime for the cinematic Hero Section.
   * Prioritizes world-renowned masterpieces: Attack on Titan, Demon Slayer,
   * Jujutsu Kaisen, One Piece, Bleach, Fullmetal Alchemist, Hunter x Hunter, Naruto, etc.
   */
  async getHeroAnimeList(limit = 6): Promise<AnimeItem[]> {
    // Verified AniList IDs of globally iconic anime requested by the user
    const ICONIC_IDS = [
      16498, // Attack on Titan
      101922, // Demon Slayer: Kimetsu no Yaiba
      113415, // Jujutsu Kaisen
      21, // One Piece
      269, // Bleach
      5114, // Fullmetal Alchemist: Brotherhood
      11061, // Hunter x Hunter (2011)
      1535, // Death Note
      20, // Naruto
      21459, // My Hero Academia
    ];

    try {
      const query = `
        query ($ids: [Int]) {
          Page(page: 1, perPage: 12) {
            media(type: ANIME, id_in: $ids, isAdult: false) {
              id
              title {
                romaji
                english
                native
              }
              description(asHtml: false)
              bannerImage
              coverImage {
                extraLarge
                large
                medium
                color
              }
              averageScore
              status
              format
              episodes
              season
              seasonYear
              genres
              trailer {
                id
                site
              }
            }
          }
        }
      `;

      const data = await fetchAniList<AniListPageResponse>(
        query,
        { ids: ICONIC_IDS },
        3600 // Cache 1 hour
      );

      const items = (data.Page.media || [])
        .map((m) => mapToAnimeItem(m))
        .filter((a) => Boolean(a.bannerImage));

      // Order according to our preferred iconic list order
      const sorted = ICONIC_IDS.map((id) =>
        items.find((item) => item.id === id)
      ).filter((item): item is AnimeItem => Boolean(item));

      if (sorted.length >= limit) {
        return sorted.slice(0, limit);
      }

      // If any are missing, fill from general popular anime
      const { anime: popular } = await this.getPopularAnime(1, 10);
      const combined = [...sorted];
      for (const p of popular) {
        if (!combined.some((c) => c.id === p.id) && p.bannerImage) {
          combined.push(p);
        }
        if (combined.length >= limit) break;
      }
      return combined;
    } catch (err) {
      console.error("[AnimeService.getHeroAnimeList] Fallback to popular:", err);
      const { anime } = await this.getPopularAnime(1, 10);
      return anime.filter((a) => Boolean(a.bannerImage)).slice(0, limit);
    }
  }

  async getRelatedAnime(
    id: number,
    genres: string[],
    limit = 12
  ): Promise<{
    franchise: AnimeItem[];
    recommended: AnimeItem[];
  }> {
    const query = `
      query ($id: Int) {
        Media(id: $id, type: ANIME) {
          relations {
            edges {
              relationType
              node {
                id
                type
                title { romaji english native }
                description(asHtml: false)
                bannerImage
                coverImage { extraLarge large medium color }
                averageScore
                status
                format
                episodes
                season
                seasonYear
                genres
                trailer { id site }
              }
            }
          }
          recommendations(sort: RATING_DESC) {
            nodes {
              mediaRecommendation {
                id
                type
                title { romaji english native }
                description(asHtml: false)
                bannerImage
                coverImage { extraLarge large medium color }
                averageScore
                status
                format
                episodes
                season
                seasonYear
                genres
                trailer { id site }
              }
            }
          }
        }
      }
    `;

    type RelatedMedia = {
      Media: {
        relations: {
          edges: Array<{
            relationType: string;
            node: AniListMedia | null;
          }>;
        };
        recommendations: {
          nodes: Array<{
            mediaRecommendation: AniListMedia | null;
          }>;
        };
      } | null;
    };

    const data = await fetchAniList<RelatedMedia>(
      query,
      { id },
      3600
    );

    const media = data.Media;

    if (!media) {
      return { franchise: [], recommended: [] };
    }

    const franchiseTypes = new Set([
      "PREQUEL",
      "SEQUEL",
      "PARENT",
      "SIDE_STORY",
      "SPIN_OFF",
      "ALTERNATIVE",
      "SUMMARY",
    ]);

    const franchise = media.relations.edges
      .filter(
        (edge) =>
          edge.node?.type === "ANIME" &&
          franchiseTypes.has(edge.relationType)
      )
      .map((edge) => mapToAnimeItem(edge.node!))
      .filter((item) => item.id !== id);

    const franchiseIds = new Set(franchise.map((item) => item.id));

    const recommendations = media.recommendations.nodes
      .map((node) => node.mediaRecommendation)
      .filter(
        (item): item is AniListMedia =>
          Boolean(item) &&
          item!.type === "ANIME" &&
          item!.id !== id &&
          !franchiseIds.has(item!.id)
      )
      .map((item) => mapToAnimeItem(item));

    // Fill missing recommendations with popular anime
    // sharing one or more genres.
    let genreMatches: AnimeItem[] = [];

    if (genres.length > 0 && recommendations.length < limit) {
      const genreQuery = `
        query ($genres: [String], $id: Int) {
          Page(page: 1, perPage: 30) {
            media(
              type: ANIME
              genre_in: $genres
              id_not: $id
              sort: POPULARITY_DESC
              isAdult: false
            ) {
              id
              title { romaji english native }
              description(asHtml: false)
              bannerImage
              coverImage { extraLarge large medium color }
              averageScore
              status
              format
              episodes
              season
              seasonYear
              genres
              trailer { id site }
            }
          }
        }
      `;

      const genreData = await fetchAniList<AniListPageResponse>(
        genreQuery,
        { genres, id },
        3600
      );

      genreMatches = genreData.Page.media.map((item) =>
        mapToAnimeItem(item)
      );
    }

    const seen = new Set<number>([
      id,
      ...franchise.map((item) => item.id),
    ]);

    const recommended: AnimeItem[] = [];

    for (const item of [...recommendations, ...genreMatches]) {
      if (seen.has(item.id)) continue;

      seen.add(item.id);
      recommended.push(item);

      if (recommended.length >= limit) break;
    }

    return {
      franchise: franchise.slice(0, 8),
      recommended,
    };
  }

}

export const animeService = new AnimeService();
