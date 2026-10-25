import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import { AnimeItem } from "@/../server/src/types/anime.types";

interface AnimeCardProps {
  anime: AnimeItem;
  rank?: number;
}

export default function AnimeCard({ anime, rank }: AnimeCardProps) {
  const title = anime.title.english || anime.title.romaji;
  const image =
    anime.coverImage.extraLarge ||
    anime.coverImage.large ||
    anime.coverImage.medium ||
    anime.bannerImage ||
    "";

  return (
    <Link
      href={`/anime/${anime.id}`}
      className="group relative flex flex-col overflow-hidden rounded-xl border border-border bg-surface transition-all duration-300 hover:-translate-y-1 hover:border-border-hover hover:bg-surface-hover hover:shadow-[0_8px_30px_rgb(0,0,0,0.5)] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary"
    >
      {/* Poster Image Container */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-background-secondary">
        {image ? (
          <Image
            src={image}
            alt={title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs text-text-muted">
            No Image
          </div>
        )}

        {/* Top Floating Badges */}
        <div className="absolute inset-x-2 top-2 flex items-center justify-between pointer-events-none">
          {/* Rank Badge */}
          {rank !== undefined ? (
            <span className="flex h-6 min-w-6 items-center justify-center rounded-md bg-surface/90 px-1.5 text-xs font-bold text-foreground backdrop-blur-md border border-border">
              #{rank}
            </span>
          ) : (
            <div />
          )}

          {/* Score Badge */}
          {anime.score != null && (
            <div className="flex items-center gap-1 rounded-md bg-background/90 px-2 py-0.5 text-xs font-bold text-amber-400 backdrop-blur-md border border-border">
              <Star className="h-3 w-3 fill-amber-400" />
              <span>{(anime.score / 10).toFixed(1)}</span>
            </div>
          )}
        </div>

        {/* Subtle Dark Gradient Overlay at the bottom of the poster */}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-surface to-transparent" />
      </div>

      {/* Details Container */}
      <div className="flex flex-1 flex-col p-3.5">
        <h3 className="text-sm font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
          {title}
        </h3>

        <div className="mt-1 flex items-center justify-between text-[11px] text-text-muted">
          <span>{anime.format || "ANIME"}</span>
          <span>{anime.seasonYear || anime.status || ""}</span>
        </div>

        {anime.genres.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {anime.genres.slice(0, 2).map((g) => (
              <span
                key={g}
                className="rounded-sm bg-background-secondary px-1.5 py-0.5 text-[10px] text-text-secondary"
              >
                {g}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
