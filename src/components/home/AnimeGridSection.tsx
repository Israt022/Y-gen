import Link from "next/link";
import { ArrowRight, Flame, Radio } from "lucide-react";
import { AnimeItem } from "@/../server/src/types/anime.types";
import AnimeCard from "./AnimeCard";

interface AnimeGridSectionProps {
  title: string;
  subtitle?: string;
  badge?: string;
  icon?: "popular" | "latest";
  animeList: AnimeItem[];
  viewAllHref: string;
  showRank?: boolean;
}

export default function AnimeGridSection({
  title,
  subtitle,
  badge,
  icon = "popular",
  animeList,
  viewAllHref,
  showRank = false,
}: AnimeGridSectionProps) {
  return (
    <section className="py-12 sm:py-16 border-b border-border/60">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
        {/* Section Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              {icon === "popular" ? (
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent/15 text-accent border border-accent/20">
                  <Flame className="h-4 w-4" />
                </div>
              ) : (
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
                  <Radio className="h-4 w-4" />
                </div>
              )}

              {badge && (
                <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                  {badge}
                </span>
              )}
            </div>

            <h2 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              {title}
            </h2>

            {subtitle && (
              <p className="mt-1 text-sm text-text-secondary">{subtitle}</p>
            )}
          </div>

          <Link
            href={viewAllHref}
            className="group inline-flex items-center gap-1.5 text-xs font-semibold text-primary transition-colors hover:text-primary-hover"
          >
            <span>View All</span>
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Content Grid */}
        {animeList.length > 0 ? (
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 sm:gap-6">
            {animeList.map((anime, index) => (
              <AnimeCard
                key={anime.id}
                anime={anime}
                rank={showRank ? anime.rank ?? index + 1 : undefined}
              />
            ))}
          </div>
        ) : (
          <div className="mt-8 rounded-xl border border-border bg-surface p-8 text-center text-sm text-text-muted">
            No anime found at this moment. Please check back later.
          </div>
        )}
      </div>
    </section>
  );
}
