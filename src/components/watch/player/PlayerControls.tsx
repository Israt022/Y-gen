"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  SkipForward,
  Volume2,
  Volume1,
  VolumeX,
  Settings,
  Maximize,
  Minimize,
  Tv,
  Subtitles,
} from "lucide-react";

interface PlayerControlsProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
  currentTime: number;
  duration: number;
  buffered: number;
  onSeek: (time: number) => void;
  volume: number;
  isMuted: boolean;
  onVolumeChange: (volume: number) => void;
  onToggleMute: () => void;
  onSkipForward: () => void;
  onSkipBackward: () => void;
  hasNextEpisode: boolean;
  onNextEpisode?: () => void;
  onToggleSettings: () => void;
  isSettingsOpen: boolean;
  theaterMode: boolean;
  onToggleTheater: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  subtitlesEnabled: boolean;
  onToggleSubtitles: () => void;
  visible: boolean;
}

function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return "00:00";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (h > 0) {
    return `${h}:${m < 10 ? "0" : ""}${m}:${s < 10 ? "0" : ""}${s}`;
  }
  return `${m < 10 ? "0" : ""}${m}:${s < 10 ? "0" : ""}${s}`;
}

export default function PlayerControls({
  isPlaying,
  onTogglePlay,
  currentTime,
  duration,
  buffered,
  onSeek,
  volume,
  isMuted,
  onVolumeChange,
  onToggleMute,
  onSkipForward,
  onSkipBackward,
  hasNextEpisode,
  onNextEpisode,
  onToggleSettings,
  isSettingsOpen,
  theaterMode,
  onToggleTheater,
  isFullscreen,
  onToggleFullscreen,
  subtitlesEnabled,
  onToggleSubtitles,
  visible,
}: PlayerControlsProps) {
  const progressBarRef = useRef<HTMLDivElement>(null);
  const [isHoveringBar, setIsHoveringBar] = useState(false);
  const [hoverPosition, setHoverPosition] = useState(0);
  const [hoverTime, setHoverTime] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const playedPercent = duration > 0 ? (currentTime / duration) * 100 : 0;
  const bufferedPercent = duration > 0 ? (buffered / duration) * 100 : 0;

  const calculateTimeFromEvent = useCallback(
    (e: React.MouseEvent | MouseEvent) => {
      if (!progressBarRef.current || duration <= 0) return 0;
      const rect = progressBarRef.current.getBoundingClientRect();
      const clickX = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
      const ratio = clickX / rect.width;
      return ratio * duration;
    },
    [duration]
  );

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    setHoverPosition(x);
    setHoverTime((x / rect.width) * duration);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    const newTime = calculateTimeFromEvent(e);
    onSeek(newTime);
  };

  useEffect(() => {
    if (!isDragging) return;

    const onGlobalMouseMove = (e: MouseEvent) => {
      const newTime = calculateTimeFromEvent(e);
      onSeek(newTime);
    };

    const onGlobalMouseUp = () => {
      setIsDragging(false);
    };

    window.addEventListener("mousemove", onGlobalMouseMove);
    window.addEventListener("mouseup", onGlobalMouseUp);

    return () => {
      window.removeEventListener("mousemove", onGlobalMouseMove);
      window.removeEventListener("mouseup", onGlobalMouseUp);
    };
  }, [isDragging, calculateTimeFromEvent, onSeek]);

  return (
    <div
      className={`absolute inset-x-0 bottom-0 z-30 flex flex-col justify-end bg-gradient-to-t from-black/90 via-black/50 to-transparent p-3 sm:p-4 transition-opacity duration-300 ${
        visible ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
      onClick={(e) => e.stopPropagation()}
    >
      {/* ─── Timeline scrubber bar ─── */}
      <div
        ref={progressBarRef}
        className="group/timeline relative mb-3 flex h-4 w-full cursor-pointer items-center"
        onMouseEnter={() => setIsHoveringBar(true)}
        onMouseLeave={() => setIsHoveringBar(false)}
        onMouseMove={handleMouseMove}
        onMouseDown={handleMouseDown}
      >
        {/* Hover Time Tooltip */}
        {isHoveringBar && duration > 0 && (
          <div
            className="pointer-events-none absolute -top-8 -translate-x-1/2 rounded-md bg-black/90 px-2 py-0.5 text-[11px] font-bold text-white shadow-lg backdrop-blur-md"
            style={{ left: `${hoverPosition}px` }}
          >
            {formatTime(hoverTime)}
          </div>
        )}

        {/* Track background */}
        <div className="relative h-1 w-full rounded-full bg-white/20 transition-all duration-150 group-hover/timeline:h-2">
          {/* Buffered bar */}
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-white/30"
            style={{ width: `${Math.min(100, bufferedPercent)}%` }}
          />

          {/* Played bar */}
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-violet-500 to-indigo-500"
            style={{ width: `${Math.min(100, playedPercent)}%` }}
          />

          {/* Thumb dot */}
          <div
            className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-md transition-all duration-150 group-hover/timeline:scale-125 h-3 w-3 group-hover/timeline:h-3.5 group-hover/timeline:w-3.5"
            style={{ left: `${Math.min(100, playedPercent)}%` }}
          />
        </div>
      </div>

      {/* ─── Bottom Controls Bar ─── */}
      <div className="flex items-center justify-between gap-2 sm:gap-4 text-white">
        {/* Left: Playback controls + Time */}
        <div className="flex items-center gap-1.5 sm:gap-3">
          {/* Play / Pause */}
          <button
            onClick={onTogglePlay}
            aria-label={isPlaying ? "Pause" : "Play"}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-white transition hover:bg-white/15"
          >
            {isPlaying ? (
              <Pause className="h-5 w-5 fill-white" />
            ) : (
              <Play className="h-5 w-5 fill-white" />
            )}
          </button>

          {/* Backward 10s */}
          <button
            onClick={onSkipBackward}
            aria-label="Rewind 10 seconds"
            className="hidden h-8 w-8 items-center justify-center rounded-lg text-white/80 transition hover:bg-white/15 hover:text-white sm:flex"
            title="Rewind 10s (Left Arrow / J)"
          >
            <RotateCcw className="h-4 w-4" />
          </button>

          {/* Forward 10s */}
          <button
            onClick={onSkipForward}
            aria-label="Skip 10 seconds"
            className="hidden h-8 w-8 items-center justify-center rounded-lg text-white/80 transition hover:bg-white/15 hover:text-white sm:flex"
            title="Skip 10s (Right Arrow / L)"
          >
            <RotateCw className="h-4 w-4" />
          </button>

          {/* Next Episode */}
          {onNextEpisode && (
            <button
              onClick={onNextEpisode}
              disabled={!hasNextEpisode}
              aria-label="Next episode"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-white/80 transition hover:bg-white/15 hover:text-white disabled:pointer-events-none disabled:opacity-30"
              title="Next episode"
            >
              <SkipForward className="h-4 w-4" />
            </button>
          )}

          {/* Volume Group */}
          <div className="group/vol flex items-center gap-1">
            <button
              onClick={onToggleMute}
              aria-label={isMuted ? "Unmute" : "Mute"}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-white/80 transition hover:bg-white/15 hover:text-white"
              title="Mute / Unmute (M)"
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="h-4 w-4 text-red-400" />
              ) : volume < 0.5 ? (
                <Volume1 className="h-4 w-4" />
              ) : (
                <Volume2 className="h-4 w-4" />
              )}
            </button>

            {/* Slider */}
            <div className="w-0 overflow-hidden transition-all duration-200 group-hover/vol:w-16 sm:w-16">
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isMuted ? 0 : volume}
                onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
                aria-label="Volume slider"
                className="h-1 w-16 cursor-pointer appearance-none rounded-lg bg-white/30 accent-primary"
              />
            </div>
          </div>

          {/* Time Display */}
          <div className="ml-1 sm:ml-2 text-xs font-medium text-white/80 tabular-nums">
            <span>{formatTime(currentTime)}</span>
            <span className="mx-1 text-white/40">/</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Right: Subtitles, Settings, Theater, Fullscreen */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Quick Subtitle Toggle */}
          <button
            onClick={onToggleSubtitles}
            aria-label="Toggle subtitles"
            className={`flex h-8 w-8 items-center justify-center rounded-lg transition hover:bg-white/15 ${
              subtitlesEnabled
                ? "text-primary bg-primary/15"
                : "text-white/70 hover:text-white"
            }`}
            title="Toggle Subtitles"
          >
            <Subtitles className="h-4 w-4" />
          </button>

          {/* Settings */}
          <button
            onClick={onToggleSettings}
            aria-label="Player settings"
            className={`flex h-8 w-8 items-center justify-center rounded-lg transition hover:bg-white/15 ${
              isSettingsOpen
                ? "text-primary bg-primary/15"
                : "text-white/70 hover:text-white"
            }`}
            title="Settings (Speed, Quality, Subtitles)"
          >
            <Settings className="h-4 w-4" />
          </button>

          {/* Theater mode */}
          <button
            onClick={onToggleTheater}
            aria-label="Toggle theater mode"
            className={`hidden sm:flex h-8 w-8 items-center justify-center rounded-lg transition hover:bg-white/15 ${
              theaterMode
                ? "text-primary bg-primary/15"
                : "text-white/70 hover:text-white"
            }`}
            title="Theater Mode (T)"
          >
            <Tv className="h-4 w-4" />
          </button>

          {/* Fullscreen */}
          <button
            onClick={onToggleFullscreen}
            aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-white/80 transition hover:bg-white/15 hover:text-white"
            title="Fullscreen (F)"
          >
            {isFullscreen ? (
              <Minimize className="h-4 w-4" />
            ) : (
              <Maximize className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
