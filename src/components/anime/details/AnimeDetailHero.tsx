"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Play, Star, Clock, Tv, Film, BookOpen, ChevronDown, ChevronUp } from "lucide-react";
import type { AnimeDetail } from "@/../server/src/types/anime.types";

import { useWatchProgress } from "@/lib/watch-progress";

type Props = {
  anime: AnimeDetail;
};

function FormatIcon({ format }: { format: string | null | undefined }) {
  if (!format) return null;
  if (format === "MOVIE") return <Film className="h-3.5 w-3.5" />;
  if (format === "MANGA" || format === "NOVEL") return <BookOpen className="h-3.5 w-3.5" />;
  return <Tv className="h-3.5 w-3.5" />;
}

function formatLabel(format: string | null | undefined) {
  if (!format) return "Anime";
  const map: Record<string, string> = {
    TV: "TV Series",
    TV_SHORT: "TV Short",
    MOVIE: "Movie",
    SPECIAL: "Special",
    OVA: "OVA",
    ONA: "ONA",
    MUSIC: "Music",
  };
  return map[format] ?? format;
}

function statusLabel(status: string | null | undefined) {
  const map: Record<string, string> = {
    FINISHED: "Finished",
    RELEASING: "Airing",
    NOT_YET_RELEASED: "Upcoming",
    CANCELLED: "Cancelled",
    HIATUS: "On Hiatus",
  };
  return map[status ?? ""] ?? status ?? "Unknown";
}

export default function AnimeDetailHero({ anime }: Props) {
  const [expanded, setExpanded] = useState(false);

  const title = anime.title.english || anime.title.romaji;
  const poster =
    anime.coverImage.extraLarge ||
    anime.coverImage.large ||
    anime.coverImage.medium;

  const isMovie = anime.format === "MOVIE";
  const { latestProgress } = useWatchProgress(anime.id);
  const synopsis = anime.synopsis || "";
  const isLong = synopsis.length > 320;
  const displayedSynopsis =
    isLong && !expanded ? synopsis.slice(0, 320).trimEnd() + "…" : synopsis;

  const defaultWatchHref = isMovie
    ? `/watch/${anime.id}?type=movie`
    : `/watch/${anime.id}?episode=1`;

  const resumeHref = latestProgress?.episodeNumber
    ? `/watch/${anime.id}?episode=${latestProgress.episodeNumber}`
    : defaultWatchHref;

  return (
    <section className="relative isolate overflow-hidden border-b border-white/[0.06]">
      {/* Banner */}
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

      {/* Overlays */}
      <div className="absolute inset-0 -z-10 bg-[#080911]/80" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[#080911] via-[#080911]/75 to-[#080911]/30" />

      {/* Accent glow behind poster */}
      {anime.coverImage.color && (
        <div
          className="pointer-events-none absolute left-0 top-0 -z-10 h-full w-1/3 opacity-20 blur-[120px]"
          style={{ background: anime.coverImage.color }}
        />
      )}

      <div className="mx-auto grid max-w-7xl gap-8 px-5 pb-12 pt-28 md:grid-cols-[260px_1fr] md:items-start md:px-8 md:pb-16 md:pt-36">
        {/* Poster */}
        <div className="relative mx-auto w-full max-w-[260px]">
          <div
            className="absolute -inset-4 rounded-3xl opacity-40 blur-3xl"
            style={{
              background: anime.coverImage.color
                ? `${anime.coverImage.color}66`
                : "rgb(139 92 246 / 0.25)",
            }}
          />
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
            {!poster && (
              <div className="flex h-full w-full items-center justify-center text-xs text-text-muted">
                No Image
              </div>
            )}
          </div>

          {/* Score pill on poster */}
          {anime.score != null && (
            <div className="absolute -bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-1.5 rounded-full border border-amber-400/30 bg-[#0d1020]/90 px-4 py-1.5 shadow-lg backdrop-blur-md">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              <span className="text-sm font-bold text-amber-400">
                {(anime.score / 10).toFixed(1)}
              </span>
              <span className="text-xs text-white/40">/ 10</span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="min-w-0 pt-4 md:pt-0">
          {/* Breadcrumb label */}
          <p className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-primary">
            <FormatIcon format={anime.format} />
            <span>YŪGEN &rsaquo; {formatLabel(anime.format)}</span>
          </p>

          {/* Titles */}
          <h1 className="max-w-3xl text-4xl font-bold leading-tight text-foreground md:text-5xl lg:text-6xl">
            {title}
          </h1>

          {anime.title.romaji !== title && (
            <p className="mt-2 text-base font-medium text-text-secondary">
              {anime.title.romaji}
            </p>
          )}
          {anime.title.native && (
            <p className="mt-1 text-sm text-text-muted">{anime.title.native}</p>
          )}

          {/* Quick stats row */}
          <div className="mt-5 flex flex-wrap items-center gap-2 text-sm">
            {/* Format badge */}
            <span className="flex items-center gap-1.5 rounded-lg border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary">
              <FormatIcon format={anime.format} />
              {formatLabel(anime.format)}
            </span>

            {/* Status badge */}
            {anime.status && (
              <span
                className={`rounded-lg border px-3 py-1.5 text-xs font-semibold ${
                  anime.status === "RELEASING"
                    ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                    : anime.status === "FINISHED"
                    ? "border-border bg-surface/60 text-text-secondary"
                    : "border-amber-500/30 bg-amber-500/10 text-amber-400"
                }`}
              >
                {statusLabel(anime.status)}
              </span>
            )}

            <span className="text-text-muted">·</span>

            {anime.seasonYear && (
              <span className="text-text-secondary">{anime.seasonYear}</span>
            )}

            {anime.episodes != null && (
              <>
                <span className="text-text-muted">·</span>
                <span className="text-text-secondary">
                  {anime.episodes} ep{anime.episodes !== 1 ? "s" : ""}
                </span>
              </>
            )}

            {anime.duration != null && (
              <>
                <span className="text-text-muted">·</span>
                <span className="flex items-center gap-1 text-text-secondary">
                  <Clock className="h-3.5 w-3.5" />
                  {anime.duration} min
                </span>
              </>
            )}
          </div>

          {/* Genres */}
          {anime.genres.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {anime.genres.map((genre) => (
                <span
                  key={genre}
                  className="rounded-full border border-border bg-surface/70 px-3 py-1 text-xs text-text-secondary transition-colors hover:border-primary/40 hover:bg-primary/10 hover:text-primary"
                >
                  {genre}
                </span>
              ))}
            </div>
          )}

          {/* Synopsis */}
          {synopsis && (
            <div className="mt-5 max-w-3xl">
              <p className="whitespace-pre-line text-sm leading-7 text-text-secondary">
                {displayedSynopsis}
              </p>
              {isLong && (
                <button
                  onClick={() => setExpanded((v) => !v)}
                  className="mt-2 flex items-center gap-1 text-xs font-semibold text-primary transition-colors hover:text-primary-hover"
                >
                  {expanded ? (
                    <>
                      Show less <ChevronUp className="h-3.5 w-3.5" />
                    </>
                  ) : (
                    <>
                      Read more <ChevronDown className="h-3.5 w-3.5" />
                    </>
                  )}
                </button>
              )}
            </div>
          )}

          {/* Studios */}
          {anime.studios && anime.studios.length > 0 && (
            <p className="mt-3 text-xs text-text-muted">
              <span className="font-semibold text-text-secondary">Studio: </span>
              {anime.studios.join(", ")}
            </p>
          )}

          {/* CTA Buttons */}
          <div className="mt-8 flex flex-wrap items-center gap-3">
            {latestProgress ? (
              <>
                <Link
                  href={resumeHref}
                  className="group flex items-center gap-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-violet-600/25 transition-all duration-300 hover:shadow-violet-600/40 hover:from-violet-500 hover:to-indigo-500"
                >
                  <Play className="h-4 w-4 fill-white transition-transform duration-300 group-hover:scale-110" />
                  <span>
                    {isMovie
                      ? "Resume Movie"
                      : `Continue Ep ${latestProgress.episodeNumber}`}
                  </span>
                  <span className="rounded-md bg-white/20 px-1.5 py-0.5 text-[11px] font-semibold">
                    {latestProgress.percentage}%
                  </span>
                </Link>

                {!isMovie && latestProgress.episodeNumber !== 1 && (
                  <Link
                    href={defaultWatchHref}
                    className="flex items-center gap-2 rounded-xl border border-white/15 bg-white/[0.06] px-4 py-3 text-sm font-semibold text-foreground transition hover:border-white/25 hover:bg-white/[0.1]"
                  >
                    Start Ep 1
                  </Link>
                )}
              </>
            ) : (
              <Link
                href={defaultWatchHref}
                className="group flex items-center gap-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-violet-600/25 transition-all duration-300 hover:shadow-violet-600/40 hover:from-violet-500 hover:to-indigo-500"
              >
                <Play className="h-4 w-4 fill-white transition-transform duration-300 group-hover:scale-110" />
                {isMovie ? "Watch Movie" : "Watch Now"}
              </Link>
            )}

            {anime.trailer?.site === "youtube" && anime.trailer.id && (
              <a
                href={`https://www.youtube.com/watch?v=${anime.trailer.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-xl border border-white/15 bg-white/[0.06] px-5 py-3 text-sm font-semibold text-foreground transition hover:border-white/25 hover:bg-white/[0.1]"
              >
                ▶ Trailer
              </a>
            )}
          </div>

          {/* Next airing */}
          {anime.nextAiringEpisode && (
            <p className="mt-4 text-xs text-text-muted">
              <span className="font-semibold text-emerald-400">
                Ep {anime.nextAiringEpisode.episode}
              </span>{" "}
              airing in{" "}
              {anime.nextAiringEpisode.timeUntilAiring != null
                ? `${Math.ceil(anime.nextAiringEpisode.timeUntilAiring / 86400)}d`
                : "soon"}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
