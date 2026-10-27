"use client";

import Image from "next/image";
import { useState, useMemo } from "react";
import { Play, Check, Search, Film } from "lucide-react";
import type { AnimeEpisode } from "@/../server/src/types/anime.types";
import { useWatchProgress } from "@/lib/watch-progress";

type Props = {
  animeId: number;
  episodes: AnimeEpisode[];
  currentEp: number | null;
  onSelectEp: (epNum: number) => void;
  embedded?: boolean;
};

export default function WatchEpisodeDrawer({
  animeId,
  episodes,
  currentEp,
  onSelectEp,
  embedded,
}: Props) {
  const [searchQuery, setSearchQuery] = useState("");
  const { watchedEpisodes } = useWatchProgress(animeId);

  const filteredEpisodes = useMemo(() => {
    if (!searchQuery.trim()) return episodes;
    const q = searchQuery.toLowerCase().trim();
    return episodes.filter(
      (ep) =>
        ep.number.toString().includes(q) ||
        (ep.title && ep.title.toLowerCase().includes(q))
    );
  }, [episodes, searchQuery]);

  if (episodes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <Film className="h-8 w-8 text-text-muted/40 mb-2" />
        <p className="text-sm text-text-muted">No episodes available</p>
      </div>
    );
  }

  return (
    <div className={`flex flex-col h-full ${embedded ? "" : "overflow-y-auto"}`}>
      {/* Header */}
      <div className="sticky top-0 z-10 border-b border-white/[0.07] bg-[#070a12]/95 px-4 py-3 backdrop-blur-md">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-text-muted">
            Episodes
          </p>
          <div className="flex items-center gap-2">
            {watchedEpisodes.size > 0 && (
              <span className="text-[11px] font-medium text-emerald-400">
                {watchedEpisodes.size}/{episodes.length} Watched
              </span>
            )}
            <span className="rounded-md bg-surface/80 px-2 py-0.5 text-[10px] font-bold text-text-muted">
              {episodes.length}
            </span>
          </div>
        </div>

        {/* Search input if > 12 episodes */}
        {episodes.length > 12 && (
          <div className="relative mt-2.5">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-text-muted" />
            <input
              type="text"
              placeholder="Search episode or number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-white/[0.04] py-1.5 pl-8 pr-3 text-xs text-foreground placeholder:text-text-muted focus:border-primary/50 focus:outline-none"
            />
          </div>
        )}
      </div>

      {/* Episode items list */}
      <ul className="flex-1 overflow-y-auto divide-y divide-white/[0.04]">
        {filteredEpisodes.map((ep) => {
          const isActive = ep.number === currentEp;
          const isWatched = watchedEpisodes.has(ep.number);

          return (
            <li key={ep.number}>
              <button
                onClick={() => onSelectEp(ep.number)}
                className={`group flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors hover:bg-white/[0.05] ${
                  isActive
                    ? "bg-primary/[0.12] border-l-2 border-primary"
                    : "border-l-2 border-transparent"
                }`}
              >
                {/* Thumbnail */}
                <div className="relative h-12 w-20 shrink-0 overflow-hidden rounded-md bg-background-secondary border border-white/10">
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

                  {/* Active playing overlay */}
                  {isActive && (
                    <div className="absolute inset-0 flex items-center justify-center bg-violet-600/40">
                      <Play className="h-4 w-4 fill-white text-white drop-shadow" />
                    </div>
                  )}

                  {/* Watched indicator icon */}
                  {isWatched && !isActive && (
                    <div className="absolute top-1 right-1 rounded-full bg-emerald-500/90 p-0.5 text-white shadow">
                      <Check className="h-2.5 w-2.5 stroke-[3]" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <p
                      className={`text-[11px] font-bold ${
                        isActive ? "text-primary" : "text-text-muted"
                      }`}
                    >
                      EP {ep.number}
                    </p>
                    {isWatched && (
                      <span className="text-[10px] text-emerald-400 font-medium">
                        Watched
                      </span>
                    )}
                  </div>
                  {ep.title ? (
                    <p
                      className={`line-clamp-2 text-[12px] leading-snug mt-0.5 ${
                        isActive
                          ? "font-semibold text-foreground"
                          : "text-foreground/80 group-hover:text-foreground"
                      }`}
                    >
                      {ep.title}
                    </p>
                  ) : (
                    <p className="text-[12px] text-text-muted mt-0.5">
                      Episode {ep.number}
                    </p>
                  )}
                </div>

                {/* Play icon on hover */}
                {!isActive && (
                  <Play className="h-3.5 w-3.5 shrink-0 text-text-muted/0 transition-colors group-hover:text-primary" />
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
