"use client";

import Image from "next/image";
import { Play } from "lucide-react";
import type { AnimeEpisode } from "@/../server/src/types/anime.types";

type Props = {
  episodes: AnimeEpisode[];
  currentEp: number | null;
  onSelectEp: (epNum: number) => void;
  embedded?: boolean;
};

export default function WatchEpisodeDrawer({
  episodes,
  currentEp,
  onSelectEp,
  embedded,
}: Props) {
  if (episodes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <p className="text-sm text-text-muted">No episodes available</p>
      </div>
    );
  }

  return (
    <div className={embedded ? "" : "overflow-y-auto"}>
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/[0.07] bg-[#070a12] px-4 py-3">
        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-text-muted">
          Episodes
        </p>
        <span className="rounded-md bg-surface/80 px-2 py-0.5 text-[10px] font-bold text-text-muted">
          {episodes.length}
        </span>
      </div>

      <ul className="divide-y divide-white/[0.04]">
        {episodes.map((ep) => {
          const isActive = ep.number === currentEp;
          return (
            <li key={ep.number}>
              <button
                onClick={() => onSelectEp(ep.number)}
                className={`group flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors hover:bg-white/[0.04] ${
                  isActive ? "bg-primary/[0.08]" : ""
                }`}
              >
                {/* Thumbnail */}
                <div className="relative h-12 w-20 shrink-0 overflow-hidden rounded-md bg-background-secondary">
                  {ep.thumbnail ? (
                    <Image
                      src={ep.thumbnail}
                      alt={ep.title || `Episode ${ep.number}`}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <span className="text-xl font-bold text-text-muted/30">
                        {ep.number}
                      </span>
                    </div>
                  )}

                  {/* Active play overlay */}
                  {isActive && (
                    <div className="absolute inset-0 flex items-center justify-center bg-primary/30">
                      <Play className="h-4 w-4 fill-white text-white" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="min-w-0 flex-1">
                  <p
                    className={`text-[11px] font-bold ${
                      isActive ? "text-primary" : "text-text-muted"
                    }`}
                  >
                    EP {ep.number}
                  </p>
                  {ep.title ? (
                    <p
                      className={`line-clamp-2 text-[12px] leading-snug ${
                        isActive
                          ? "font-semibold text-foreground"
                          : "text-foreground/75 group-hover:text-foreground"
                      }`}
                    >
                      {ep.title}
                    </p>
                  ) : (
                    <p className="text-[12px] text-text-muted">
                      Episode {ep.number}
                    </p>
                  )}
                </div>

                {/* Play icon on hover */}
                {!isActive && (
                  <Play className="h-3.5 w-3.5 shrink-0 text-text-muted/0 transition-colors group-hover:text-text-muted" />
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
