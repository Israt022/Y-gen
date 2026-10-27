"use client";

import { useState } from "react";
import {
  Check,
  Gauge,
  SlidersHorizontal,
  Subtitles,
  Volume2,
  X,
  Sparkles,
} from "lucide-react";

export interface SubtitleTrack {
  id: string;
  label: string;
  srclang: string;
}

interface PlayerSettingsProps {
  isOpen: boolean;
  onClose: () => void;
  playbackSpeed: number;
  onSpeedChange: (speed: number) => void;
  availableSpeeds?: number[];
  currentQuality: string;
  availableQualities: string[];
  onQualityChange: (quality: string) => void;
  subtitles: SubtitleTrack[];
  currentSubtitle: string | null; // null = off
  onSubtitleChange: (trackId: string | null) => void;
  autoNext: boolean;
  onToggleAutoNext: (enabled: boolean) => void;
}

type TabType = "main" | "speed" | "quality" | "subtitles" | "audio";

export default function PlayerSettings({
  isOpen,
  onClose,
  playbackSpeed,
  onSpeedChange,
  availableSpeeds = [0.5, 0.75, 1, 1.25, 1.5, 2],
  currentQuality,
  availableQualities,
  onQualityChange,
  subtitles,
  currentSubtitle,
  onSubtitleChange,
  autoNext,
  onToggleAutoNext,
}: PlayerSettingsProps) {
  const [tab, setTab] = useState<TabType>("main");

  if (!isOpen) return null;

  return (
    <div
      className="absolute bottom-16 right-4 z-50 w-72 rounded-2xl border border-white/15 bg-[#090d1a]/95 p-3 text-sm text-foreground shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-2 px-1">
        <div className="flex items-center gap-2">
          {tab !== "main" && (
            <button
              onClick={() => setTab("main")}
              className="text-xs text-text-muted hover:text-foreground font-medium"
            >
              &larr; Back
            </button>
          )}
          <span className="font-semibold text-xs uppercase tracking-wider text-primary">
            {tab === "main" && "Player Settings"}
            {tab === "speed" && "Playback Speed"}
            {tab === "quality" && "Quality Rendition"}
            {tab === "subtitles" && "Captions & Subtitles"}
            {tab === "audio" && "Audio Language"}
          </span>
        </div>
        <button
          onClick={onClose}
          className="rounded-lg p-1 text-text-muted hover:bg-white/10 hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Main menu */}
      {tab === "main" && (
        <div className="space-y-1">
          {/* Speed */}
          <button
            onClick={() => setTab("speed")}
            className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left hover:bg-white/[0.08] transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <Gauge className="h-4 w-4 text-text-muted" />
              <span>Speed</span>
            </div>
            <span className="text-xs text-primary font-medium">
              {playbackSpeed === 1 ? "Normal" : `${playbackSpeed}x`}
            </span>
          </button>

          {/* Quality */}
          <button
            onClick={() => setTab("quality")}
            className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left hover:bg-white/[0.08] transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <SlidersHorizontal className="h-4 w-4 text-text-muted" />
              <span>Quality</span>
            </div>
            <span className="text-xs text-primary font-medium">
              {currentQuality}
            </span>
          </button>

          {/* Subtitles */}
          <button
            onClick={() => setTab("subtitles")}
            className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left hover:bg-white/[0.08] transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <Subtitles className="h-4 w-4 text-text-muted" />
              <span>Subtitles</span>
            </div>
            <span className="text-xs text-text-muted font-medium">
              {currentSubtitle
                ? subtitles.find((s) => s.id === currentSubtitle)?.label ||
                  "Enabled"
                : "Off"}
            </span>
          </button>

          {/* Audio */}
          <button
            onClick={() => setTab("audio")}
            className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left hover:bg-white/[0.08] transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <Volume2 className="h-4 w-4 text-text-muted" />
              <span>Audio</span>
            </div>
            <span className="text-xs text-text-muted">Japanese (Original)</span>
          </button>

          {/* Auto Next Episode */}
          <div className="flex w-full items-center justify-between border-t border-white/10 pt-2 px-3 py-1.5">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-amber-400" />
              <span className="text-xs font-medium">Auto-Play Next</span>
            </div>
            <button
              onClick={() => onToggleAutoNext(!autoNext)}
              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                autoNext ? "bg-primary" : "bg-white/20"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                  autoNext ? "translate-x-4" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </div>
      )}

      {/* Speed Submenu */}
      {tab === "speed" && (
        <div className="space-y-0.5">
          {availableSpeeds.map((s) => (
            <button
              key={s}
              onClick={() => {
                onSpeedChange(s);
                setTab("main");
              }}
              className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left hover:bg-white/[0.08]"
            >
              <span>{s === 1 ? "1.0x (Normal)" : `${s}x`}</span>
              {playbackSpeed === s && <Check className="h-4 w-4 text-primary" />}
            </button>
          ))}
        </div>
      )}

      {/* Quality Submenu */}
      {tab === "quality" && (
        <div className="space-y-0.5">
          {availableQualities.length > 0 ? (
            availableQualities.map((q) => (
              <button
                key={q}
                onClick={() => {
                  onQualityChange(q);
                  setTab("main");
                }}
                className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left hover:bg-white/[0.08]"
              >
                <span>{q}</span>
                {currentQuality === q && (
                  <Check className="h-4 w-4 text-primary" />
                )}
              </button>
            ))
          ) : (
            <div className="py-4 text-center text-xs text-text-muted">
              Source provides a single direct stream rendition.
            </div>
          )}
        </div>
      )}

      {/* Subtitles Submenu */}
      {tab === "subtitles" && (
        <div className="space-y-0.5">
          <button
            onClick={() => {
              onSubtitleChange(null);
              setTab("main");
            }}
            className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left hover:bg-white/[0.08]"
          >
            <span>Off</span>
            {currentSubtitle === null && (
              <Check className="h-4 w-4 text-primary" />
            )}
          </button>
          {subtitles.length > 0 ? (
            subtitles.map((sub) => (
              <button
                key={sub.id}
                onClick={() => {
                  onSubtitleChange(sub.id);
                  setTab("main");
                }}
                className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left hover:bg-white/[0.08]"
              >
                <span>{sub.label}</span>
                {currentSubtitle === sub.id && (
                  <Check className="h-4 w-4 text-primary" />
                )}
              </button>
            ))
          ) : (
            <div className="py-3 px-2 text-center text-xs text-text-muted">
              No embedded subtitle tracks detected in this media source.
            </div>
          )}
        </div>
      )}

      {/* Audio Submenu */}
      {tab === "audio" && (
        <div className="space-y-0.5 py-1">
          <div className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left bg-white/[0.06]">
            <span>Japanese (Original Audio)</span>
            <Check className="h-4 w-4 text-primary" />
          </div>
          <p className="px-3 pt-2 text-[11px] text-text-muted">
            Multi-track audio is governed by the stream source container.
          </p>
        </div>
      )}
    </div>
  );
}
