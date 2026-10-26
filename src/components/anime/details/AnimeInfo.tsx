
import type { AnimeDetail } from "@/../server/src/types/anime.types";

type Props = {
    anime: AnimeDetail;
};

export default function AnimeInfo({ anime }: Props) {
    const details = [
        { label: "Format", value: anime.format },
        {
            label: "Episodes",
            value: anime.episodes != null ? String(anime.episodes) : null,
        },
        {
            label: "Episode duration",
            value: anime.duration ? `${anime.duration} min` : null,
        },
        { label: "Season", value: anime.season },
        {
            label: "Release year",
            value: anime.seasonYear ? String(anime.seasonYear) : null,
        },
        { label: "Status", value: anime.status },
        {
            label: "Popularity",
            value: anime.popularity
                ? `#${anime.popularity.toLocaleString()}`
                : null,
        },
        {
            label: "Members' favourites",
            value: anime.favourites
                ? anime.favourites.toLocaleString()
                : null,
        },
    ].filter(
        (item): item is { label: string; value: string } =>
            Boolean(item.value),
    );

    return (
        <section className="grid gap-8 lg:grid-cols-[1fr_300px]">
            <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                    Overview
                </p>
                <h2 className="text-2xl font-bold text-foreground">
                    About this anime
                </h2>
                <p className="mt-4 whitespace-pre-line text-sm leading-8 text-text-secondary md:text-base">
                    {anime.synopsis || "No synopsis available."}
                </p>

                {anime.studios?.length ? (
                    <div className="mt-6">
                        <h3 className="text-sm font-semibold text-foreground">
                            Production studio
                        </h3>
                        <p className="mt-2 text-sm text-text-secondary">
                            {anime.studios.join(", ")}
                        </p>
                    </div>
                ) : null}
            </div>

            <aside className="h-fit rounded-2xl border border-border bg-surface/50 p-5">
                <h3 className="mb-5 text-lg font-semibold text-foreground">
                    Anime information
                </h3>

                <dl className="space-y-4">
                    {details.map(({ label, value }) => (
                        <div
                            key={label}
                            className="flex items-start justify-between gap-4 border-b border-border/60 pb-3 last:border-0 last:pb-0"
                        >
                            <dt className="text-sm text-text-muted">{label}</dt>
                            <dd className="text-right text-sm font-medium text-foreground">
                                {value}
                            </dd>
                        </div>
                    ))}
                </dl>
            </aside>
        </section>
    );
}
