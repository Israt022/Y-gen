export const NAV_ITEMS = [
  { label: "Discover", href: "/", jp: "発見" },
  { label: "Explore", href: "/explore", jp: "探索" },
  { label: "Seasonal", href: "/seasonal", jp: "今期" },
  { label: "Watchlist", href: "/watchlist", jp: "視聴リスト" },
] as const;

export const SIGN_IN_HREF = "/sign-in";
export const SEARCH_HREF = "/explore";
export const NAVBAR_HEIGHT_CLASS = "pt-16";

export const FOCUS_RING =
  "outline-none focus-visible:ring-2 focus-visible:ring-violet-300/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#080911]";

export function isActivePath(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}