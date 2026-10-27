export interface AnimeTitle {
  romaji: string;
  english?: string | null;
  native?: string | null;
}

export interface AnimeCoverImage {
  extraLarge?: string | null;
  large?: string | null;
  medium?: string | null;
  color?: string | null;
}

export interface AnimeItem {
  id: number;
  title: AnimeTitle;
  synopsis?: string | null;
  bannerImage?: string | null;
  coverImage: AnimeCoverImage;
  score?: number | null; // e.g. 85 (0-100) or normalized
  status?: string | null;
  format?: string | null;
  episodes?: number | null;
  season?: string | null;
  seasonYear?: number | null;
  genres: string[];
  rank?: number;
  trailer?: {
    id: string;
    site: string;
  } | null;
}

export interface AnimeRelation {
  id: number;
  relationType: string; // PREQUEL | SEQUEL | PARENT | SIDE_STORY | SPIN_OFF | ALTERNATIVE | SUMMARY | CHARACTER | OTHER
  title: AnimeTitle;
  coverImage: AnimeCoverImage;
  format?: string | null;
  episodes?: number | null;
  seasonYear?: number | null;
  status?: string | null;
}

/** A single episode entry derived from AniList streamingEpisodes or airingSchedule */
export interface AnimeEpisode {
  number: number;
  title: string | null;
  thumbnail: string | null;
  url: string | null; // external streaming URL if AniList provides one (rarely populated)
  airingAt?: number | null; // unix timestamp, null if not airing
}

/** Represents one "season" entry in the season selector */
export interface SeasonEntry {
  id: number; // AniList media ID
  label: string; // e.g. "Attack on Titan Season 2"
  relationType: string; // PREQUEL | SEQUEL | PARENT | SELF
  format: string | null;
  episodes: number | null;
  seasonYear: number | null;
  coverImage: AnimeCoverImage;
  isCurrent: boolean;
}

export interface AnimeDetail extends AnimeItem {
  meanScore?: number | null;
  popularity?: number;
  favourites?: number;
  duration?: number | null;
  studios?: string[];
  source?: string | null; // e.g. MANGA, LIGHT_NOVEL, ORIGINAL
  countryOfOrigin?: string | null;
  nextAiringEpisode?: {
    episode: number;
    airingAt?: number;
    timeUntilAiring?: number;
  } | null;
  trailer?: {
    id: string;
    site: string;
  } | null;
  relations?: AnimeRelation[];
}

export interface AnimeListResponse {
  success: boolean;
  data: AnimeItem[];
  pageInfo?: {
    currentPage: number;
    hasNextPage: boolean;
    total?: number;
  };
  error?: string;
}

export interface AnimeDetailResponse {
  success: boolean;
  data: AnimeDetail | null;
  error?: string;
}
