"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useCallback } from "react";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  List,
  X,
  Clock,
  Star,
} from "lucide-react";
import type {
  AnimeDetail,
  AnimeEpisode,
  SeasonEntry,
} from "@/../server/src/types/anime.types";
import WatchEpisodeDrawer from "./WatchEpisodeDrawer";
import VideoPlayer from "./player/VideoPlayer";
import BrandLogo from "../shared/BrandLogo";

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
  const searchParams = useSearchParams();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [theaterMode, setTheaterMode] = useState(false);

  // Directly derive currentEp from searchParams or initial currentEpisodeNumber
  const epParam = searchParams.get("episode") || searchParams.get("ep");
  const parsedEp = epParam ? parseInt(epParam, 10) : null;
  const currentEp = isMovie
    ? null
    : parsedEp != null && !isNaN(parsedEp) && parsedEp > 0
    ? parsedEp
    : (currentEpisodeNumber ?? 1);

  const title = anime.title.english || anime.title.romaji;

  // Find active, previous and next episode
  const currentEpisode = episodes.find((e) => e.number === currentEp) ?? null;
  const prevEpisode =
    currentEp != null && currentEp > 1
      ? episodes.find((e) => e.number === currentEp - 1) ?? null
      : null;
  const nextEpisode =
    currentEp != null
      ? episodes.find((e) => e.number === currentEp + 1) ?? null
      : null;

  const navigateToEp = useCallback(
    (epNum: number) => {
      router.replace(`/watch/${anime.id}?episode=${epNum}`, { scroll: false });
      setDrawerOpen(false);
    },
    [anime.id, router]
  );

  return (
    <main className="flex min-h-screen flex-col bg-[#060810] text-foreground">
      {/* ─── Dedicated Cinema Watch Header ─── */}
      <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-white/[0.08] bg-[#060810]/95 px-4 backdrop-blur-xl md:px-6">
        <div className="flex items-center gap-3 min-w-0">
          <Link
            href={`/anime/${anime.id}`}
            className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-1.5 text-xs sm:text-sm font-medium text-text-secondary transition-colors hover:bg-white/[0.1] hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Back to Details</span>
          </Link>

          <div className="h-4 w-px bg-white/10" />

          <div className="min-w-0">
            <h1 className="truncate text-xs sm:text-sm font-semibold text-foreground/90">
              {title}
            </h1>
            {!isMovie && currentEp != null && (
              <p className="truncate text-[11px] text-text-muted">
                {currentEpisode?.title
                  ? `Ep ${currentEp}: ${currentEpisode.title}`
                  : `Episode ${currentEp}`}
              </p>
            )}
            {isMovie && (
              <p className="text-[11px] text-primary font-medium">Feature Film</p>
            )}
          </div>
        </div>

        {/* Right side logo / brand */}
        <div className="flex items-center gap-3">
          <BrandLogo />
        </div>
      </header>

      {/* ─── Player Layout: Standard (sidebar) or Theater Mode ─── */}
      <div
        className={`flex flex-1 flex-col ${
          theaterMode ? "w-full" : "lg:flex-row"
        }`}
      >
        {/* ─── Left / Top: Video Player + Episode Controls ─── */}
        <div className="flex min-w-0 flex-1 flex-col">
          {/* VIDEO PLAYER CONTAINER */}
          <div className="relative w-full bg-black shadow-2xl">
            <VideoPlayer
              anime={anime}
              episodeNumber={isMovie ? null : currentEp}
              isMovie={isMovie}
              episodeTitle={currentEpisode?.title ?? null}
              hasNextEpisode={Boolean(nextEpisode)}
              onNextEpisode={
                nextEpisode ? () => navigateToEp(nextEpisode.number) : undefined
              }
              theaterMode={theaterMode}
              onToggleTheater={() => setTheaterMode(!theaterMode)}
            />
          </div>

          {/* Quick TV Episode Navigation Bar (below player) */}
          {!isMovie && (
            <div className="flex items-center justify-between gap-3 border-b border-white/[0.06] bg-[#080b14] px-4 py-2.5 md:px-6">
              <button
                onClick={() => prevEpisode && navigateToEp(prevEpisode.number)}
                disabled={!prevEpisode}
                className="flex items-center gap-1.5 rounded-lg border border-border bg-surface/60 px-3 py-1.5 text-xs sm:text-sm font-medium text-text-secondary transition-colors hover:border-border-hover hover:bg-surface-hover hover:text-foreground disabled:pointer-events-none disabled:opacity-30"
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Prev Episode</span>
              </button>

              <button
                onClick={() => setDrawerOpen(true)}
                className="flex items-center gap-2 rounded-xl border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs sm:text-sm font-semibold text-primary transition-colors hover:bg-primary/20"
              >
                <List className="h-4 w-4" />
                <span>Episodes</span>
                {currentEp != null && (
                  <span className="rounded-md bg-primary/20 px-1.5 py-0.5 text-[11px] font-bold">
                    {currentEp} / {episodes.length || "?"}
                  </span>
                )}
              </button>

              <button
                onClick={() => nextEpisode && navigateToEp(nextEpisode.number)}
                disabled={!nextEpisode}
                className="flex items-center gap-1.5 rounded-lg border border-border bg-surface/60 px-3 py-1.5 text-xs sm:text-sm font-medium text-text-secondary transition-colors hover:border-border-hover hover:bg-surface-hover hover:text-foreground disabled:pointer-events-none disabled:opacity-30"
              >
                <span className="hidden sm:inline">Next Episode</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* Details below player */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6">
            <div className="mx-auto max-w-4xl space-y-6">
              {/* Anime & Episode Title block */}
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="rounded-md border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                    {anime.format ?? "Anime"}
                  </span>
                  {anime.seasonYear && (
                    <span className="text-xs text-text-muted">
                      {anime.seasonYear}
                    </span>
                  )}
                  {anime.score && (
                    <div className="flex items-center gap-1 text-xs text-amber-400 font-semibold">
                      <Star className="h-3 w-3 fill-amber-400" />
                      <span>{(anime.score / 10).toFixed(1)}</span>
                    </div>
                  )}
                  {anime.duration && (
                    <div className="flex items-center gap-1 text-xs text-text-muted">
                      <Clock className="h-3 w-3" />
                      <span>{anime.duration} min</span>
                    </div>
                  )}
                </div>

                <h2 className="text-xl font-bold text-foreground sm:text-2xl">
                  {title}
                </h2>

                {!isMovie && currentEp != null && (
                  <p className="mt-1 text-sm text-text-secondary font-medium">
                    {currentEpisode?.title
                      ? `Episode ${currentEp} — ${currentEpisode.title}`
                      : `Episode ${currentEp}`}
                  </p>
                )}
              </div>

              {/* Synopsis */}
              {anime.synopsis && (
                <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 text-xs sm:text-sm text-text-secondary leading-relaxed">
                  <p className="line-clamp-3 hover:line-clamp-none transition-all">
                    {anime.synopsis}
                  </p>
                </div>
              )}

              {/* Franchise Seasons Selector */}
              {seasons.length > 1 && (
                <div>
                  <p className="mb-3 text-xs font-bold uppercase tracking-wider text-primary">
                    Franchise Seasons & Sequels
                  </p>
                  <div className="flex gap-2.5 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    {seasons.map((s) => {
                      const isCurrent = s.id === anime.id;
                      const cover =
                        s.coverImage.medium || s.coverImage.large;

                      return (
                        <Link
                          key={s.id}
                          href={`/watch/${s.id}?episode=1`}
                          className={`group flex shrink-0 items-center gap-2.5 rounded-xl border p-2 text-left transition-all ${
                            isCurrent
                              ? "border-primary/60 bg-primary/10 ring-1 ring-primary/40 text-primary"
                              : "border-border bg-surface/60 text-text-secondary hover:border-border-hover hover:bg-surface-hover hover:text-foreground"
                          }`}
                        >
                          {cover && (
                            <div className="relative h-12 w-9 shrink-0 overflow-hidden rounded-lg bg-background-secondary">
                              <Image
                                src={cover}
                                alt={s.label}
                                fill
                                sizes="36px"
                                className="object-cover"
                              />
                            </div>
                          )}
                          <div className="max-w-[130px]">
                            <p className="truncate text-xs font-semibold">
                              {s.label}
                            </p>
                            <p className="text-[10px] text-text-muted mt-0.5">
                              {s.seasonYear ?? s.format ?? "Series"}
                              {s.episodes ? ` · ${s.episodes} eps` : ""}
                            </p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* In Theater Mode, show Episode List below the video player */}
              {theaterMode && !isMovie && (
                <div className="border-t border-white/[0.08] pt-6">
                  <p className="mb-3 text-sm font-bold uppercase tracking-wider text-primary">
                    Episode Guide
                  </p>
                  <div className="max-h-[500px] overflow-hidden rounded-2xl border border-white/[0.08] bg-[#070a12]">
                    <WatchEpisodeDrawer
                      animeId={anime.id}
                      episodes={episodes}
                      currentEp={currentEp}
                      onSelectEp={navigateToEp}
                      embedded
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ─── Right: Desktop Episode Sidebar (Hidden in Theater Mode or Movies) ─── */}
        {!isMovie && !theaterMode && (
          <aside className="hidden w-[340px] shrink-0 border-l border-white/[0.08] bg-[#070a12] lg:flex lg:flex-col">
            <WatchEpisodeDrawer
              animeId={anime.id}
              episodes={episodes}
              currentEp={currentEp}
              onSelectEp={navigateToEp}
              embedded
            />
          </aside>
        )}
      </div>

      {/* ─── Mobile Episode Drawer (Bottom / Slide-in sheet) ─── */}
      {!isMovie && drawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => setDrawerOpen(false)}
            aria-label="Close episode drawer"
          />
          <aside className="absolute inset-y-0 right-0 flex w-full max-w-sm flex-col bg-[#070a12] shadow-2xl animate-in slide-in-from-right duration-200">
            <div className="flex items-center justify-between border-b border-white/[0.08] px-4 py-3">
              <p className="text-sm font-bold text-foreground">Episode Select</p>
              <button
                onClick={() => setDrawerOpen(false)}
                className="rounded-lg p-1.5 text-text-muted hover:bg-white/[0.06] hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <WatchEpisodeDrawer
                animeId={anime.id}
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
