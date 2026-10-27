import { Suspense } from "react";
import { notFound } from "next/navigation";
import { animeService } from "@/../server/src/services/anime.service";
import WatchPageClient from "@/components/watch/WatchPageClient";

type Props = {
    params: Promise<{ id: string }>;
    searchParams: Promise<{ ep?: string; season?: string }>;
};

export async function generateMetadata({ params, searchParams }: Props) {
    const { id } = await params;
    const { ep } = await searchParams;
    const animeId = Number(id);
    if (!Number.isInteger(animeId) || animeId <= 0) return {};
    try {
        const anime = await animeService.getAnimeById(animeId);
        if (!anime) return {};
        const title = anime.title.english || anime.title.romaji;
        const suffix = ep ? ` — Episode ${ep}` : "";
        return {
            title: `Watch ${title}${suffix} — YūGEN`,
            description: `Watch ${title}${suffix} on YūGEN.`,
        };
    } catch {
        return {};
    }
}

export default function WatchPage({ params, searchParams }: Props) {
    return (
        <Suspense fallback={<WatchPageLoading />}>
            <WatchPageContent params={params} searchParams={searchParams} />
        </Suspense>
    );
}

async function WatchPageContent({ params, searchParams }: Props) {
    const { id } = await params;
    const { ep } = await searchParams;
    const animeId = Number(id);

    if (!Number.isInteger(animeId) || animeId <= 0) {
        notFound();
    }

    const anime = await animeService.getAnimeById(animeId);
    if (!anime) notFound();

    const isMovie = anime.format === "MOVIE";

    const [episodes, seasons] = await Promise.all([
        isMovie
            ? Promise.resolve([])
            : animeService
                  .getAnimeEpisodes(animeId, anime.episodes)
                  .catch(() => []),
        Promise.resolve(
            animeService.buildSeasonList(anime, anime.relations ?? [])
        ),
    ]);

    const requestedEp = ep ? Math.max(1, parseInt(ep, 10) || 1) : 1;
    const currentEpisodeNumber = isMovie
        ? null
        : Math.min(requestedEp, episodes.length || requestedEp);

    return (
        <WatchPageClient
            anime={anime}
            episodes={episodes}
            seasons={seasons}
            currentEpisodeNumber={currentEpisodeNumber}
            isMovie={isMovie}
        />
    );
}

function WatchPageLoading() {
    return (
        <main className="flex min-h-screen flex-col bg-[#060810]">
            <div className="animate-pulse">
                {/* Player skeleton */}
                <div className="aspect-video w-full bg-white/5" />
                {/* Info skeleton */}
                <div className="p-6 space-y-4">
                    <div className="h-6 w-1/3 rounded bg-white/5" />
                    <div className="h-4 w-1/2 rounded bg-white/5" />
                </div>
            </div>
        </main>
    );
}
