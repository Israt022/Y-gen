"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Play, ChevronDown, List, LayoutGrid } from "lucide-react";
import type { AnimeEpisode } from "@/../server/src/types/anime.types";

type Props = {
  animeId: number;
  episodes: AnimeEpisode[];
  format: string | null | undefined;
};

const PAGE_SIZE = 50;

export default function EpisodeList({ animeId, episodes, format }: Props) {
  const [page, setPage] = useState(1);
  const [layout, setLayout] = useState<"list" | "grid">("list");

  const isMovie = format === "MOVIE";
  if (isMovie) return null; // Movies handled separately

  if (episodes.length === 0) {
    return (
      <section>
        <SectionHeader count={0} />
        <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-surface/40 py-14 text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-surface">
            <List className="h-5 w-5 text-text-muted" />
          </div>
          <p className="text-sm font-medium text-foreground/70">
            Episode data not available
          </p>
          <p className="mt-2 max-w-xs text-xs text-text-muted">
            AniList doesn&apos;t provide episode metadata for all anime yet. Check back as the season progresses.
          </p>
        </div>
      </section>
    );
  }

  const totalPages = Math.ceil(episodes.length / PAGE_SIZE);
  const visible = episodes.slice(0, page * PAGE_SIZE);
  const hasMore = page < totalPages;

  return (
    <section>
      <SectionHeader
        count={episodes.length}
        layout={layout}
        onLayoutChange={setLayout}
      />

      <div
        className={
          layout === "grid"
            ? "grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
            : "flex flex-col gap-2"
        }
      >
        {visible.map((ep) =>
          layout === "grid" ? (
            <GridEpisodeCard key={ep.number} ep={ep} animeId={animeId} />
          ) : (
            <ListEpisodeCard key={ep.number} ep={ep} animeId={animeId} />
          )
        )}
      </div>

      {hasMore && (
        <div className="mt-6 flex justify-center">
          <button
            onClick={() => setPage((p) => p + 1)}
            className="flex items-center gap-2 rounded-xl border border-border bg-surface/60 px-6 py-2.5 text-sm font-medium text-text-secondary transition-colors hover:border-border-hover hover:bg-surface-hover hover:text-foreground"
          >
            <ChevronDown className="h-4 w-4" />
            Load more episodes ({episodes.length - visible.length} remaining)
          </button>
        </div>
      )}
    </section>
  );
}

function SectionHeader({
  count,
  layout,
  onLayoutChange,
}: {
  count: number;
  layout?: "list" | "grid";
  onLayoutChange?: (v: "list" | "grid") => void;
}) {
  return (
    <div className="mb-5 flex items-center justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
          Episodes
        </p>
        <h2 className="mt-1 text-xl font-bold text-foreground">
          Episode List
          {count > 0 && (
            <span className="ml-2 text-base font-normal text-text-muted">
              ({count})
            </span>
          )}
        </h2>
      </div>

      {layout && onLayoutChange && count > 0 && (
        <div className="flex items-center gap-1 rounded-lg border border-border bg-surface/60 p-1">
          <button
            onClick={() => onLayoutChange("list")}
            aria-label="List layout"
            className={`grid h-7 w-7 place-items-center rounded-md transition-colors ${
              layout === "list"
                ? "bg-primary/20 text-primary"
                : "text-text-muted hover:text-foreground"
            }`}
          >
            <List className="h-4 w-4" />
          </button>
          <button
            onClick={() => onLayoutChange("grid")}
            aria-label="Grid layout"
            className={`grid h-7 w-7 place-items-center rounded-md transition-colors ${
              layout === "grid"
                ? "bg-primary/20 text-primary"
                : "text-text-muted hover:text-foreground"
            }`}
          >
            <LayoutGrid className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}

function ListEpisodeCard({
  ep,
  animeId,
}: {
  ep: AnimeEpisode;
  animeId: number;
}) {
  return (
    <Link
      href={`/watch/${animeId}?ep=${ep.number}`}
      className="group flex items-center gap-3 rounded-xl border border-border bg-surface/40 p-3 transition-all duration-200 hover:border-border-hover hover:bg-surface-hover"
    >
      {/* Thumbnail or number placeholder */}
      <div className="relative h-16 w-28 shrink-0 overflow-hidden rounded-lg bg-background-secondary">
        {ep.thumbnail ? (
          <Image
            src={ep.thumbnail}
            alt={ep.title || `Episode ${ep.number}`}
            fill
            sizes="112px"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="text-2xl font-bold text-text-muted/40">
              {ep.number}
            </span>
          </div>
        )}
        {/* Play overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/40">
          <Play className="h-5 w-5 fill-white text-white opacity-0 drop-shadow transition-opacity group-hover:opacity-100" />
        </div>
      </div>

      {/* Episode info */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="shrink-0 text-xs font-bold text-text-muted">
            EP {ep.number}
          </span>
          {ep.title && (
            <p className="line-clamp-1 text-sm font-medium text-foreground/90 group-hover:text-foreground">
              {ep.title}
            </p>
          )}
        </div>
        {ep.airingAt && (
          <p className="mt-0.5 text-xs text-text-muted">
            {new Date(ep.airingAt * 1000).toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        )}
      </div>

      <Play className="h-4 w-4 shrink-0 text-text-muted/40 transition-colors group-hover:text-primary" />
    </Link>
  );
}

function GridEpisodeCard({
  ep,
  animeId,
}: {
  ep: AnimeEpisode;
  animeId: number;
}) {
  return (
    <Link
      href={`/watch/${animeId}?ep=${ep.number}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-border bg-surface/40 transition-all duration-200 hover:border-border-hover hover:bg-surface-hover"
    >
      {/* Thumbnail */}
      <div className="relative aspect-video w-full overflow-hidden bg-background-secondary">
        {ep.thumbnail ? (
          <Image
            src={ep.thumbnail}
            alt={ep.title || `Episode ${ep.number}`}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="text-3xl font-bold text-text-muted/30">
              {ep.number}
            </span>
          </div>
        )}
        <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/50">
          <Play className="h-6 w-6 fill-white text-white opacity-0 drop-shadow transition-opacity group-hover:opacity-100" />
        </div>
        <span className="absolute left-2 top-2 rounded-md bg-black/70 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur-sm">
          EP {ep.number}
        </span>
      </div>

      {/* Title */}
      <div className="p-2.5">
        <p className="line-clamp-2 text-[11px] font-medium leading-snug text-foreground/80 group-hover:text-foreground">
          {ep.title || `Episode ${ep.number}`}
        </p>
      </div>
    </Link>
  );
}
