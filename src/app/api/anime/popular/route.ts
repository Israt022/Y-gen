import { animeRoutes } from "@/../server/src/routes/anime.routes";


export async function GET(request: Request) {
  return animeRoutes.handleGetPopular(request);
}
