
import type { AnimeItem } from "@/../server/src/types/anime.types";
import AnimeCard from "./AnimeCard";

type Props = {
    franchise: AnimeItem[];
    recommended: AnimeItem[];
};

export default function RelatedAnimeSection({
    franchise,
    recommended,
}: Props) {
    if (!franchise.length && !recommended.length) {
        return null;
    }

    return (
        <div className="space-y-14">
            {franchise.length > 0 && (
                <section>
                    <div className="mb-6">
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                            Continue the story
                        </p>
                        <h2 className="mt-2 text-2xl font-bold text-foreground md:text-3xl">
                            Franchise & Related Series
                        </h2>
                        <p className="mt-2 text-sm text-text-muted">
                            Explore sequels, prequels, spin-offs and related titles.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                        {franchise.map((anime) => (
                            <AnimeCard
                                key={anime.id}
                                anime={anime}
                                label="FRANCHISE"
                            />
                        ))}
                    </div>
                </section>
            )}

            {recommended.length > 0 && (
                <section>
                    <div className="mb-6">
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                            Curated for you
                        </p>
                        <h2 className="mt-2 text-2xl font-bold text-foreground md:text-3xl">
                            You May Also Like
                        </h2>
                        <p className="mt-2 text-sm text-text-muted">
                            More anime selected from recommendations and shared genres.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                        {recommended.map((anime) => (
                            <AnimeCard key={anime.id} anime={anime} />
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}
