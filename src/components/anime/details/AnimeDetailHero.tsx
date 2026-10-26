
import Image from "next/image";
import Link from "next/link";
import type { AnimeDetail } from "@/../server/src/types/anime.types";

type Props = {
    anime: AnimeDetail;
};

export default function AnimeDetailHero({ anime }: Props) {
    const title = anime.title.english || anime.title.romaji;
    const poster =
        anime.coverImage.extraLarge ||
        anime.coverImage.large ||
        anime.coverImage.medium;

    return (
        <section className="relative isolate overflow-hidden border-b border-border/50">
            {anime.bannerImage && (
                <Image
                    src={anime.bannerImage}
                    alt=""
                    fill
                    priority
                    sizes="100vw"
                    className="-z-20 object-cover object-center"
                />
            )}

            <div className="absolute inset-0 -z-10 bg-background/80" />
            <div className="absolute inset-0 -z-10 bg-gradient-to-t from-background via-background/70 to-background/30" />

            <div className="mx-auto grid max-w-7xl gap-8 px-5 pb-12 pt-28 md:grid-cols-[260px_1fr] md:items-center md:px-8 md:pb-16 md:pt-36">
                <div className="relative mx-auto w-full max-w-[260px]">
                    <div className="absolute -inset-3 rounded-3xl bg-primary/20 blur-2xl" />

                    <div className="relative aspect-[3/4] overflow-hidden rounded-2xl border border-white/15 bg-surface shadow-2xl">
                        {poster && (
                            <Image
                                src={poster}
                                alt={title}
                                fill
                                priority
                                sizes="(max-width: 768px) 75vw, 260px"
                                className="object-cover"
                            />
                        )}
                    </div>
                </div>

                <div className="min-w-0">
                    <p className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-primary">
                        YŪGEN / ANIME DETAILS
                    </p>

                    <h1 className="max-w-3xl text-4xl font-bold leading-tight text-foreground md:text-6xl">
                        {title}
                    </h1>

                    {anime.title.native && (
                        <p className="mt-3 text-lg text-text-muted">
                            {anime.title.native}
                        </p>
                    )}

                    <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-text-secondary">
                        {anime.score != null && (
                            <span className="rounded-lg border border-border bg-surface/80 px-3 py-2">
                                ★ {(anime.score / 10).toFixed(1)} / 10
                            </span>
                        )}
                        <span>{anime.format || "Anime"}</span>
                        <span className="text-border">•</span>
                        <span>{anime.seasonYear ?? "Year unknown"}</span>
                        <span className="text-border">•</span>
                        <span>{anime.status || "Status unknown"}</span>
                    </div>

                    {anime.genres.length > 0 && (
                        <div className="mt-5 flex flex-wrap gap-2">
                            {anime.genres.map((genre) => (
                                <span
                                    key={genre}
                                    className="rounded-full border border-border bg-surface/70 px-3 py-1.5 text-xs text-text-secondary"
                                >
                                    {genre}
                                </span>
                            ))}
                        </div>
                    )}

                    <p className="mt-6 max-w-3xl line-clamp-4 leading-7 text-text-secondary">
                        {anime.synopsis || "No synopsis available."}
                    </p>

                    <div className="mt-8 flex flex-wrap gap-3">
                        {anime.trailer?.site === "youtube" &&
                            anime.trailer.id && (
                                <a
                                    href={`https://www.youtube.com/watch?v=${anime.trailer.id}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="rounded-xl border border-border bg-surface/70 px-5 py-3 text-sm font-semibold text-foreground transition hover:bg-surface"
                                >
                                    ▶ Watch Trailer
                                </a>
                            )}

                        <Link
                            href={`/watch/${anime.id}?ep=1`}
                            className="rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition hover:opacity-90"
                        >
                            Explore Watch Page →
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
