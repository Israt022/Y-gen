"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  List,
  X,
  Play,
  Film,
  Info,
  ExternalLink,
} from "lucide-react";
import type {
  AnimeDetail,
  AnimeEpisode,
  SeasonEntry,
} from "@/../server/src/types/anime.types";
import WatchEpisodeDrawer from "./WatchEpisodeDrawer";

type Props = {
  anime: AnimeDetail;
  episodes: AnimeEpisode[];
  seasons: SeasonEntry[];
  currentEpisodeNumber: number | null; // null = movie
  isMovie: boolean;
};

export default function WatchPageClient({
  anime,
  episodes,
  seasons,
  currentEpisodeNumber,
  isMovie,
}: Props) {
  const router = useRouter();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [currentEp, setCurrentEp] = useState(currentEpisodeNumber ?? null);

  const title = anime.title.english || anime.title.romaji;

  const currentEpisode = episodes.find((e) => e.number === currentEp) ?? null;
  const prevEpisode =
    currentEp != null
      ? episodes.find((e) => e.number === currentEp - 1) ?? null
      : null;
  const nextEpisode =
    currentEp != null
      ? episodes.find((e) => e.number === currentEp + 1) ?? null
      : null;

  const navigateToEp = useCallback(
    (epNum: number) => {
      setCurrentEp(epNum);
      router.replace(`/watch/${anime.id}?ep=${epNum}`, { scroll: false });
      setDrawerOpen(false);
    },
    [anime.id, router]
  );

  useEffect(() => {
    if (currentEpisodeNumber != null) setCurrentEp(currentEpisodeNumber);
  }, [currentEpisodeNumber]);

  return (
    <main className="flex min-h-screen flex-col bg-[#060810] pt-16 text-foreground">
      {/* Top nav bar (watch-specific) */}
      <header className="sticky top-16 z-40 flex h-14 items-center gap-3 border-b border-white/[0.07] bg-[#060810]/90 px-4 backdrop-blur-md md:px-6">
        <Link
          href={`/anime/${anime.id}`}
          className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm text-text-secondary transition-colors hover:bg-white/[0.06] hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Back to Details</span>
        </Link>

        <div className="mx-2 h-4 w-px bg-white/10" />

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-foreground/90">
            {title}
          </p>
          {!isMovie && currentEp != null && (
            <p className="text-xs text-text-muted">
              {currentEpisode?.title
                ? `Ep ${currentEp}: ${currentEpisode.title}`
                : `Episode ${currentEp}`}
            </p>
          )}
        </div>

        {/* Brand */}
        <p className="hidden text-xs font-bold tracking-[0.15em] text-primary md:block">
          YŪGEN
        </p>
      </header>

      {/* Main layout: player + sidebar */}
      <div className="flex flex-1 flex-col lg:flex-row">
        {/* ─── Left: Player + Controls ─── */}
        <div className="flex min-w-0 flex-1 flex-col">
          {/* VIDEO PLAYER AREA */}
          <div className="relative w-full bg-black" style={{ aspectRatio: "16/9" }}>
            <PlayerUnavailable
              anime={anime}
              isMovie={isMovie}
              episodeNumber={currentEp}
            />
          </div>

          {/* Episode navigation controls */}
          {!isMovie && (
            <div className="flex items-center justify-between gap-3 border-b border-white/[0.06] bg-[#080b14] px-4 py-3 md:px-6">
              <button
                onClick={() => prevEpisode && navigateToEp(prevEpisode.number)}
                disabled={!prevEpisode}
                className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm font-medium text-text-secondary transition-colors hover:border-border-hover hover:bg-white/[0.05] hover:text-foreground disabled:pointer-events-none disabled:opacity-30"
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Previous</span>
              </button>

              <button
                onClick={() => setDrawerOpen(true)}
                className="flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary/20"
              >
                <List className="h-4 w-4" />
                Episodes
                {currentEp != null && (
                  <span className="rounded-md bg-primary/20 px-1.5 py-0.5 text-xs">
                    {currentEp}/{episodes.length || "?"}
                  </span>
                )}
              </button>

              <button
                onClick={() => nextEpisode && navigateToEp(nextEpisode.number)}
                disabled={!nextEpisode}
                className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm font-medium text-text-secondary transition-colors hover:border-border-hover hover:bg-white/[0.05] hover:text-foreground disabled:pointer-events-none disabled:opacity-30"
              >
                <span className="hidden sm:inline">Next</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* Episode / movie info below player */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6">
            <div className="mx-auto max-w-4xl space-y-5">
              {/* Title block */}
              <div>
                <h1 className="text-lg font-bold text-foreground sm:text-xl">
                  {title}
                </h1>
                {!isMovie && currentEp != null && (
                  <p className="mt-1 text-sm text-text-secondary">
                    {currentEpisode?.title
                      ? `Episode ${currentEp}: ${currentEpisode.title}`
                      : `Episode ${currentEp}`}
                  </p>
                )}
                {isMovie && anime.duration && (
                  <p className="mt-1 text-sm text-text-muted">
                    {anime.duration} min · {anime.seasonYear ?? ""}
                  </p>
                )}
              </div>

              {/* Source notice */}
              <SourceNotice anime={anime} />

              {/* Season selector (compact, in watch page) */}
              {seasons.length > 1 && (
                <WatchSeasonList
                  seasons={seasons}
                  currentId={anime.id}
                />
              )}
            </div>
          </div>
        </div>

        {/* ─── Right: Episode sidebar (desktop) ─── */}
        {!isMovie && (
          <aside className="hidden w-[320px] shrink-0 overflow-y-auto border-l border-white/[0.06] bg-[#070a12] lg:block">
            <WatchEpisodeDrawer
              episodes={episodes}
              currentEp={currentEp}
              onSelectEp={navigateToEp}
              embedded
            />
          </aside>
        )}
      </div>

      {/* ─── Mobile Episode Drawer ─── */}
      {!isMovie && drawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setDrawerOpen(false)}
            aria-label="Close episode list"
          />
          <aside className="absolute inset-y-0 right-0 flex w-full max-w-sm flex-col bg-[#070a12] shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/[0.07] px-4 py-3">
              <p className="text-sm font-semibold">Episodes</p>
              <button
                onClick={() => setDrawerOpen(false)}
                className="rounded-lg p-1.5 text-text-muted hover:bg-white/[0.06] hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <WatchEpisodeDrawer
                episodes={episodes}
                currentEp={currentEp}
                onSelectEp={navigateToEp}
                embedded
              />
            </div>
          </aside>
        </div>
      )}
    </main>
  );
}

// ─── Unavailable Player ─────────────────────────────────────────────
function PlayerUnavailable({
  anime,
  isMovie,
  episodeNumber,
}: {
  anime: AnimeDetail;
  isMovie: boolean;
  episodeNumber: number | null;
}) {
  const poster =
    anime.bannerImage ||
    anime.coverImage.extraLarge ||
    anime.coverImage.large ||
    anime.coverImage.medium;

  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden">
      {/* Blurred backdrop */}
      {poster && (
        <Image
          src={poster}
          alt=""
          fill
          sizes="100vw"
          className="object-cover blur-sm brightness-[0.15]"
          priority
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center px-6 py-8 text-center">
        <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-white/15 bg-white/5">
          {isMovie ? (
            <Film className="h-7 w-7 text-primary" />
          ) : (
            <Play className="h-7 w-7 text-primary" />
          )}
        </div>

        <h2 className="text-lg font-bold text-white sm:text-xl">
          {isMovie ? "Movie Unavailable for Streaming" : "Episode Unavailable"}
        </h2>

        <p className="mt-2 max-w-md text-sm leading-relaxed text-white/60">
          YūGEN is a metadata and discovery platform. We display anime
          information from <strong className="text-white/80">AniList</strong> but
          do not host or embed streaming content. To watch{" "}
          <strong className="text-white/80">
            {isMovie
              ? anime.title.english || anime.title.romaji
              : `Episode ${episodeNumber}`}
          </strong>
          , please visit one of the authorized legal streaming providers below.
        </p>

        {/* Legal streaming links */}
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <StreamingLink
            href={`https://www.crunchyroll.com/search?q=${encodeURIComponent(
              anime.title.english || anime.title.romaji
            )}`}
            label="Crunchyroll"
            color="#F47521"
          />
          <StreamingLink
            href={`https://www.hidive.com/search#q=${encodeURIComponent(
              anime.title.english || anime.title.romaji
            )}`}
            label="HIDIVE"
            color="#00B8E3"
          />
          <StreamingLink
            href={`https://www.funimation.com/search/?q=${encodeURIComponent(
              anime.title.english || anime.title.romaji
            )}`}
            label="Funimation"
            color="#5B0FA8"
          />
          <StreamingLink
            href={`https://www.netflix.com/search?q=${encodeURIComponent(
              anime.title.english || anime.title.romaji
            )}`}
            label="Netflix"
            color="#E50914"
          />
        </div>

        <p className="mt-5 flex items-center gap-1.5 text-xs text-white/35">
          <Info className="h-3.5 w-3.5" />
          Availability varies by region and subscription.
        </p>
      </div>
    </div>
  );
}

function StreamingLink({
  href,
  label,
  color,
}: {
  href: string;
  label: string;
  color: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.06] px-4 py-2 text-sm font-semibold text-white/80 transition-colors hover:bg-white/[0.12] hover:text-white"
      style={{ borderColor: `${color}40` }}
    >
      <span style={{ color }}>{label}</span>
      <ExternalLink className="h-3.5 w-3.5 opacity-50" />
    </a>
  );
}

// ─── Source notice ──────────────────────────────────────────────────
function SourceNotice({ anime }: { anime: AnimeDetail }) {
  return (
    <div className="rounded-xl border border-amber-500/20 bg-amber-500/[0.06] p-4">
      <div className="flex gap-3">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
        <div>
          <p className="text-sm font-semibold text-amber-300">
            About Playback on YūGEN
          </p>
          <p className="mt-1 text-xs leading-relaxed text-amber-200/60">
            YūGEN is a discovery and metadata platform powered by{" "}
            <a
              href="https://anilist.co"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-amber-200"
            >
              AniList
            </a>
            . We do not host, stream or scrape copyrighted content. Legal
            streaming links are shown as a courtesy. Support creators by
            watching on licensed platforms.
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Compact Season List in Watch Page ─────────────────────────────
function WatchSeasonList({
  seasons,
  currentId,
}: {
  seasons: SeasonEntry[];
  currentId: number;
}) {
  return (
    <div>
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.15em] text-text-muted">
        Seasons
      </p>
      <div className="flex gap-2 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {seasons.map((s) => {
          const isCurrent = s.id === currentId;
          return (
            <Link
              key={s.id}
              href={`/watch/${s.id}?ep=1`}
              className={`flex shrink-0 flex-col items-center gap-1 rounded-xl border px-3 py-2 text-center transition-colors ${
                isCurrent
                  ? "border-primary/50 bg-primary/10 text-primary"
                  : "border-border bg-surface/60 text-text-secondary hover:border-border-hover hover:text-foreground"
              }`}
            >
              <span className="max-w-[100px] truncate text-[11px] font-semibold">
                {s.label}
              </span>
              {s.seasonYear && (
                <span className="text-[10px] text-text-muted">{s.seasonYear}</span>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

