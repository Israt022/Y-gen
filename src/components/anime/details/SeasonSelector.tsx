"use client";

import Image from "next/image";
import Link from "next/link";
import type { SeasonEntry } from "@/../server/src/types/anime.types";

type Props = {
  seasons: SeasonEntry[];
  currentId: number;
};

function formatBadge(format: string | null): string {
  if (!format) return "";
  const map: Record<string, string> = {
    TV: "TV",
    ONA: "ONA",
    OVA: "OVA",
    MOVIE: "Film",
    SPECIAL: "SP",
  };
  return map[format] ?? format;
}

export default function SeasonSelector({ seasons, currentId }: Props) {
  if (seasons.length <= 1) return null;

  return (
    <section>
      <div className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
          Franchise
        </p>
        <h2 className="mt-1.5 text-xl font-bold text-foreground">
          Seasons & Related Entries
        </h2>
      </div>

      {/* Horizontally scrollable row */}
      <div className="flex gap-3 overflow-x-auto pb-3 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {seasons.map((season, idx) => {
          const isCurrent = season.id === currentId;
          const cover =
            season.coverImage.extraLarge ||
            season.coverImage.large ||
            season.coverImage.medium;

          return (
            <Link
              key={season.id}
              href={`/anime/${season.id}`}
              aria-current={isCurrent ? "page" : undefined}
              className={`group relative flex w-[160px] shrink-0 flex-col overflow-hidden rounded-xl border transition-all duration-200 ${
                isCurrent
                  ? "border-primary/60 bg-primary/10 ring-1 ring-primary/40"
                  : "border-border bg-surface/60 hover:border-border-hover hover:bg-surface-hover"
              }`}
            >
              {/* Poster */}
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-background-secondary">
                {cover ? (
                  <Image
                    src={cover}
                    alt={season.label}
                    fill
                    sizes="160px"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-[10px] text-text-muted">
                    No Image
                  </div>
                )}

                {/* Current badge */}
                {isCurrent && (
                  <span className="absolute left-2 top-2 rounded-md bg-primary px-2 py-0.5 text-[10px] font-bold text-white">
                    Current
                  </span>
                )}

                {/* Format badge */}
                {!isCurrent && season.format && (
                  <span className="absolute left-2 top-2 rounded-md bg-black/70 px-1.5 py-0.5 text-[9px] font-semibold text-white/80 backdrop-blur-sm">
                    {formatBadge(season.format)}
                  </span>
                )}

                {/* Sequence number */}
                <span className="absolute bottom-1.5 right-2 text-[10px] font-bold text-white/50">
                  #{idx + 1}
                </span>
              </div>

              {/* Info */}
              <div className="flex flex-col gap-1 p-2.5">
                <p
                  className={`line-clamp-2 text-[11px] font-semibold leading-snug ${
                    isCurrent ? "text-primary" : "text-foreground/90 group-hover:text-foreground"
                  }`}
                >
                  {season.label}
                </p>
                <div className="flex items-center gap-1.5 text-[10px] text-text-muted">
                  {season.seasonYear && <span>{season.seasonYear}</span>}
                  {season.episodes != null && (
                    <>
                      {season.seasonYear && <span>·</span>}
                      <span>{season.episodes} ep</span>
                    </>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
