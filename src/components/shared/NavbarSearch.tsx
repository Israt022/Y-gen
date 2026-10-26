
"use client";

import Link from "next/link";
import { Search, X, Star, ChevronRight, LoaderCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { FOCUS_RING, SEARCH_HREF } from "./navbar.config";

type Anime = {
  mal_id: number;
  title: string;
  title_english: string | null;
  year: number | null;
  score: number | null;
  type: string | null;
  images: {
    jpg: {
      image_url: string;
      small_image_url: string;
    };
  };
};

type NavbarSearchProps = {
  open: boolean;
  query: string;
  onQueryChange: (value: string) => void;
  onToggle: () => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onClose: () => void;
};

export default function NavbarSearch({
  open,
  query,
  onQueryChange,
  onToggle,
  onSubmit,
  onClose,
}: NavbarSearchProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const [results, setResults] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState(false);

  const trimmedQuery = query.trim();

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  // Fetch anime suggestions while typing.
  useEffect(() => {
    if (!open || !trimmedQuery) {
      setResults([]);
      setLoading(false);
      setSearched(false);
      setError(false);
      return;
    }

    let cancelled = false;

    const timer = window.setTimeout(async () => {
      setLoading(true);
      setSearched(false);
      setError(false);

      try {
        const response = await fetch(
          `https://api.jikan.moe/v4/anime?q=${encodeURIComponent(
            trimmedQuery
          )}&limit=6&sfw`
        );

        if (!response.ok) {
          throw new Error("Anime search failed");
        }

        const result = await response.json();

        if (!cancelled) {
          setResults(Array.isArray(result.data) ? result.data : []);
          setSearched(true);
        }
      } catch {
        if (!cancelled) {
          setResults([]);
          setError(true);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }, 350);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [open, trimmedQuery]);

  // Close suggestions when clicking outside.
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        // Keep the search open; only hide the dropdown.
        setSearched(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () =>
      document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const closeSearch = () => {
    onClose();
    setResults([]);
    setSearched(false);
  };

  const showDropdown =
    open && Boolean(trimmedQuery) && (loading || searched || error);

  return (
    <div ref={wrapperRef} className="relative hidden lg:block">
      <form
        role="search"
        onSubmit={onSubmit}
        className="flex items-center"
      >
        <div
          className={`overflow-hidden transition-[width,opacity] duration-300 ${open ? "w-52 opacity-100" : "w-0 opacity-0"
            }`}
        >
          <label htmlFor="navbar-search" className="sr-only">
            Search anime
          </label>

          <input
            ref={inputRef}
            id="navbar-search"
            type="search"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            onFocus={() => {
              if (trimmedQuery) setSearched(false);
            }}
            onKeyDown={(event) => {
              if (event.key === "Escape") {
                event.preventDefault();
                closeSearch();
              }
            }}
            tabIndex={open ? 0 : -1}
            placeholder="Search anime..."
            autoComplete="off"
            aria-controls="navbar-search-results"
            aria-expanded={showDropdown}
            className="h-9 w-52 border-b border-white/15 bg-transparent px-1 pr-2 text-[13px] text-white outline-none placeholder:text-white/35 focus:border-violet-300/70 [&::-webkit-search-cancel-button]:hidden"
          />
        </div>

        <button
          type="button"
          aria-label={open ? "Close search" : "Search anime"}
          aria-expanded={open}
          title="Search anime (/)"
          onClick={open ? closeSearch : onToggle}
          className={`grid h-9 w-9 place-items-center rounded-full text-white/60 transition-colors hover:bg-white/[0.06] hover:text-white ${FOCUS_RING}`}
        >
          {open ? (
            <X className="h-[17px] w-[17px]" />
          ) : (
            <Search className="h-[17px] w-[17px]" />
          )}
        </button>
      </form>

      {showDropdown && (
        <div
          id="navbar-search-results"
          className="absolute right-0 top-[calc(100%+14px)] z-[70] w-[350px] overflow-hidden rounded-xl border border-white/[0.09] bg-[#0d101c]/[0.98] shadow-[0_18px_60px_rgba(0,0,0,0.55)] backdrop-blur-2xl"
        >
          <div className="flex items-center justify-between border-b border-white/[0.07] px-4 py-3">
            <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-white/45">
              {loading ? "Searching anime" : "Anime suggestions"}
            </p>

            {loading && (
              <LoaderCircle className="h-4 w-4 animate-spin text-violet-300" />
            )}
          </div>

          {loading && results.length === 0 ? (
            <div className="space-y-3 p-4">
              {[1, 2, 3].map((item) => (
                <div key={item} className="flex animate-pulse gap-3">
                  <div className="h-14 w-11 rounded-md bg-white/[0.07]" />
                  <div className="flex-1 space-y-2 py-2">
                    <div className="h-3 w-3/4 rounded bg-white/[0.07]" />
                    <div className="h-2.5 w-1/3 rounded bg-white/[0.05]" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <p className="px-4 py-7 text-center text-sm text-white/50">
              Search is temporarily unavailable. Try again.
            </p>
          ) : results.length > 0 ? (
            <>
              <div className="p-2">
                {results.slice(0, 4).map((anime) => (
                  <Link
                    key={anime.mal_id}
                    href={`/anime/${anime.mal_id}`}
                    onClick={closeSearch}
                    className="group flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-white/[0.05]"
                  >
                    <div className="h-[58px] w-[44px] shrink-0 overflow-hidden rounded-md bg-white/[0.06]">
                      <img
                        src={anime.images.jpg.small_image_url || anime.images.jpg.image_url}
                        alt=""
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-2 text-[13px] font-medium leading-5 text-white/90 transition-colors group-hover:text-violet-300">
                        {anime.title_english || anime.title}
                      </p>

                      <p className="mt-1 flex items-center gap-2 text-[11px] text-white/40">
                        <span>{anime.type || "Anime"}</span>
                        {anime.year && (
                          <>
                            <span>·</span>
                            <span>{anime.year}</span>
                          </>
                        )}
                        {anime.score != null && (
                          <span className="ml-auto flex shrink-0 items-center gap-1 text-amber-300/90">
                            <Star className="h-3 w-3 fill-current" />
                            {anime.score}
                          </span>
                        )}
                      </p>
                    </div>

                    <ChevronRight className="h-4 w-4 shrink-0 text-white/20 transition-all group-hover:translate-x-0.5 group-hover:text-violet-300" />
                  </Link>
                ))}
              </div>

              {results.length > 4 && (
                <Link
                  href={`${SEARCH_HREF}?q=${encodeURIComponent(trimmedQuery)}`}
                  onClick={closeSearch}
                  className="flex items-center justify-center gap-2 border-t border-white/[0.07] px-4 py-3 text-xs font-medium text-violet-300 transition-colors hover:bg-violet-400/[0.06] hover:text-violet-200"
                >
                  View all results
                  <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              )}
            </>
          ) : searched ? (
            <div className="px-4 py-8 text-center">
              <Search className="mx-auto mb-3 h-5 w-5 text-white/25" />
              <p className="text-sm font-medium text-white/75">
                No anime found
              </p>
              <p className="mt-1 text-xs text-white/40">
                Try another title or check the spelling.
              </p>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
