import Link from "next/link";
import { Search, Star, Tv } from "lucide-react";

type Anime = {
    mal_id: number;
    title: string;
    title_english: string | null;
    year: number | null;
    score: number | null;
    episodes: number | null;
    type: string | null;
    images: {
        jpg?: {
            large_image_url?: string;
            image_url?: string;
        };
    };
};

type SearchPageProps = {
    searchParams: Promise<{ q?: string }>;
};

export default async function SearchPage({
    searchParams,
}: SearchPageProps) {
    const { q } = await searchParams;
    const query = q?.trim() ?? "";

    let animeList: Anime[] = [];
    let error = false;

    if (query) {
        try {
            const response = await fetch(
                `https://api.tenrai.org/v1/anime?q=${encodeURIComponent(query)}&limit=24&sfw`,
                { next: { revalidate: 3600 } }
            );

            if (!response.ok) throw new Error("Search request failed");

            const result = await response.json();
            animeList = Array.isArray(result.data) ? result.data : [];
        } catch {
            error = true;
        }
    }

    return (
        <main className="min-h-screen bg-[#090d18] px-5 pb-20 pt-28 text-white sm:px-8">
            <div className="mx-auto max-w-7xl">
                <div className="mb-10">
                    <p className="mb-3 text-xs uppercase tracking-[0.3em] text-violet-300">
                        YūGEN / Search
                    </p>

                    <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                        {query ? (
                            <>
                                Search results for{" "}
                                <span className="text-violet-300">
                                    &ldquo;{query}&rdquo;
                                </span>
                            </>
                        ) : (
                            "Discover anime"
                        )}
                    </h1>

                    <p className="mt-3 text-sm text-white/45">
                        Find your next world to explore.
                    </p>
                </div>

                {!query ? (
                    <EmptyState
                        title="What are you looking for?"
                        description="Search for One Piece, Naruto, Death Note and more using the navbar."
                    />
                ) : error ? (
                    <EmptyState
                        title="Search is temporarily unavailable"
                        description="We couldn't load anime right now. Please try again in a moment."
                    />
                ) : animeList.length === 0 ? (
                    <EmptyState
                        title="No anime found"
                        description={`We couldn't find any anime matching "${query}". Check the spelling or try another title.`}
                    />
                ) : (
                    <>
                        <p className="mb-6 text-sm text-white/45">
                            Found {animeList.length} results
                        </p>

                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                            {animeList.map((anime) => (
                                <article key={anime.mal_id} className="group min-w-0">
                                    <Link
                                        href={`/anime/${anime.mal_id}`}
                                        className="block"
                                        aria-label={`View ${anime.title}`}
                                    >
                                        <div className="relative aspect-[3/4] overflow-hidden rounded-xl border border-white/[0.07] bg-white/[0.03]">
                                            {anime.images.jpg?.large_image_url ||
                                                anime.images.jpg?.image_url ? (
                                                <img
                                                    src={
                                                        anime.images.jpg.large_image_url ??
                                                        anime.images.jpg.image_url
                                                    }
                                                    alt={anime.title}
                                                    loading="lazy"
                                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                />
                                            ) : (
                                                <div className="flex h-full items-center justify-center text-white/30">
                                                    <Tv size={30} />
                                                </div>
                                            )}

                                            {anime.score != null && (
                                                <span className="absolute left-2 top-2 flex items-center gap-1 rounded-md bg-black/70 px-2 py-1 text-xs backdrop-blur">
                                                    <Star size={12} className="fill-amber-300 text-amber-300" />
                                                    {anime.score}
                                                </span>
                                            )}
                                        </div>

                                        <h2 className="mt-3 line-clamp-2 text-sm font-medium text-white/90 transition-colors group-hover:text-violet-300">
                                            {anime.title_english || anime.title}
                                        </h2>

                                        <p className="mt-1 text-xs text-white/40">
                                            {[anime.type, anime.year, anime.episodes != null
                                                ? `${anime.episodes} eps`
                                                : null]
                                                .filter(Boolean)
                                                .join(" · ") || "Anime"}
                                        </p>
                                    </Link>
                                </article>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </main>
    );
}

function EmptyState({
    title,
    description,
}: {
    title: string;
    description: string;
}) {
    return (
        <div className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-white/[0.07] bg-white/[0.02] px-6 text-center">
            <div className="mb-5 grid h-14 w-14 place-items-center rounded-full border border-violet-300/20 bg-violet-400/[0.08]">
                <Search className="h-6 w-6 text-violet-300" />
            </div>

            <h2 className="text-lg font-medium">{title}</h2>

            <p className="mt-2 max-w-md text-sm leading-6 text-white/45">
                {description}
            </p>

            <Link
                href="/explore"
                className="mt-6 rounded-full border border-violet-300/25 bg-violet-400/10 px-5 py-2.5 text-sm text-violet-200 transition-colors hover:bg-violet-400/20"
            >
                Explore anime
            </Link>
        </div>
    );
}