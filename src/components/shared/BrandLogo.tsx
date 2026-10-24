
import Link from "next/link";

const JP_SERIF =
  '"Shippori Mincho", "Noto Serif JP", "Hiragino Mincho ProN", "Yu Mincho", YuMincho, serif';

type BrandLogoProps = {
  className?: string;
  onNavigate?: () => void;
};

export default function BrandLogo({
  className = "",
  onNavigate,
}: BrandLogoProps) {
  return (
    <Link
      href="/"
      onClick={onNavigate}
      aria-label="Yūgen — Discover Beyond Worlds, home"
      className={`group inline-flex items-center gap-3 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-violet-300/70 ${className}`}
    >
      <span
        aria-hidden="true"
        style={{ fontFamily: JP_SERIF }}
        className="relative grid h-9 w-9 place-items-center rounded-[10px] border border-violet-300/30 bg-violet-400/[0.06] text-[19px] leading-none text-violet-200 transition-colors duration-500 before:absolute before:inset-[3px] before:rounded-[7px] before:border before:border-violet-300/15 group-hover:border-violet-300/60 group-hover:bg-violet-400/[0.12]"
      >
        幽
      </span>

      <span className="flex flex-col leading-none">
        <span className="text-[17px] font-light tracking-[0.34em] text-white">
          YŪGEN
        </span>

        <span className="mt-1.5 hidden text-[8.5px] tracking-[0.36em] text-white/40 sm:block">
          DISCOVER BEYOND WORLDS
        </span>
      </span>
    </Link>
  );
}
