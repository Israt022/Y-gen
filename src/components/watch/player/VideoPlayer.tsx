"use client";

import {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import {
  Play,
  Video,
  X,
} from "lucide-react";
import type { AnimeDetail } from "@/../server/src/types/anime.types";
import PlayerControls from "./PlayerControls";
import PlayerSettings, { SubtitleTrack } from "./PlayerSettings";
import PlaybackFallback from "./PlaybackFallback";
import TrailerPlayer from "./TrailerPlayer";
import {
  useWatchProgress,
  saveWatchProgress,
} from "@/lib/watch-progress";

export interface VideoSource {
  url: string;
  title?: string;
  subtitles?: Array<{
    id: string;
    label: string;
    src: string;
    srclang: string;
    default?: boolean;
  }>;
}

interface VideoPlayerProps {
  anime: AnimeDetail;
  episodeNumber: number | null; // null for movie
  isMovie: boolean;
  episodeTitle: string | null;
  videoSource?: VideoSource | null;
  onEnded?: () => void;
  hasNextEpisode: boolean;
  onNextEpisode?: () => void;
  theaterMode: boolean;
  onToggleTheater: () => void;
  initialSeekTime?: number;
}

// Open-source legitimate test videos for immediate testing
const DEMO_SOURCES: Array<{
  name: string;
  description: string;
  source: VideoSource;
}> = [
  {
    name: "Tears of Steel (Open Sci-Fi / Anime Short)",
    description: "1080p licensed open-source media by Blender Foundation with English subtitles",
    source: {
      url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
      title: "Tears of Steel (Demo)",
      subtitles: [
        {
          id: "en",
          label: "English [CC]",
          src: "data:text/vtt;charset=utf-8,WEBVTT%0A%0A1%0A00:00:02.000%20-->%2000:00:06.000%0AWelcome%20to%20Y%C5%ABGEN%20Anime%20Player%0A%0A2%0A00:00:08.000%20-->%2000:00:14.000%0AHigh-fidelity%20streaming%20experience%20active",
          srclang: "en",
          default: true,
        },
      ],
    },
  },
  {
    name: "Sintel Open Animation Clip",
    description: "High-definition animation clip for player responsiveness testing",
    source: {
      url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
      title: "Sintel (Demo)",
    },
  },
];

export default function VideoPlayer({
  anime,
  episodeNumber,
  isMovie,
  episodeTitle,
  videoSource: initialSource,
  onEnded,
  hasNextEpisode,
  onNextEpisode,
  theaterMode,
  onToggleTheater,
  initialSeekTime,
}: VideoPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // User-selected custom or demo source
  const [customSource, setCustomSource] = useState<VideoSource | null>(null);
  const activeSource = customSource ?? initialSource ?? null;

  // Stream source loader modal
  const [streamModalOpen, setStreamModalOpen] = useState(false);
  const [customUrlInput, setCustomUrlInput] = useState("");

  // Official Trailer state
  const hasTrailer = Boolean(
    anime.trailer?.id && anime.trailer.site === "youtube"
  );
  const [isPlayingTrailer, setIsPlayingTrailer] = useState(false);

  // Playback state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [autoNext, setAutoNext] = useState(true);

  // Quality & Subtitles (derived cleanly without cascading renders)
  const [currentQuality, setCurrentQuality] = useState("Auto");
  const [availableQualities, setAvailableQualities] = useState<string[]>([
    "Auto",
  ]);

  const subtitles: SubtitleTrack[] = useMemo(() => {
    return (
      activeSource?.subtitles?.map((s) => ({
        id: s.id,
        label: s.label,
        srclang: s.srclang,
      })) ?? []
    );
  }, [activeSource]);

  const defaultSubId = useMemo(
    () => activeSource?.subtitles?.find((s) => s.default)?.id ?? null,
    [activeSource]
  );
  const [selectedSubtitle, setSelectedSubtitle] = useState<string | null | undefined>(
    undefined
  );
  const currentSubtitle =
    selectedSubtitle !== undefined ? selectedSubtitle : defaultSubId;

  // UI interaction state
  const [isControlsVisible, setIsControlsVisible] = useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hideControlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Watch progress & Resume prompt
  const { progress: savedProgress } = useWatchProgress(anime.id, episodeNumber);
  const [resumeDismissed, setResumeDismissed] = useState(false);

  const showResumeBanner = Boolean(
    !resumeDismissed &&
      savedProgress &&
      savedProgress.currentTime > 5 &&
      !savedProgress.completed
  );

  const animeTitle = anime.title.english || anime.title.romaji;

  // Show a momentary HUD toast message (e.g. "+10s", "Volume 80%")
  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    toastTimeoutRef.current = setTimeout(() => {
      setToastMessage(null);
    }, 1200);
  }, []);

  // Reset controls hide timer
  const resetControlsTimeout = useCallback(() => {
    setIsControlsVisible(true);
    if (hideControlsTimeoutRef.current) clearTimeout(hideControlsTimeoutRef.current);

    if (isPlaying) {
      hideControlsTimeoutRef.current = setTimeout(() => {
        if (!isSettingsOpen) {
          setIsControlsVisible(false);
        }
      }, 2500);
    }
  }, [isPlaying, isSettingsOpen]);

  // Play / Pause
  const togglePlay = useCallback(() => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
          showToast("Play");
        })
        .catch(() => {});
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
      showToast("Paused");
    }
  }, [showToast]);

  // Seek
  const handleSeek = useCallback(
    (time: number) => {
      if (!videoRef.current) return;
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    },
    []
  );

  // Skip forward / backward
  const handleSkipForward = useCallback(() => {
    if (!videoRef.current) return;
    const nextTime = Math.min(
      videoRef.current.duration || 0,
      videoRef.current.currentTime + 10
    );
    handleSeek(nextTime);
    showToast("+10s");
  }, [handleSeek, showToast]);

  const handleSkipBackward = useCallback(() => {
    if (!videoRef.current) return;
    const prevTime = Math.max(0, videoRef.current.currentTime - 10);
    handleSeek(prevTime);
    showToast("-10s");
  }, [handleSeek, showToast]);

  // Volume
  const handleVolumeChange = useCallback((newVol: number) => {
    if (!videoRef.current) return;
    const clamped = Math.max(0, Math.min(1, newVol));
    videoRef.current.volume = clamped;
    videoRef.current.muted = clamped === 0;
    setVolume(clamped);
    setIsMuted(clamped === 0);
  }, []);

  const handleToggleMute = useCallback(() => {
    if (!videoRef.current) return;
    const willMute = !isMuted;
    videoRef.current.muted = willMute;
    setIsMuted(willMute);
    showToast(willMute ? "Muted" : `Volume ${Math.round(volume * 100)}%`);
  }, [isMuted, volume, showToast]);

  // Speed
  const handleSpeedChange = useCallback(
    (speed: number) => {
      if (!videoRef.current) return;
      videoRef.current.playbackRate = speed;
      setPlaybackSpeed(speed);
      showToast(`${speed}x Speed`);
    },
    [showToast]
  );

  // Fullscreen
  const handleToggleFullscreen = useCallback(() => {
    if (!containerRef.current) return;

    if (!document.fullscreenElement) {
      containerRef.current
        .requestFullscreen()
        .then(() => setIsFullscreen(true))
        .catch(() => {});
    } else {
      document
        .exitFullscreen()
        .then(() => setIsFullscreen(false))
        .catch(() => {});
    }
  }, []);

  // Listen to fullscreenchange
  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener("fullscreenchange", handleFsChange);
    return () => document.removeEventListener("fullscreenchange", handleFsChange);
  }, []);

  // Subtitle track selection
  const handleSubtitleChange = useCallback((trackId: string | null) => {
    setSelectedSubtitle(trackId);
    if (!videoRef.current) return;

    const textTracks = videoRef.current.textTracks;
    for (let i = 0; i < textTracks.length; i++) {
      const track = textTracks[i];
      if (trackId && (track.id === trackId || track.language === trackId)) {
        track.mode = "showing";
      } else {
        track.mode = "disabled";
      }
    }
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input
      const target = e.target as HTMLElement | null;
      if (
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.isContentEditable
      ) {
        return;
      }

      switch (e.key.toLowerCase()) {
        case " ":
        case "k":
          e.preventDefault();
          togglePlay();
          break;
        case "arrowleft":
        case "j":
          e.preventDefault();
          handleSkipBackward();
          break;
        case "arrowright":
        case "l":
          e.preventDefault();
          handleSkipForward();
          break;
        case "arrowup":
          e.preventDefault();
          handleVolumeChange(Math.min(1, volume + 0.1));
          showToast(`Vol ${Math.round(Math.min(1, volume + 0.1) * 100)}%`);
          break;
        case "arrowdown":
          e.preventDefault();
          handleVolumeChange(Math.max(0, volume - 0.1));
          showToast(`Vol ${Math.round(Math.max(0, volume - 0.1) * 100)}%`);
          break;
        case "m":
          e.preventDefault();
          handleToggleMute();
          break;
        case "f":
          e.preventDefault();
          handleToggleFullscreen();
          break;
        case "t":
          e.preventDefault();
          onToggleTheater();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    togglePlay,
    handleSkipBackward,
    handleSkipForward,
    handleVolumeChange,
    handleToggleMute,
    handleToggleFullscreen,
    onToggleTheater,
    volume,
    showToast,
  ]);

  // Video element events
  const onTimeUpdate = () => {
    if (!videoRef.current) return;
    const ct = videoRef.current.currentTime;
    const dur = videoRef.current.duration || 0;
    setCurrentTime(ct);

    // Save progress periodically (every ~3s or on significant changes)
    if (dur > 0 && Math.floor(ct) % 3 === 0) {
      saveWatchProgress({
        animeId: anime.id,
        episodeNumber,
        currentTime: ct,
        duration: dur,
        title: episodeTitle || `${animeTitle} Ep ${episodeNumber ?? 1}`,
        format: anime.format,
      });
    }
  };

  const onProgress = () => {
    if (!videoRef.current) return;
    const buf = videoRef.current.buffered;
    if (buf.length > 0) {
      setBuffered(buf.end(buf.length - 1));
    }
  };

  const onLoadedMetadata = () => {
    if (!videoRef.current) return;
    const dur = videoRef.current.duration || 0;
    setDuration(dur);

    // Detect actual video dimensions
    const height = videoRef.current.videoHeight;
    if (height >= 1080) {
      setAvailableQualities(["1080p FHD", "720p HD", "Auto"]);
      setCurrentQuality("1080p FHD");
    } else if (height >= 720) {
      setAvailableQualities(["720p HD", "480p", "Auto"]);
      setCurrentQuality("720p HD");
    } else if (height > 0) {
      setAvailableQualities([`${height}p`, "Auto"]);
      setCurrentQuality(`${height}p`);
    }

    // Auto seek if initialSeekTime passed
    if (initialSeekTime && initialSeekTime > 0) {
      videoRef.current.currentTime = initialSeekTime;
    }
  };

  const handleVideoEnded = () => {
    setIsPlaying(false);
    if (duration > 0) {
      saveWatchProgress({
        animeId: anime.id,
        episodeNumber,
        currentTime: duration,
        duration,
        title: episodeTitle || `${animeTitle} Ep ${episodeNumber ?? 1}`,
        format: anime.format,
        completed: true,
      });
    }

    if (onEnded) onEnded();

    // Auto next episode
    if (autoNext && hasNextEpisode && onNextEpisode) {
      showToast("Playing Next Episode...");
      setTimeout(() => {
        onNextEpisode();
      }, 1500);
    }
  };

  // Resume button click
  const handleResume = () => {
    if (!videoRef.current || !savedProgress) return;
    videoRef.current.currentTime = savedProgress.currentTime;
    setCurrentTime(savedProgress.currentTime);
    setResumeDismissed(true);
    showToast(`Resumed at ${Math.floor(savedProgress.currentTime / 60)}m`);
    videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
  };

  return (
    <div
      ref={containerRef}
      className={`group/player relative flex w-full flex-col items-center justify-center overflow-hidden bg-black select-none ${
        theaterMode ? "aspect-[21/9] max-h-[85vh]" : "aspect-[16/9]"
      }`}
      onMouseMove={resetControlsTimeout}
      onMouseLeave={() => isPlaying && setIsControlsVisible(false)}
      onClick={togglePlay}
    >
      {/* ─── Mode A: Official YouTube Trailer ─── */}
      {isPlayingTrailer && hasTrailer ? (
        <TrailerPlayer
          trailerId={anime.trailer!.id}
          title={animeTitle}
          onClose={() => setIsPlayingTrailer(false)}
        />
      ) : activeSource ? (
        /* ─── Mode B: HTML5 Video Player Engine ─── */
        <>
          <video
            ref={videoRef}
            src={activeSource.url}
            playsInline
            className="h-full w-full object-contain"
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onTimeUpdate={onTimeUpdate}
            onProgress={onProgress}
            onLoadedMetadata={onLoadedMetadata}
            onEnded={handleVideoEnded}
            crossOrigin="anonymous"
          >
            {activeSource.subtitles?.map((sub) => (
              <track
                key={sub.id}
                id={sub.id}
                kind="subtitles"
                label={sub.label}
                src={sub.src}
                srcLang={sub.srclang}
                default={sub.default}
              />
            ))}
          </video>

          {/* Big Center Play/Pause Overlay Pulse */}
          {!isPlaying && (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-[2px]">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-violet-600/90 text-white shadow-2xl shadow-violet-600/50 backdrop-blur-md transition-transform group-hover/player:scale-110">
                <Play className="h-9 w-9 fill-white ml-1" />
              </div>
            </div>
          )}

          {/* Top Title Overlay on Hover */}
          <div
            className={`pointer-events-none absolute inset-x-0 top-0 z-20 flex items-center justify-between bg-gradient-to-b from-black/80 via-black/40 to-transparent p-4 transition-opacity duration-300 ${
              isControlsVisible ? "opacity-100" : "opacity-0"
            }`}
          >
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-primary">
                {isMovie ? "Movie" : `Episode ${episodeNumber ?? 1}`}
              </p>
              <h3 className="text-sm font-semibold text-white truncate max-w-md">
                {episodeTitle || animeTitle}
              </h3>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setStreamModalOpen(true);
              }}
              className="pointer-events-auto rounded-lg border border-white/20 bg-black/40 px-2.5 py-1 text-xs font-medium text-white/80 hover:bg-white/20 transition"
            >
              Switch Stream
            </button>
          </div>

          {/* Resume Playback Prompt Banner */}
          {showResumeBanner && savedProgress && (
            <div
              className="absolute top-16 left-4 z-30 flex items-center gap-3 rounded-xl border border-violet-500/30 bg-[#090d1a]/95 px-4 py-2.5 text-xs text-white shadow-2xl backdrop-blur-xl animate-in slide-in-from-top-2 duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              <div>
                <p className="font-semibold text-primary">Continue Watching?</p>
                <p className="text-white/60">
                  Resume from {Math.floor(savedProgress.currentTime / 60)}:
                  {String(Math.floor(savedProgress.currentTime % 60)).padStart(
                    2,
                    "0"
                  )}
                </p>
              </div>
              <button
                onClick={handleResume}
                className="rounded-lg bg-primary px-3 py-1 font-bold text-white transition hover:bg-primary-hover"
              >
                Resume
              </button>
              <button
                onClick={() => setResumeDismissed(true)}
                className="text-white/40 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* HUD Toast (Shortcut Feedback) */}
          {toastMessage && (
            <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 rounded-xl bg-black/80 px-4 py-2 text-sm font-bold text-white shadow-2xl backdrop-blur-md animate-in fade-in zoom-in-90 duration-150">
              {toastMessage}
            </div>
          )}

          {/* Player Controls Bar */}
          <PlayerControls
            isPlaying={isPlaying}
            onTogglePlay={togglePlay}
            currentTime={currentTime}
            duration={duration}
            buffered={buffered}
            onSeek={handleSeek}
            volume={volume}
            isMuted={isMuted}
            onVolumeChange={handleVolumeChange}
            onToggleMute={handleToggleMute}
            onSkipForward={handleSkipForward}
            onSkipBackward={handleSkipBackward}
            hasNextEpisode={hasNextEpisode}
            onNextEpisode={onNextEpisode}
            onToggleSettings={() => setIsSettingsOpen((v) => !v)}
            isSettingsOpen={isSettingsOpen}
            theaterMode={theaterMode}
            onToggleTheater={onToggleTheater}
            isFullscreen={isFullscreen}
            onToggleFullscreen={handleToggleFullscreen}
            subtitlesEnabled={currentSubtitle !== null}
            onToggleSubtitles={() => {
              if (currentSubtitle) {
                handleSubtitleChange(null);
                showToast("Subtitles Off");
              } else if (subtitles.length > 0) {
                handleSubtitleChange(subtitles[0].id);
                showToast(`Subtitles: ${subtitles[0].label}`);
              } else {
                showToast("No Subtitles in Source");
              }
            }}
            visible={isControlsVisible || !isPlaying}
          />

          {/* Settings Popover */}
          <PlayerSettings
            isOpen={isSettingsOpen}
            onClose={() => setIsSettingsOpen(false)}
            playbackSpeed={playbackSpeed}
            onSpeedChange={handleSpeedChange}
            currentQuality={currentQuality}
            availableQualities={availableQualities}
            onQualityChange={(q) => {
              setCurrentQuality(q);
              showToast(`Quality: ${q}`);
            }}
            subtitles={subtitles}
            currentSubtitle={currentSubtitle}
            onSubtitleChange={(s) => {
              handleSubtitleChange(s);
              showToast(s ? "Subtitles Enabled" : "Subtitles Off");
            }}
            autoNext={autoNext}
            onToggleAutoNext={setAutoNext}
          />
        </>
      ) : (
        /* ─── Mode C: Polished Playback Fallback ─── */
        <PlaybackFallback
          anime={anime}
          isMovie={isMovie}
          episodeNumber={episodeNumber}
          hasTrailer={hasTrailer}
          onWatchTrailer={() => setIsPlayingTrailer(true)}
          onOpenStreamModal={() => setStreamModalOpen(true)}
        />
      )}

      {/* ─── Stream Source Selector Modal ─── */}
      {streamModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md animate-in fade-in duration-150"
          onClick={(e) => {
            e.stopPropagation();
            setStreamModalOpen(false);
          }}
        >
          <div
            className="w-full max-w-lg rounded-2xl border border-white/15 bg-[#090d1a] p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Video className="h-5 w-5 text-primary" />
                <h3 className="text-base font-bold text-white">
                  Load Stream Source
                </h3>
              </div>
              <button
                onClick={() => setStreamModalOpen(false)}
                className="rounded-lg p-1 text-text-muted hover:bg-white/10 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="text-xs text-white/70 mb-4">
              Load an authorized direct video URL (MP4, WebM) or test our
              built-in high-performance media engine using licensed demo clips.
            </p>

            {/* Demo clips */}
            <div className="space-y-2 mb-5">
              <p className="text-[11px] font-bold uppercase tracking-wider text-primary">
                Licensed Demonstration Streams
              </p>
              {DEMO_SOURCES.map((demo) => (
                <button
                  key={demo.name}
                  onClick={() => {
                    setCustomSource(demo.source);
                    setIsPlayingTrailer(false);
                    setStreamModalOpen(false);
                  }}
                  className="w-full rounded-xl border border-white/10 bg-white/[0.04] p-3 text-left transition hover:border-primary/40 hover:bg-primary/10"
                >
                  <p className="text-xs font-semibold text-white">
                    {demo.name}
                  </p>
                  <p className="text-[11px] text-white/60 mt-0.5">
                    {demo.description}
                  </p>
                </button>
              ))}
            </div>

            {/* Custom URL input */}
            <div className="border-t border-white/10 pt-4">
              <label className="block text-xs font-semibold text-white/80 mb-2">
                Custom Video Stream URL
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  placeholder="https://example.com/video.mp4"
                  value={customUrlInput}
                  onChange={(e) => setCustomUrlInput(e.target.value)}
                  className="flex-1 rounded-xl border border-white/15 bg-white/[0.06] px-3 py-2 text-xs text-white placeholder-white/30 focus:border-primary focus:outline-none"
                />
                <button
                  onClick={() => {
                    if (customUrlInput.trim()) {
                      setCustomSource({
                        url: customUrlInput.trim(),
                        title: "Custom Stream",
                      });
                      setIsPlayingTrailer(false);
                      setStreamModalOpen(false);
                    }
                  }}
                  disabled={!customUrlInput.trim()}
                  className="rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white transition hover:bg-primary-hover disabled:opacity-40"
                >
                  Load
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
