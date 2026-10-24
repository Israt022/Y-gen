import Image from "next/image";
import Link from "next/link";
import { Play, Sparkles, Star, Calendar, Flame } from "lucide-react";
import { AnimeItem } from "@/../server/src/types/anime.types";

interface HeroSectionProps {
  anime: AnimeItem | null;
}

export default function HeroSection({ anime }: HeroSectionProps) {
  if (!anime) {
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

  const title = anime.title.english || anime.title.romaji;
  const subtitle = anime.title.native || anime.title.romaji;
  const backdropImage =
    anime.bannerImage || anime.coverImage.extraLarge || anime.coverImage.large;
  const posterImage =
    anime.coverImage.extraLarge || anime.coverImage.large || backdropImage;

  return (
    <section className="relative min-h-[580px] w-full overflow-hidden border-b border-border pt-24 pb-16 sm:min-h-[640px] sm:pt-28 sm:pb-20 lg:min-h-[700px] lg:pt-32">
      {/* Background artwork with cinematic gradients */}
      {backdropImage && (
        <div className="pointer-events-none absolute inset-0 z-0">
          <Image
            src={backdropImage}
            alt={title}
            fill
            priority
            sizes="100vw"
            className="object-cover object-top opacity-30 filter blur-sm scale-105 transition-transform duration-1000"
          />
          {/* Layered dark radial & linear fades to blend smoothly into background */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/40" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,transparent_0%,var(--background)_80%)]" />
        </div>
      )}

      {/* Hero content container */}
      <div className="relative z-10 mx-auto max-w-[1400px] px-5 sm:px-8">
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-12">
          {/* Main Info */}
          <div className="flex flex-col items-start lg:col-span-7 xl:col-span-8">
            {/* Spotlight badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1 text-xs font-medium text-primary tracking-wide backdrop-blur-md">
              <Flame className="h-3.5 w-3.5 text-accent" />
              <span>Spotlight Masterpiece</span>
            </div>

            {/* Native / Romaji Subtitle */}
            {subtitle && (
              <p className="mt-4 text-xs font-semibold tracking-widest text-text-muted uppercase sm:text-sm">
                {subtitle}
              </p>
            )}

            {/* Main Title */}
            <h1 className="mt-1 max-w-2xl text-3xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl line-clamp-2">
              {title}
            </h1>

            {/* Metadata Pills */}
            <div className="mt-4 flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm text-text-secondary">
              {anime.score != null && (
                <div className="flex items-center gap-1.5 rounded-md border border-border bg-surface px-2.5 py-1 text-amber-400 font-semibold shadow-xs">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  <span>{(anime.score / 10).toFixed(1)}</span>
                </div>
              )}

              {anime.seasonYear && (
                <div className="flex items-center gap-1.5 rounded-md border border-border bg-surface px-2.5 py-1">
                  <Calendar className="h-3.5 w-3.5 text-text-muted" />
                  <span>
                    {anime.season ? `${anime.season} ` : ""}
                    {anime.seasonYear}
                  </span>
                </div>
              )}

              {anime.format && (
                <span className="rounded-md border border-border bg-surface px-2.5 py-1 uppercase tracking-wider text-[11px] font-medium text-text-muted">
                  {anime.format}
                </span>
              )}

              {anime.status && (
                <span className="rounded-md border border-border bg-surface px-2.5 py-1 text-xs capitalize text-primary font-medium">
                  {anime.status.toLowerCase().replace(/_/g, " ")}
                </span>
              )}

              {anime.episodes && (
                <span className="rounded-md border border-border bg-surface px-2.5 py-1 text-xs text-text-secondary">
                  {anime.episodes} Ep{anime.episodes > 1 ? "s" : ""}
                </span>
              )}
            </div>

            {/* Genres */}
            {anime.genres.length > 0 && (
              <div className="mt-3.5 flex flex-wrap gap-1.5">
                {anime.genres.slice(0, 4).map((genre) => (
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
            {anime.synopsis && (
              <p className="mt-5 max-w-2xl text-sm leading-relaxed text-text-secondary line-clamp-3 sm:text-base sm:line-clamp-4">
                {anime.synopsis}
              </p>
            )}

            {/* Action Buttons */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href={`/anime/${anime.id}`}
                className="inline-flex h-11 items-center gap-2 rounded-full bg-accent px-6 text-sm font-semibold text-white shadow-lg shadow-accent/25 transition-all duration-300 hover:bg-accent-secondary hover:shadow-accent/40"
              >
                <Play className="h-4 w-4 fill-white" />
                View Details
              </Link>

              <Link
                href="/explore"
                className="inline-flex h-11 items-center gap-2 rounded-full border border-border bg-surface/80 px-6 text-sm font-medium text-foreground transition-all duration-300 hover:border-border-hover hover:bg-surface-hover"
              >
                Explore More
              </Link>
            </div>
          </div>

          {/* Poster Showcase on Right (Desktop) */}
          {posterImage && (
            <div className="hidden lg:flex lg:col-span-5 xl:col-span-4 justify-center">
              <div className="group relative w-64 xl:w-72 overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl transition-all duration-500 hover:border-primary/50 hover:shadow-[0_0_35px_rgba(167,139,250,0.25)]">
                <div className="relative aspect-[2/3] w-full overflow-hidden">
                  <Image
                    src={posterImage}
                    alt={title}
                    fill
                    sizes="(max-width: 1024px) 0vw, 300px"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent opacity-80" />
                </div>
                <div className="p-4">
                  <p className="text-sm font-semibold text-foreground line-clamp-1">
                    {title}
                  </p>
                  <p className="text-xs text-text-muted mt-0.5">
                    {anime.genres.slice(0, 2).join(" • ")}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
