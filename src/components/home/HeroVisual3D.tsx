"use client";

import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import { AnimeItem } from "@/../server/src/types/anime.types";

interface HeroVisual3DProps {
  items: AnimeItem[];
  selectedIndex: number;
  onSelect: (index: number) => void;
  mousePos: { x: number; y: number };
}

export default function HeroVisual3D({
  items,
  selectedIndex,
  onSelect,
  mousePos,
}: HeroVisual3DProps) {
  if (items.length === 0) return null;

  const current = items[selectedIndex];
  const primaryTitle = current.title.english || current.title.romaji;
  const primaryPoster =
    current.coverImage.extraLarge ||
    current.coverImage.large ||
    current.bannerImage ||
    "";

  // Reorder items so we can show flanking cards: previous (-1) and next (+1, +2)
  const prevIndex = (selectedIndex - 1 + items.length) % items.length;
  const nextIndex = (selectedIndex + 1) % items.length;
  const nextIndex2 = (selectedIndex + 2) % items.length;

  const prevItem = items.length > 2 ? items[prevIndex] : null;
  const nextItem = items.length > 1 ? items[nextIndex] : null;
  const nextItem2 = items.length > 3 ? items[nextIndex2] : null;

  // Gentle interactive parallax based on mouse position (-1 to 1)
  const rotateY = mousePos.x * 12; // -12 to 12 deg
  const rotateX = -mousePos.y * 10; // -10 to 10 deg

  return (
    <div
      className="relative flex items-center justify-center w-full min-h-[460px] sm:min-h-[500px] lg:min-h-[540px] select-none"
      style={{ perspective: "1200px" }}
    >
      {/* Ambient background soft glow behind cards */}
      <div
        className="pointer-events-none absolute h-[320px] w-[320px] rounded-full blur-[100px] opacity-35 transition-all duration-700"
        style={{
          background: current.coverImage.color || "var(--accent)",
          transform: `translate(${mousePos.x * 30}px, ${mousePos.y * 30}px)`,
        }}
      />

      {/* 3D Container with mouse-responsive tilt */}
      <div
        className="relative flex items-center justify-center w-full max-w-[500px] h-full transition-transform duration-300 ease-out"
        style={{
          transformStyle: "preserve-3d",
          transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
        }}
      >
        {/* Flanking Card Left (Previous) */}
        {prevItem && (
          <button
            type="button"
            onClick={() => onSelect(prevIndex)}
            aria-label={`View previous: ${prevItem.title.english || prevItem.title.romaji}`}
            className="group absolute -left-6 sm:-left-12 lg:-left-16 z-10 w-44 sm:w-52 aspect-[2/3] rounded-2xl overflow-hidden border border-border/80 bg-surface shadow-2xl transition-all duration-500 cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary hover:border-primary/60 hover:opacity-100"
            style={{
              transform:
                "translateZ(-140px) translateX(-30px) rotateY(25deg) scale(0.82)",
              filter: "brightness(0.65) blur(0.5px)",
            }}
          >
            <Image
              src={
                prevItem.coverImage.large ||
                prevItem.coverImage.extraLarge ||
                ""
              }
              alt=""
              fill
              sizes="(max-width: 640px) 150px, 220px"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-background/50 group-hover:bg-transparent transition-colors" />
            <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-background via-background/60 to-transparent">
              <p className="text-[11px] font-semibold text-foreground line-clamp-1">
                {prevItem.title.english || prevItem.title.romaji}
              </p>
            </div>
          </button>
        )}

        {/* Flanking Card Far Right (Next 2) */}
        {nextItem2 && (
          <button
            type="button"
            onClick={() => onSelect(nextIndex2)}
            aria-label={`View ${nextItem2.title.english || nextItem2.title.romaji}`}
            className="group hidden xl:block absolute right-0 z-10 w-40 aspect-[2/3] rounded-2xl overflow-hidden border border-border/60 bg-surface shadow-2xl transition-all duration-500 cursor-pointer hover:border-primary/60 hover:opacity-100"
            style={{
              transform:
                "translateZ(-220px) translateX(140px) rotateY(-32deg) scale(0.72)",
              filter: "brightness(0.5) blur(1px)",
            }}
          >
            <Image
              src={
                nextItem2.coverImage.large ||
                nextItem2.coverImage.extraLarge ||
                ""
              }
              alt=""
              fill
              sizes="180px"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-background/60 group-hover:bg-transparent transition-colors" />
          </button>
        )}

        {/* Flanking Card Right (Next) */}
        {nextItem && (
          <button
            type="button"
            onClick={() => onSelect(nextIndex)}
            aria-label={`View next: ${nextItem.title.english || nextItem.title.romaji}`}
            className="group absolute -right-6 sm:-right-12 lg:-right-16 z-20 w-44 sm:w-52 aspect-[2/3] rounded-2xl overflow-hidden border border-border/80 bg-surface shadow-2xl transition-all duration-500 cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary hover:border-primary/60 hover:opacity-100"
            style={{
              transform:
                "translateZ(-100px) translateX(30px) rotateY(-22deg) scale(0.85)",
              filter: "brightness(0.75)",
            }}
          >
            <Image
              src={
                nextItem.coverImage.large ||
                nextItem.coverImage.extraLarge ||
                ""
              }
              alt=""
              fill
              sizes="(max-width: 640px) 150px, 220px"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-background/40 group-hover:bg-transparent transition-colors" />
            <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-background via-background/60 to-transparent">
              <p className="text-[11px] font-semibold text-foreground line-clamp-1">
                {nextItem.title.english || nextItem.title.romaji}
              </p>
            </div>
          </button>
        )}

        {/* Primary Center Card (Selected) */}
        <div
          className="relative z-30 w-56 sm:w-64 lg:w-72 aspect-[2/3] rounded-2xl overflow-hidden border-2 border-primary/50 bg-surface shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_40px_rgba(167,139,250,0.28)] transition-all duration-500"
          style={{
            transform: "translateZ(80px)",
          }}
        >
          {primaryPoster ? (
            <Image
              src={primaryPoster}
              alt={primaryTitle}
              fill
              priority
              sizes="(max-width: 640px) 240px, (max-width: 1024px) 280px, 320px"
              className="object-cover transition-transform duration-700 hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-text-muted">
              No Poster
            </div>
          )}

          {/* Top Score Badge on Poster */}
          {current.score != null && (
            <div className="absolute top-3 right-3 flex items-center gap-1 rounded-full border border-white/20 bg-background/80 px-2.5 py-1 text-xs font-bold text-amber-400 backdrop-blur-md shadow-md">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              <span>{(current.score / 10).toFixed(1)}</span>
            </div>
          )}

          {/* Bottom title pill overlay */}
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background via-background/85 to-transparent p-4 pt-10">
            <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
              Featured Selection
            </span>
            <p className="text-sm font-bold text-foreground line-clamp-1 mt-0.5">
              {primaryTitle}
            </p>
            <div className="mt-2 flex items-center justify-between">
              <span className="text-[11px] text-text-muted">
                {current.seasonYear ? `${current.seasonYear} • ` : ""}
                {current.format || "ANIME"}
              </span>
              <Link
                href={`/anime/${current.id}`}
                className="text-[11px] font-semibold text-primary hover:text-primary-hover underline underline-offset-2"
              >
                Inspect Details →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
