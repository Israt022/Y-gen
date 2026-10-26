
import { Suspense } from "react";
import { notFound } from "next/navigation";

import { animeService } from "@/../server/src/services/anime.service";
import AnimeDetailHero from "@/components/anime/details/AnimeDetailHero";
import AnimeInfo from "@/components/anime/details/AnimeInfo";
import RelatedAnimeSection from "@/components/anime/details/RelatedAnimeSection";

type Props = {
    params: Promise<{ id: string }>;
};

export default function AnimeDetailsPage({ params }: Props) {
    return (
        <Suspense fallback={<AnimeDetailsLoading />}>
            <AnimeDetailsContent params={params} />
        </Suspense>
    );
}

async function AnimeDetailsContent({ params }: Props) {
    const { id } = await params;
    const animeId = Number(id);

    if (!Number.isInteger(animeId) || animeId <= 0) {
        notFound();
    }

    const anime = await animeService.getAnimeById(animeId);

    if (!anime) {
        notFound();
    }

    const related = await animeService
        .getRelatedAnime(animeId, anime.genres, 12)
        .catch((error) => {
            console.error("[RelatedAnime]", error);
            return { franchise: [], recommended: [] };
        });

    return (
        <main className="min-h-screen bg-background">
            <AnimeDetailHero anime={anime} />

            <div className="mx-auto max-w-7xl space-y-16 px-5 py-12 md:px-8 md:py-16">
                <AnimeInfo anime={anime} />

                <RelatedAnimeSection
                    franchise={related.franchise}
                    recommended={related.recommended}
                />
            </div>
        </main>
    );
}

function AnimeDetailsLoading() {
    return (
        <main className="min-h-screen animate-pulse bg-[#090d18] p-6 md:p-10">
            <div className="mx-auto max-w-7xl space-y-6">
                <div className="h-[360px] rounded-2xl bg-white/5 md:h-[480px]" />
                <div className="h-8 w-2/5 rounded bg-white/5" />
                <div className="h-24 rounded-xl bg-white/5" />
                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                    {Array.from({ length: 4 }).map((_, index) => (
                        <div key={index} className="h-48 rounded-xl bg-white/5" />
                    ))}
                </div>
            </div>
        </main>
    );
}
