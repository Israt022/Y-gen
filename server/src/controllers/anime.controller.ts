import { animeService } from "../services/anime.service";
import {
  paginationQuerySchema,
  animeIdParamSchema,
  validateParams,
} from "../middleware/validate.middleware";
import {
  AnimeListResponse,
  AnimeDetailResponse,
} from "../types/anime.types";

export class AnimeController {
  /**
   * Handle fetching popular anime.
   */
  async getPopular(queryParams: Record<string, string | undefined>): Promise<{
    status: number;
    body: AnimeListResponse;
  }> {
    try {
      const validation = validateParams(paginationQuerySchema, queryParams);
      if (!validation.success || !validation.data) {
        return {
          status: 400,
          body: {
            success: false,
            data: [],
            error: validation.error || "Invalid query parameters",
          },
        };
      }

      const { page, perPage } = validation.data;
      const result = await animeService.getPopularAnime(page, perPage);

      return {
        status: 200,
        body: {
          success: true,
          data: result.anime,
          pageInfo: result.pageInfo,
        },
      };
    } catch (err: unknown) {
      console.error("[AnimeController.getPopular] Error:", err);
      return {
        status: 502,
        body: {
          success: false,
          data: [],
          error:
            err instanceof Error
              ? err.message
              : "Failed to fetch popular anime",
        },
      };
    }
  }

  /**
   * Handle fetching latest/currently airing anime.
   */
  async getLatest(queryParams: Record<string, string | undefined>): Promise<{
    status: number;
    body: AnimeListResponse;
  }> {
    try {
      const validation = validateParams(paginationQuerySchema, queryParams);
      if (!validation.success || !validation.data) {
        return {
          status: 400,
          body: {
            success: false,
            data: [],
            error: validation.error || "Invalid query parameters",
          },
        };
      }

      const { page, perPage } = validation.data;
      const result = await animeService.getLatestAnime(page, perPage);

      return {
        status: 200,
        body: {
          success: true,
          data: result.anime,
          pageInfo: result.pageInfo,
        },
      };
    } catch (err: unknown) {
      console.error("[AnimeController.getLatest] Error:", err);
      return {
        status: 502,
        body: {
          success: false,
          data: [],
          error:
            err instanceof Error
              ? err.message
              : "Failed to fetch latest anime",
        },
      };
    }
  }

  /**
   * Handle fetching anime details by ID.
   */
  async getById(params: { id?: string }): Promise<{
    status: number;
    body: AnimeDetailResponse;
  }> {
    try {
      const validation = validateParams(animeIdParamSchema, params);
      if (!validation.success || !validation.data) {
        return {
          status: 400,
          body: {
            success: false,
            data: null,
            error: validation.error || "Invalid anime ID parameter",
          },
        };
      }

      const { id } = validation.data;
      const anime = await animeService.getAnimeById(id);

      if (!anime) {
        return {
          status: 404,
          body: {
            success: false,
            data: null,
            error: `Anime with ID ${id} was not found`,
          },
        };
      }

      return {
        status: 200,
        body: {
          success: true,
          data: anime,
        },
      };
    } catch (err: unknown) {
      console.error(`[AnimeController.getById] Error for id:`, params.id, err);
      return {
        status: 502,
        body: {
          success: false,
          data: null,
          error:
            err instanceof Error
              ? err.message
              : "Failed to fetch anime details",
        },
      };
    }
  }
}

export const animeController = new AnimeController();
