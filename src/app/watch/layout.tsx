// The watch page has its own dedicated layout that does NOT include the global Navbar.
// This gives a cinematic, fullscreen-style watching experience.
export default function WatchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
