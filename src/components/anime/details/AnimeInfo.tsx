
import type { AnimeDetail } from "@/../server/src/types/anime.types";

type Props = {
    anime: AnimeDetail;
};

function formatSource(source: string | null | undefined) {
    if (!source) return null;
    const map: Record<string, string> = {
        MANGA: "Manga",
        LIGHT_NOVEL: "Light Novel",
        VISUAL_NOVEL: "Visual Novel",
        VIDEO_GAME: "Video Game",
        OTHER: "Other",
        NOVEL: "Novel",
        DOUJINSHI: "Doujinshi",
        ANIME: "Anime",
        ONE_SHOT: "One Shot",
        ORIGINAL: "Original",
        LIVE_ACTION: "Live Action",
        GAME: "Game",
        COMIC: "Comic",
        MULTIMEDIA_PROJECT: "Multimedia Project",
        PICTURE_BOOK: "Picture Book",
    };
    return map[source] ?? source;
}

function formatLabel(format: string | null | undefined) {
    if (!format) return null;
    const map: Record<string, string> = {
        TV: "TV Series",
        TV_SHORT: "TV Short",
        MOVIE: "Movie",
        SPECIAL: "Special",
        OVA: "OVA",
        ONA: "ONA",
        MUSIC: "Music Video",
    };
    return map[format] ?? format;
}

function statusLabel(status: string | null | undefined) {
    const map: Record<string, string> = {
        FINISHED: "Finished Airing",
        RELEASING: "Currently Airing",
        NOT_YET_RELEASED: "Not Yet Released",
        CANCELLED: "Cancelled",
        HIATUS: "On Hiatus",
    };
    return map[status ?? ""] ?? status ?? "Unknown";
}

function seasonLabel(season: string | null | undefined) {
    if (!season) return null;
    const map: Record<string, string> = {
        WINTER: "Winter",
        SPRING: "Spring",
        SUMMER: "Summer",
        FALL: "Fall",
    };
    return map[season] ?? season;
}

export default function AnimeInfo({ anime }: Props) {
    const details = [
        { label: "Format", value: formatLabel(anime.format) },
        {
            label: "Episodes",
            value: anime.episodes != null ? String(anime.episodes) : null,
        },
        {
            label: "Episode Duration",
            value: anime.duration ? `${anime.duration} min` : null,
        },
        {
            label: "Season",
            value: anime.season && anime.seasonYear
                ? `${seasonLabel(anime.season)} ${anime.seasonYear}`
                : seasonLabel(anime.season) || (anime.seasonYear ? String(anime.seasonYear) : null),
        },
        { label: "Status", value: statusLabel(anime.status) },
        { label: "Source Material", value: formatSource(anime.source) },
        {
            label: "Country",
            value: anime.countryOfOrigin,
        },
        {
            label: "Popularity Rank",
            value: anime.popularity
                ? `#${anime.popularity.toLocaleString()}`
                : null,
        },
        {
            label: "Member Favourites",
            value: anime.favourites
                ? anime.favourites.toLocaleString()
                : null,
        },
        {
            label: "Mean Score",
            value: anime.meanScore ? `${anime.meanScore}/100` : null,
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
                <div className="mt-4 whitespace-pre-line text-sm leading-8 text-text-secondary md:text-base">
                    {anime.synopsis || "No synopsis available."}
                </div>

                {anime.studios?.length ? (
                    <div className="mt-8">
                        <h3 className="text-sm font-bold uppercase tracking-[0.15em] text-text-muted">
                            Production Studio
                        </h3>
                        <p className="mt-2 text-sm text-text-secondary">
                            {anime.studios.join(", ")}
                        </p>
                    </div>
                ) : null}

                {anime.genres.length > 0 && (
                    <div className="mt-6">
                        <h3 className="text-sm font-bold uppercase tracking-[0.15em] text-text-muted">
                            Genres
                        </h3>
                        <div className="mt-2 flex flex-wrap gap-2">
                            {anime.genres.map((genre) => (
                                <span
                                    key={genre}
                                    className="rounded-full border border-border bg-surface/70 px-3 py-1 text-xs text-text-secondary"
                                >
                                    {genre}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <aside className="h-fit rounded-2xl border border-border bg-surface/50 p-5">
                <h3 className="mb-5 text-sm font-bold uppercase tracking-[0.15em] text-text-muted">
                    Anime Information
                </h3>

                <dl className="space-y-3.5">
                    {details.map(({ label, value }) => (
                        <div
                            key={label}
                            className="flex items-start justify-between gap-4 border-b border-border/60 pb-3 last:border-0 last:pb-0"
                        >
                            <dt className="text-xs text-text-muted">{label}</dt>
                            <dd className="text-right text-xs font-semibold text-foreground">
                                {value}
                            </dd>
                        </div>
                    ))}
                </dl>

                {anime.score != null && (
                    <div className="mt-5 rounded-xl border border-amber-400/20 bg-amber-400/[0.06] p-4 text-center">
                        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-amber-400/70">
                            AniList Score
                        </p>
                        <p className="mt-1 text-3xl font-bold text-amber-400">
                            {(anime.score / 10).toFixed(1)}
                        </p>
                        <p className="text-xs text-amber-400/50">out of 10</p>
                    </div>
                )}
            </aside>
        </section>
    );
}
