"use client";

import Link from "next/link";
import { Search, X } from "lucide-react";
import { useEffect, useRef } from "react";

import BrandLogo from "./BrandLogo";
import {
  NAV_ITEMS,
  SIGN_IN_HREF,
  FOCUS_RING,
  isActivePath,
} from "./navbar.config";

type Props = {
  open: boolean;
  pathname: string;
  query: string;
  onQueryChange: (value: string) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onClose: () => void;
};

const JP_SERIF =
  '"Shippori Mincho", "Noto Serif JP", "Hiragino Mincho ProN", "Yu Mincho", YuMincho, serif';

export default function MobileNavDrawer({
  open,
  pathname,
  query,
  onQueryChange,
  onSubmit,
  onClose,
}: Props) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  return (
    <div
      className={`fixed inset-0 z-[60] transition-[visibility] duration-500 lg:hidden ${
        open ? "visible" : "pointer-events-none invisible"
      }`}
    >
      <button
        type="button"
        aria-label="Close menu overlay"
        onClick={onClose}
        className={`absolute inset-0 bg-[#080911]/70 backdrop-blur-sm transition-opacity duration-500 ${
          open ? "opacity-100" : "opacity-0"
        }`}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        className={`absolute right-0 top-0 flex h-full w-[min(88vw,380px)] flex-col border-l border-white/10 bg-[#0b0c17]/95 backdrop-blur-2xl transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-white/[0.08] px-5">
          <BrandLogo onNavigate={onClose} />

          <button
            ref={closeRef}
            type="button"
            aria-label="Close menu"
            onClick={onClose}
            className={`grid h-10 w-10 place-items-center rounded-full border border-white/10 text-white/80 transition-colors hover:border-white/25 hover:text-white ${FOCUS_RING}`}
          >
            <X className="h-[19px] w-[19px]" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 pb-6 pt-6">
          <form role="search" onSubmit={onSubmit}>
            <label htmlFor="mobile-anime-search" className="sr-only">
              Search anime
            </label>

            <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.03] px-4 focus-within:border-violet-300/50">
              <Search className="h-4 w-4 shrink-0 text-white/45" />

              <input
                id="mobile-anime-search"
                type="search"
                value={query}
                onChange={(event) => onQueryChange(event.target.value)}
                placeholder="Search anime"
                autoComplete="off"
                className="h-11 w-full bg-transparent text-[15px] text-white placeholder:text-white/35 outline-none [&::-webkit-search-cancel-button]:hidden"
              />
            </div>
          </form>

          <nav aria-label="Mobile" className="mt-8">
            <ul>
              {NAV_ITEMS.map(({ label, href, jp }, index) => {
                const active = isActivePath(pathname, href);

                return (
                  <li
                    key={href}
                    className={`border-b border-white/[0.06] transition-[opacity,transform] duration-500 ${
                      open
                        ? "translate-x-0 opacity-100"
                        : "translate-x-4 opacity-0"
                    }`}
                    style={{
                      transitionDelay: open ? `${140 + index * 60}ms` : "0ms",
                    }}
                  >
                    <Link
                      href={href}
                      onClick={onClose}
                      aria-current={active ? "page" : undefined}
                      className={`group flex items-center justify-between rounded-md py-4 ${FOCUS_RING}`}
                    >
                      <span className="flex items-center gap-3">
                        <span
                          aria-hidden="true"
                          className={`h-1.5 w-1.5 rounded-full ${
                            active
                              ? "bg-violet-300 shadow-[0_0_10px_2px_rgba(167,139,250,0.6)]"
                              : "bg-transparent group-hover:bg-white/30"
                          }`}
                        />

                        <span
                          className={`text-[26px] font-light tracking-[0.01em] transition-colors ${
                            active
                              ? "text-white"
                              : "text-white/60 group-hover:text-white"
                          }`}
                        >
                          {label}
                        </span>
                      </span>

                      <span
                        aria-hidden="true"
                        lang="ja"
                        style={{ fontFamily: JP_SERIF }}
                        className="text-[13px] text-violet-200/50"
                      >
                        {jp}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>

        <div className="shrink-0 border-t border-white/[0.08] px-5 py-5">
          <Link
            href={SIGN_IN_HREF}
            onClick={onClose}
            className={`flex h-11 w-full items-center justify-center rounded-full border border-violet-300/35 bg-violet-400/10 text-[14px] tracking-[0.03em] text-violet-100 transition-colors duration-300 hover:border-violet-200/70 hover:bg-violet-400/20 hover:text-white ${FOCUS_RING}`}
          >
            Enter Yūgen
          </Link>

          <p className="mt-4 text-center text-[9px] tracking-[0.36em] text-white/30">
            DISCOVER BEYOND WORLDS
          </p>
        </div>
      </div>
    </div>
  );
}