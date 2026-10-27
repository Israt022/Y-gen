"use client";

import { useSyncExternalStore, useMemo } from "react";

export interface WatchProgressItem {
  animeId: number;
  episodeNumber: number | null; // null for movie
  currentTime: number;
  duration: number;
  percentage: number; // 0 to 100
  completed: boolean; // >= 85%
  updatedAt: number; // unix timestamp in ms
  title?: string;
  format?: string | null;
  coverImage?: string | null;
}

const STORAGE_KEY = "yugen_watch_progress_v1";
const PROGRESS_EVENT = "yugen:watch-progress-update";

let cachedRaw = "";
let cachedData: Record<string, WatchProgressItem> = {};

function getSnapshot(): Record<string, WatchProgressItem> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY) || "{}";
    if (raw !== cachedRaw) {
      cachedRaw = raw;
      cachedData = JSON.parse(raw);
    }
    return cachedData;
  } catch {
    return cachedData;
  }
}

const SERVER_SNAPSHOT: Record<string, WatchProgressItem> = {};
function getServerSnapshot() {
  return SERVER_SNAPSHOT;
}

function subscribe(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener(PROGRESS_EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(PROGRESS_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

export function makeKey(animeId: number, episodeNumber: number | null): string {
  return `${animeId}_${episodeNumber ?? "movie"}`;
}

export function getWatchProgress(
  animeId: number,
  episodeNumber: number | null
): WatchProgressItem | null {
  const data = getSnapshot();
  return data[makeKey(animeId, episodeNumber)] ?? null;
}

export function getLatestAnimeProgress(
  animeId: number
): WatchProgressItem | null {
  const data = getSnapshot();
  const prefix = `${animeId}_`;
  let latest: WatchProgressItem | null = null;

  for (const [key, item] of Object.entries(data)) {
    if (key.startsWith(prefix) && item.animeId === animeId) {
      if (!latest || item.updatedAt > latest.updatedAt) {
        latest = item;
      }
    }
  }

  return latest;
}

export function isEpisodeWatched(
  animeId: number,
  episodeNumber: number | null
): boolean {
  const progress = getWatchProgress(animeId, episodeNumber);
  return Boolean(progress?.completed);
}

export function getAllWatchedEpisodes(animeId: number): Set<number> {
  const data = getSnapshot();
  const watched = new Set<number>();
  const prefix = `${animeId}_`;

  for (const [key, item] of Object.entries(data)) {
    if (
      key.startsWith(prefix) &&
      item.animeId === animeId &&
      item.episodeNumber != null &&
      item.completed
    ) {
      watched.add(item.episodeNumber);
    }
  }

  return watched;
}

export function saveWatchProgress(
  item: Omit<WatchProgressItem, "updatedAt" | "percentage" | "completed"> & {
    completed?: boolean;
  }
): void {
  if (typeof window === "undefined") return;

  const duration = Math.max(1, item.duration || 1);
  const currentTime = Math.max(0, item.currentTime || 0);
  const percentage = Math.min(100, Math.round((currentTime / duration) * 100));
  const completed = item.completed ?? percentage >= 85;

  const progressItem: WatchProgressItem = {
    ...item,
    currentTime,
    duration,
    percentage,
    completed,
    updatedAt: Date.now(),
  };

  try {
    const data = { ...getSnapshot() };
    data[makeKey(item.animeId, item.episodeNumber)] = progressItem;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    cachedRaw = "";
    window.dispatchEvent(new CustomEvent(PROGRESS_EVENT));
  } catch (err) {
    console.warn("[WatchProgress] Failed to save:", err);
  }
}

export function clearWatchProgress(
  animeId: number,
  episodeNumber: number | null
): void {
  if (typeof window === "undefined") return;
  try {
    const data = { ...getSnapshot() };
    delete data[makeKey(animeId, episodeNumber)];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    cachedRaw = "";
    window.dispatchEvent(new CustomEvent(PROGRESS_EVENT));
  } catch (err) {
    console.warn("[WatchProgress] Failed to clear:", err);
  }
}

/**
 * Idiomatic React 19 hook using useSyncExternalStore for reactive watch progress
 */
export function useWatchProgress(
  animeId: number,
  episodeNumber: number | null = null
) {
  const data = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const progress = useMemo(
    () => data[makeKey(animeId, episodeNumber)] ?? null,
    [data, animeId, episodeNumber]
  );

  const watchedEpisodes = useMemo(() => {
    const set = new Set<number>();
    const prefix = `${animeId}_`;
    for (const [key, item] of Object.entries(data)) {
      if (
        key.startsWith(prefix) &&
        item.animeId === animeId &&
        item.episodeNumber != null &&
        item.completed
      ) {
        set.add(item.episodeNumber);
      }
    }
    return set;
  }, [data, animeId]);

  const latestProgress = useMemo(() => {
    const prefix = `${animeId}_`;
    let latest: WatchProgressItem | null = null;
    for (const [key, item] of Object.entries(data)) {
      if (key.startsWith(prefix) && item.animeId === animeId) {
        if (!latest || item.updatedAt > latest.updatedAt) {
          latest = item;
        }
      }
    }
    return latest;
  }, [data, animeId]);

  return {
    progress,
    watchedEpisodes,
    latestProgress,
    isWatched: Boolean(progress?.completed),
    saveProgress: (currentTime: number, duration: number, title?: string) =>
      saveWatchProgress({
        animeId,
        episodeNumber,
        currentTime,
        duration,
        title,
      }),
    clearProgress: () => clearWatchProgress(animeId, episodeNumber),
  };
}
