import { animeService } from "@/../server/src/services/anime.service";
import HeroSection from "@/components/home/HeroSection";
import AnimeGridSection from "@/components/home/AnimeGridSection";


export default async function HomePage() {
  // Fetch data in parallel directly from backend service for optimal SSR performance
  const [featuredResult, popularResult, latestResult] =
    await Promise.allSettled([
      animeService.getFeaturedAnime(),
      animeService.getPopularAnime(1, 12),
      animeService.getLatestAnime(1, 12),
    ]);

  const featuredAnime =
    featuredResult.status === "fulfilled" ? featuredResult.value : null;

  const popularAnime =
    popularResult.status === "fulfilled" ? popularResult.value.anime : [];

  const latestAnime =
    latestResult.status === "fulfilled" ? latestResult.value.anime : [];

  return (
    <main className="flex-1 min-h-screen bg-background">
      {/* Cinematic Hero Section */}
      <HeroSection anime={featuredAnime} />

      {/* Popular Anime Section */}
      <AnimeGridSection
        title="Trending & Popular"
        subtitle="The highest rated and most celebrated anime across the world."
        badge="Community Favorites"
        icon="popular"
        animeList={popularAnime}
        viewAllHref="/explore"
        showRank={true}
      />

      {/* Latest & Airing Anime Section */}
      <AnimeGridSection
        title="Currently Airing"
        subtitle="Fresh episodes broadcasting this season right now."
        badge="Live Broadcasts"
        icon="latest"
        animeList={latestAnime}
        viewAllHref="/seasonal"
        showRank={false}
      />
    </main>
  );
}
