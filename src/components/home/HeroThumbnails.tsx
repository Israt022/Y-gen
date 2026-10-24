import Image from "next/image";
import { Star } from "lucide-react";
import { AnimeItem } from "@/../server/src/types/anime.types";

interface HeroThumbnailsProps {
  items: AnimeItem[];
  selectedIndex: number;
  onSelect: (index: number) => void;
}

export default function HeroThumbnails({
  items,
  selectedIndex,
  onSelect,
}: HeroThumbnailsProps) {
  if (items.length <= 1) return null;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between pb-3">
        <span className="text-xs font-semibold tracking-wider uppercase text-text-muted">
          Spotlight Series ({selectedIndex + 1}/{items.length})
        </span>
        <span className="text-[11px] text-text-muted hidden sm:inline-block">
          Select to spotlight
        </span>
      </div>

      <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none snap-x snap-mandatory">
        {items.map((item, idx) => {
          const isSelected = idx === selectedIndex;
          const title = item.title.english || item.title.romaji;
          const thumbImg =
            item.coverImage.medium ||
            item.coverImage.large ||
            item.bannerImage ||
            "";

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelect(idx)}
              aria-label={`Select ${title}`}
              aria-pressed={isSelected}
              className={`group relative flex shrink-0 items-center gap-3 rounded-xl border p-2 text-left transition-all duration-300 snap-start focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary ${
                isSelected
                  ? "border-primary/80 bg-surface-hover shadow-[0_0_20px_rgba(167,139,250,0.25)] ring-1 ring-primary/40 scale-[1.02]"
                  : "border-border/80 bg-surface/70 hover:border-border-hover hover:bg-surface-hover opacity-75 hover:opacity-100"
              }`}
            >
              {/* Miniature Thumbnail */}
              <div className="relative h-12 w-9 sm:h-14 sm:w-10 overflow-hidden rounded-md bg-background-secondary shrink-0">
                {thumbImg && (
                  <Image
                    src={thumbImg}
                    alt={title}
                    fill
                    sizes="40px"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                )}
                {isSelected && (
                  <div className="absolute inset-0 bg-accent/20 mix-blend-overlay" />
                )}
              </div>

              {/* Title & Metadata */}
              <div className="flex flex-col pr-2 max-w-[130px] sm:max-w-[150px]">
                <span
                  className={`text-xs font-semibold line-clamp-1 transition-colors ${
                    isSelected
                      ? "text-primary"
                      : "text-foreground group-hover:text-primary"
                  }`}
                >
                  {title}
                </span>

                <div className="mt-0.5 flex items-center gap-2 text-[10px] text-text-muted">
                  {item.score != null && (
                    <span className="flex items-center gap-0.5 text-amber-400 font-medium">
                      <Star className="h-2.5 w-2.5 fill-amber-400 text-amber-400" />
                      {(item.score / 10).toFixed(1)}
                    </span>
                  )}
                  <span>{item.format || "TV"}</span>
                </div>
              </div>

              {/* Active selection glow pill */}
              {isSelected && (
                <span
                  aria-hidden="true"
                  className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-accent ring-2 ring-background animate-pulse"
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
