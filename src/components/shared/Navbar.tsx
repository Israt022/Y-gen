"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, Search } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import BrandLogo from "./BrandLogo";
import NavbarSearch from "./NavbarSearch";
import MobileNavDrawer from "./MobileNavDrawer";
import {
  NAV_ITEMS,
  SIGN_IN_HREF,
  SEARCH_HREF,
  FOCUS_RING,
  isActivePath,
} from "./navbar.config";

export default function Navbar() {
  const pathname = usePathname() ?? "";
  const router = useRouter();

  if (pathname.startsWith("/watch")) {
    return null;
  }

  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const updateScroll = () => setScrolled(window.scrollY > 8);

    updateScroll();
    window.addEventListener("scroll", updateScroll, { passive: true });

    return () => window.removeEventListener("scroll", updateScroll);
  }, []);

  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const isTyping =
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.isContentEditable;

      if (isTyping || window.innerWidth < 1024) return;

      const slash = event.key === "/" && !event.ctrlKey &&
        !event.metaKey && !event.altKey;
      const commandK =
        (event.ctrlKey || event.metaKey) &&
        event.key.toLowerCase() === "k";

      if (slash || commandK) {
        event.preventDefault();
        setSearchOpen(true);
      }
    };

    document.addEventListener("keydown", handleShortcut);
    return () => document.removeEventListener("keydown", handleShortcut);
  }, []);

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  const submitSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const value = query.trim();
    if (!value) return;

    router.push(`${SEARCH_HREF}?q=${encodeURIComponent(value)}`);
    setSearchOpen(false);
    setMenuOpen(false);
    setQuery("");
  };

  const toggleSearch = () => {
    if (searchOpen) {
      setSearchOpen(false);
      setQuery("");
    } else {
      setSearchOpen(true);
    }
  };

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 h-16 border-b transition-[background-color,border-color,backdrop-filter] duration-500 ${scrolled
          ? "border-white/[0.08] bg-[#080911]/75 backdrop-blur-xl"
          : "border-transparent bg-[#080911]/0"
          }`}
      >
        <div className="mx-auto grid h-full max-w-[1400px] grid-cols-[1fr_auto] items-center gap-4 px-5 sm:px-8 lg:grid-cols-[1fr_auto_1fr]">
          <div className="justify-self-start">
            <BrandLogo />
          </div>

          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {NAV_ITEMS.map(({ label, href }) => {
                const active = isActivePath(pathname, href);

                return (
                  <li key={href}>
                    <Link
                      href={href}
                      aria-current={active ? "page" : undefined}
                      className={`group relative inline-flex h-9 items-center rounded-md px-4 text-[13px] tracking-[0.04em] transition-colors duration-300 ${FOCUS_RING} ${active
                        ? "text-white"
                        : "text-white/55 hover:text-white"
                        }`}
                    >
                      {label}

                      <span
                        aria-hidden="true"
                        className={`pointer-events-none absolute inset-x-4 -bottom-[14px] h-px origin-center bg-gradient-to-r from-transparent via-violet-300 to-transparent transition-transform duration-500 ${active
                          ? "scale-x-100"
                          : "scale-x-0 group-hover:scale-x-50"
                          }`}
                      />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center justify-self-end gap-1.5">
            <NavbarSearch
              open={searchOpen}
              query={query}
              onQueryChange={setQuery}
              onToggle={toggleSearch}
              onSubmit={submitSearch}
              onClose={() => {
                setSearchOpen(false);
                setQuery("");
              }}
            />

            <Link
              href={SIGN_IN_HREF}
              className={`ml-1 hidden h-9 items-center rounded-full border border-violet-300/35 bg-violet-400/10 px-5 text-[13px] tracking-[0.03em] text-violet-100 transition-[border-color,background-color,color,box-shadow] duration-300 hover:border-violet-200/70 hover:bg-violet-400/20 hover:text-white hover:shadow-[0_0_28px_-8px_rgba(167,139,250,0.7)] lg:inline-flex ${FOCUS_RING}`}
            >
              Enter Yūgen
            </Link>

            <button
              type="button"
              aria-label="Search anime"
              onClick={() => setMenuOpen(true)}
              className={`grid h-10 w-10 place-items-center rounded-full text-white/70 transition-colors hover:bg-white/[0.06] hover:text-white lg:hidden ${FOCUS_RING}`}
            >
              <Search className="h-[19px] w-[19px]" />
            </button>

            <button
              type="button"
              aria-label="Open menu"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen(true)}
              className={`grid h-10 w-10 place-items-center rounded-full border border-white/10 text-white/80 transition-colors hover:border-white/25 hover:text-white lg:hidden ${FOCUS_RING}`}
            >
              <Menu className="h-[19px] w-[19px]" />
            </button>
          </div>
        </div>
      </header>

      <MobileNavDrawer
        open={menuOpen}
        pathname={pathname}
        query={query}
        onQueryChange={setQuery}
        onSubmit={submitSearch}
        onClose={closeMenu}
      />
    </>
  );
}