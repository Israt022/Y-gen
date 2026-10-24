import { animeController } from "../controllers/anime.controller";

/**
 * Server-side route handler delegates for Next.js App Router route.ts files.
 * Provides unified request/response conversion without tying Next.js internals to Express.
 */
export const animeRoutes = {
  /**
   * Handle GET /api/anime/popular
   */
  async handleGetPopular(request: Request) {
    const url = new URL(request.url);
    const queryParams: Record<string, string | undefined> = {
      page: url.searchParams.get("page") ?? undefined,
      perPage: url.searchParams.get("perPage") ?? undefined,
    };

    const result = await animeController.getPopular(queryParams);
    return Response.json(result.body, { status: result.status });
  },

  /**
   * Handle GET /api/anime/latest
   */
  async handleGetLatest(request: Request) {
    const url = new URL(request.url);
    const queryParams: Record<string, string | undefined> = {
      page: url.searchParams.get("page") ?? undefined,
      perPage: url.searchParams.get("perPage") ?? undefined,
    };

    const result = await animeController.getLatest(queryParams);
    return Response.json(result.body, { status: result.status });
  },

  /**
   * Handle GET /api/anime/[id]
   */
  async handleGetById(
    request: Request,
    context: { params: Promise<{ id: string }> | { id: string } }
  ) {
    const params = await context.params;
    const result = await animeController.getById(params);
    return Response.json(result.body, { status: result.status });
  },
};
