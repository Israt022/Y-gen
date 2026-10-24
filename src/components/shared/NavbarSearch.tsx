"use client";

import { Search, X } from "lucide-react";
import { useEffect, useRef } from "react";
import { FOCUS_RING } from "./navbar.config";

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
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  return (
    <form
      role="search"
      onSubmit={onSubmit}
      className="hidden items-center lg:flex"
    >
      <div
        className={`overflow-hidden transition-[width,opacity] duration-300 ${
          open ? "w-52 opacity-100" : "w-0 opacity-0"
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
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              event.preventDefault();
              onClose();
            }
          }}
          tabIndex={open ? 0 : -1}
          placeholder="Search anime"
          autoComplete="off"
          className="h-9 w-52 border-b border-white/15 bg-transparent px-1 pr-2 text-[13px] text-white placeholder:text-white/35 outline-none focus:border-violet-300/70 [&::-webkit-search-cancel-button]:hidden"
        />
      </div>

      <button
        ref={buttonRef}
        type="button"
        aria-label={open ? "Close search" : "Search anime"}
        aria-expanded={open}
        title="Search anime (/)"
        onClick={onToggle}
        className={`grid h-9 w-9 place-items-center rounded-full text-white/60 transition-colors duration-300 hover:bg-white/[0.06] hover:text-white ${FOCUS_RING}`}
      >
        {open ? (
          <X className="h-[17px] w-[17px]" />
        ) : (
          <Search className="h-[17px] w-[17px]" />
        )}
      </button>
    </form>
  );
}