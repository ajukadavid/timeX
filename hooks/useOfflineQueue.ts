"use client";

import { useCallback, useEffect, useState } from "react";

// ─── Types ────────────────────────────────────────────────────

export interface QueuedClockIn {
  id: string;
  type: "clockIn";
  timestamp: number;      // ms — when the action was taken offline
  latitude?: number;
  longitude?: number;
}

export type QueuedAction = QueuedClockIn;

// ─── Persistence ──────────────────────────────────────────────

const QUEUE_KEY = "logasiko_offline_queue_v1";

function loadQueue(): QueuedAction[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(QUEUE_KEY) ?? "[]") as QueuedAction[];
  } catch {
    return [];
  }
}

function persistQueue(q: QueuedAction[]) {
  localStorage.setItem(QUEUE_KEY, JSON.stringify(q));
}

// ─── Hook ─────────────────────────────────────────────────────

export function useOfflineQueue() {
  const [isOnline, setIsOnline] = useState(() =>
    typeof navigator !== "undefined" ? navigator.onLine : true
  );
  const [queue, setQueue] = useState<QueuedAction[]>(() => loadQueue());

  useEffect(() => {
    const onOnline = () => setIsOnline(true);
    const onOffline = () => setIsOnline(false);
    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);
    return () => {
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
    };
  }, []);

  const enqueue = useCallback(
    (action: Omit<QueuedAction, "id">): QueuedAction => {
      const item: QueuedAction = { ...action, id: crypto.randomUUID() } as QueuedAction;
      setQueue((prev) => {
        const next = [...prev, item];
        persistQueue(next);
        return next;
      });
      return item;
    },
    []
  );

  const dequeue = useCallback((id: string) => {
    setQueue((prev) => {
      const next = prev.filter((a) => a.id !== id);
      persistQueue(next);
      return next;
    });
  }, []);

  const clearQueue = useCallback(() => {
    setQueue([]);
    persistQueue([]);
  }, []);

  return { isOnline, queue, enqueue, dequeue, clearQueue };
}
