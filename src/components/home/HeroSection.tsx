"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Play,
  Sparkles,
  Star,
  Calendar,
  Flame,
  ChevronLeft,
  ChevronRight,
  Tv,
} from "lucide-react";
import { AnimeItem } from "@/../server/src/types/anime.types";
import HeroVisual3D from "./HeroVisual3D";
import HeroThumbnails from "./HeroThumbnails";
import CinematicParticles from "./CinematicParticles";

interface HeroSectionProps {
  animeList: AnimeItem[];
}

export default function HeroSection({ animeList }: HeroSectionProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const total = animeList.length;
  const current = animeList[selectedIndex] || animeList[0] || null;

  // Navigation handlers
  const handlePrev = useCallback(() => {
    if (total === 0) return;
    setSelectedIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  const handleNext = useCallback(() => {
    if (total === 0) return;
    setSelectedIndex((prev) => (prev + 1) % total);
  }, [total]);

  // Subtle mouse depth tracking on desktop (disabled when prefers-reduced-motion is active)
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mediaQuery.matches) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current || window.innerWidth < 1024) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2; // -1 to 1
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2; // -1 to 1
      setMousePos({
        x: Math.max(-1, Math.min(1, x)),
        y: Math.max(-1, Math.min(1, y)),
      });
    };

    const handleMouseLeave = () => {
      setMousePos({ x: 0, y: 0 });
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("mousemove", handleMouseMove);
      container.addEventListener("mouseleave", handleMouseLeave);
    }

    return () => {
      if (container) {
        container.removeEventListener("mousemove", handleMouseMove);
        container.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
  }, []);

  // Keyboard navigation when focused inside the hero (Left / Right arrow keys)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      if (e.key === "ArrowLeft") {
        handlePrev();
      } else if (e.key === "ArrowRight") {
        handleNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handlePrev, handleNext]);

  // Empty state fallback
  if (!current) {
    return (
      <section className="relative overflow-hidden pt-28 pb-20 border-b border-border bg-background">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
          <div className="rounded-2xl border border-border bg-surface p-12 text-center">
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-5xl">
              Discover Beyond Worlds
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-base text-text-secondary">
              Experience hand-crafted collections, trending masterpieces, and
              unparalleled anime discoveries on Yūgen.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Link
                href="/explore"
                className="inline-flex h-11 items-center gap-2 rounded-full bg-accent px-6 text-sm font-semibold text-white shadow-lg shadow-accent/25 transition-all hover:bg-accent-secondary"
              >
                <Sparkles className="h-4 w-4" />
                Explore Anime
              </Link>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const title = current.title.english || current.title.romaji;
  const subtitle = current.title.native || current.title.romaji;

  return (
    <section
      ref={containerRef}
      className="relative min-h-[640px] w-full overflow-hidden border-b border-border bg-background pt-24 pb-12 sm:pt-28 sm:pb-16 lg:min-h-[720px] lg:pt-32"
    >
      {/* Background artwork with cinematic gradients, slow ambient drift & crossfade */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        {animeList.map((item, idx) => {
          const bg =
            item.bannerImage ||
            item.coverImage.extraLarge ||
            item.coverImage.large;
          if (!bg) return null;
          const isCurrent = idx === selectedIndex;

          return (
            <div
              key={item.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                isCurrent ? "opacity-35" : "opacity-0"
              }`}
            >
              <Image
                src={bg}
                alt=""
                fill
                priority={idx === 0}
                sizes="100vw"
                className={`object-cover object-top filter blur-xs transition-transform duration-1000 motion-safe:scale-105 motion-safe:animate-[pulse_10s_ease-in-out_infinite]`}
              />
            </div>
          );
        })}

        {/* Ambient layered dark radial & linear fades matching Yūgen's dark aesthetic */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/40" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,transparent_0%,var(--background)_85%)]" />

        {/* Cinematic Atmospheric Lighting & Subtle Particles */}
        <CinematicParticles tintColor={current.coverImage.color} />
      </div>

      {/* Hero content container */}
      <div className="relative z-10 mx-auto max-w-[1400px] px-5 sm:px-8">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Left Column: Featured Anime Details & Actions */}
          <div className="flex flex-col items-start lg:col-span-6 xl:col-span-7">
            {/* Top row: Spotlight Badge + Stepper Navigation */}
            <div className="flex w-full items-center justify-between">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1 text-xs font-medium text-primary tracking-wide backdrop-blur-md">
                <Flame className="h-3.5 w-3.5 text-accent" />
                <span>Featured Masterpiece</span>
                <span className="text-text-muted text-[11px]">
                  #{selectedIndex + 1} of {total}
                </span>
              </div>

              {/* Prev / Next Steppers */}
              {total > 1 && (
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={handlePrev}
                    aria-label="Previous featured anime"
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-surface/80 text-foreground transition-all duration-200 hover:border-primary/60 hover:bg-surface-hover hover:text-primary active:scale-95"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    aria-label="Next featured anime"
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-surface/80 text-foreground transition-all duration-200 hover:border-primary/60 hover:bg-surface-hover hover:text-primary active:scale-95"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Native / Romaji Subtitle */}
            {subtitle && (
              <p className="mt-4 text-xs font-semibold tracking-widest text-text-muted uppercase sm:text-sm">
                {subtitle}
              </p>
            )}

            {/* Anime Title */}
            <h1 className="mt-1 max-w-2xl text-3xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-5xl xl:text-6xl line-clamp-2 transition-all duration-300">
              {title}
            </h1>

            {/* Metadata Pills */}
            <div className="mt-4 flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm text-text-secondary">
              {current.score != null && (
                <div className="flex items-center gap-1.5 rounded-md border border-border bg-surface px-2.5 py-1 text-amber-400 font-semibold shadow-xs">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  <span>{(current.score / 10).toFixed(1)}</span>
                </div>
              )}

              {current.seasonYear && (
                <div className="flex items-center gap-1.5 rounded-md border border-border bg-surface px-2.5 py-1">
                  <Calendar className="h-3.5 w-3.5 text-text-muted" />
                  <span>
                    {current.season ? `${current.season} ` : ""}
                    {current.seasonYear}
                  </span>
                </div>
              )}

              {current.format && (
                <span className="rounded-md border border-border bg-surface px-2.5 py-1 uppercase tracking-wider text-[11px] font-medium text-text-muted">
                  {current.format}
                </span>
              )}

              {current.status && (
                <span className="rounded-md border border-border bg-surface px-2.5 py-1 text-xs capitalize text-primary font-medium">
                  {current.status.toLowerCase().replace(/_/g, " ")}
                </span>
              )}

              {current.episodes && (
                <span className="rounded-md border border-border bg-surface px-2.5 py-1 text-xs text-text-secondary">
                  {current.episodes} Ep{current.episodes > 1 ? "s" : ""}
                </span>
              )}
            </div>

            {/* Genres */}
            {current.genres.length > 0 && (
              <div className="mt-3.5 flex flex-wrap gap-1.5">
                {current.genres.slice(0, 4).map((genre) => (
                  <span
                    key={genre}
                    className="rounded-full border border-border bg-surface/80 px-2.5 py-0.5 text-[11px] font-medium text-text-secondary"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            )}

            {/* Synopsis */}
            {current.synopsis && (
              <p className="mt-5 max-w-2xl text-sm leading-relaxed text-text-secondary line-clamp-3 sm:text-base sm:line-clamp-4">
                {current.synopsis}
              </p>
            )}

            {/* Call To Actions */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href={`/anime/${current.id}`}
                className="inline-flex h-11 items-center gap-2 rounded-full bg-accent px-6 text-sm font-semibold text-white shadow-lg shadow-accent/25 transition-all duration-300 hover:bg-accent-secondary hover:shadow-accent/40"
              >
                <Play className="h-4 w-4 fill-white" />
                View Details
              </Link>

              {current.trailer?.site === "youtube" && current.trailer.id ? (
                <a
                  href={`https://www.youtube.com/watch?v=${current.trailer.id.trim()}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-11 items-center gap-2 rounded-full border border-border bg-surface/80 px-5 text-sm font-medium text-foreground transition-all duration-300 hover:border-primary/50 hover:bg-surface-hover"
                >
                  <Tv className="h-4 w-4 text-primary" />
                  Watch Trailer
                </a>
              ) : (
                <Link
                  href="/explore"
                  className="inline-flex h-11 items-center gap-2 rounded-full border border-border bg-surface/80 px-6 text-sm font-medium text-foreground transition-all duration-300 hover:border-border-hover hover:bg-surface-hover"
                >
                  Explore Catalog
                </Link>
              )}
            </div>
          </div>

          {/* Right Column: 3D Interactive Layered Artwork Visual */}
          <div className="flex flex-col items-center justify-center lg:col-span-6 xl:col-span-5">
            <HeroVisual3D
              items={animeList}
              selectedIndex={selectedIndex}
              onSelect={setSelectedIndex}
              mousePos={mousePos}
            />
          </div>
        </div>

        {/* Bottom Carousel / Thumbnails Bar to easily select spotlight anime */}
        <div className="mt-10 sm:mt-12 pt-6 border-t border-border/50">
          <HeroThumbnails
            items={animeList}
            selectedIndex={selectedIndex}
            onSelect={setSelectedIndex}
          />
        </div>
      </div>
    </section>
  );
}
