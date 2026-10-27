"use client";

import { ArrowLeft, ExternalLink } from "lucide-react";

interface TrailerPlayerProps {
  trailerId: string;
  title: string;
  onClose: () => void;
}

export default function TrailerPlayer({
  trailerId,
  title,
  onClose,
}: TrailerPlayerProps) {
  return (
    <div className="relative h-full w-full bg-black flex flex-col">
      {/* Top bar */}
      <div className="absolute top-0 inset-x-0 z-20 flex items-center justify-between bg-gradient-to-b from-black/90 via-black/50 to-transparent px-4 py-3">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 rounded-lg border border-white/20 bg-black/60 px-2.5 py-1 text-xs font-semibold text-white/90 backdrop-blur-md transition hover:bg-white/20"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Return</span>
          </button>
          <span className="text-xs font-bold uppercase tracking-wider text-primary">
            Official Trailer
          </span>
          <span className="hidden sm:inline text-xs text-white/60 truncate max-w-xs">
            {title}
          </span>
        </div>

        <a
          href={`https://www.youtube.com/watch?v=${trailerId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-[11px] text-white/50 hover:text-white transition"
        >
          <span>Open on YouTube</span>
          <ExternalLink className="h-3 w-3" />
        </a>
      </div>

      {/* Embedded Iframe */}
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${trailerId}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
        title={`${title} Official Trailer`}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        className="h-full w-full border-0"
      />
    </div>
  );
}
