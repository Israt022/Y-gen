import { animeRoutes } from "@/../server/src/routes/anime.routes";


export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  return animeRoutes.handleGetById(request, context);
}
