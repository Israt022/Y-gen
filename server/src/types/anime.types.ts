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

export interface AnimeDetail extends AnimeItem {
  meanScore?: number | null;
  popularity?: number;
  favourites?: number;
  duration?: number | null;
  studios?: string[];
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
