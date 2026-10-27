import { animeService } from "@/../server/src/services/anime.service";
import { animeIdParamSchema, validateParams } from "@/../server/src/middleware/validate.middleware";

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  const validation = validateParams(animeIdParamSchema, params);

  if (!validation.success || !validation.data) {
    return Response.json(
      { success: false, data: [], error: validation.error || "Invalid anime ID" },
      { status: 400 }
    );
  }

  const { id } = validation.data;

  try {
    const episodes = await animeService.getAnimeEpisodes(id);
    return Response.json(
      { success: true, data: episodes },
      { status: 200, headers: { "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=3600" } }
    );
  } catch (err) {
    console.error(`[/api/anime/${id}/episodes] Error:`, err);
    return Response.json(
      { success: false, data: [], error: "Failed to fetch episodes" },
      { status: 502 }
    );
  }
}
