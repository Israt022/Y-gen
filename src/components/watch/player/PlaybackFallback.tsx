"use client";

import Image from "next/image";
import {
  Play,
  Film,
  ExternalLink,
  ShieldCheck,
  Video,
} from "lucide-react";
import type { AnimeDetail } from "@/../server/src/types/anime.types";

interface PlaybackFallbackProps {
  anime: AnimeDetail;
  isMovie: boolean;
  episodeNumber: number | null;
  hasTrailer: boolean;
  onWatchTrailer?: () => void;
  onOpenStreamModal: () => void;
}

export default function PlaybackFallback({
  anime,
  isMovie,
  episodeNumber,
  hasTrailer,
  onWatchTrailer,
  onOpenStreamModal,
}: PlaybackFallbackProps) {
  const poster =
    anime.bannerImage ||
    anime.coverImage.extraLarge ||
    anime.coverImage.large ||
    anime.coverImage.medium;

  const animeTitle = anime.title.english || anime.title.romaji;

  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden bg-[#060810] text-center p-6">
      {/* Blurred cinematic backdrop */}
      {poster && (
        <Image
          src={poster}
          alt=""
          fill
          sizes="100vw"
          className="object-cover blur-md brightness-[0.16] scale-105 pointer-events-none"
          priority
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-[#060810] via-black/60 to-transparent pointer-events-none" />

      {/* Main Container */}
      <div className="relative z-10 flex max-w-xl flex-col items-center">
        {/* Badge Icon */}
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-violet-500/30 bg-violet-500/10 shadow-lg shadow-violet-500/10">
          {isMovie ? (
            <Film className="h-6 w-6 text-primary" />
          ) : (
            <Play className="h-6 w-6 text-primary" />
          )}
        </div>

        {/* Headline */}
        <span className="rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1 text-[11px] font-bold tracking-wider uppercase text-primary">
          {isMovie ? "Movie Discovery" : `Episode ${episodeNumber ?? 1}`}
        </span>

        <h2 className="mt-3 text-xl font-bold text-white sm:text-2xl">
          {isMovie ? animeTitle : `Stream Unavailable for Ep ${episodeNumber}`}
        </h2>

        <p className="mt-2 text-xs sm:text-sm leading-relaxed text-white/70">
          YūGEN is a community anime discovery platform powered by AniList. To
          support the original anime creators, we do not host or scrape
          unlicensed video streams.
        </p>

        {/* Action Buttons */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          {hasTrailer && onWatchTrailer && (
            <button
              onClick={onWatchTrailer}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-2.5 text-xs sm:text-sm font-bold text-white shadow-lg shadow-violet-600/30 transition hover:from-violet-500 hover:to-indigo-500"
            >
              <Play className="h-4 w-4 fill-white" />
              Watch Official HD Trailer
            </button>
          )}

          <button
            onClick={onOpenStreamModal}
            className="flex items-center gap-2 rounded-xl border border-white/15 bg-white/[0.08] px-4 py-2.5 text-xs sm:text-sm font-semibold text-white/90 backdrop-blur-md transition hover:border-white/30 hover:bg-white/[0.14]"
          >
            <Video className="h-4 w-4 text-violet-400" />
            Load Direct Stream / Demo
          </button>
        </div>

        {/* Authorized Streaming Providers */}
        <div className="mt-7 w-full border-t border-white/10 pt-5">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-white/40 mb-3 flex items-center justify-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
            Watch legally on licensed platforms
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2">
            <ProviderButton
              href={`https://www.crunchyroll.com/search?q=${encodeURIComponent(
                animeTitle
              )}`}
              label="Crunchyroll"
              color="#F47521"
            />
            <ProviderButton
              href={`https://www.netflix.com/search?q=${encodeURIComponent(
                animeTitle
              )}`}
              label="Netflix"
              color="#E50914"
            />
            <ProviderButton
              href={`https://www.hidive.com/search#q=${encodeURIComponent(
                animeTitle
              )}`}
              label="HIDIVE"
              color="#00B8E3"
            />
            <ProviderButton
              href={`https://www.hulu.com/search?q=${encodeURIComponent(
                animeTitle
              )}`}
              label="Hulu"
              color="#1CE783"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function ProviderButton({
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
      className="group flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.05] px-3 py-1.5 text-xs font-semibold text-white/80 transition hover:bg-white/[0.1] hover:text-white"
    >
      <span
        className="h-2 w-2 rounded-full"
        style={{ backgroundColor: color }}
      />
      <span>{label}</span>
      <ExternalLink className="h-3 w-3 opacity-40 transition group-hover:opacity-80" />
    </a>
  );
}
