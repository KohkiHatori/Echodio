'use client'
import { useEffect } from "react";

export function usePollMusic(
  task_id: string | null,
  onSuccess: (url: string, title: string | null, task_id: string) => void
) {
  useEffect(() => {
    if (!task_id) return;

    let retries = 0;
    const maxRetries = 100;

    const interval = setInterval(async () => {
      try {
        const res = await fetch("/api/music/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ task_id }),
        });

        const result = await res.json();
        console.log(`🎧 Polling result:`, result);

        const songs = result?.data?.output?.songs;
        const song = songs?.[0];
        const url = song?.song_path;
        const title = song?.title ?? null;

        if (result.data?.status === "completed" && url) {
          console.log("✅ Music is ready:", { url, title });
          onSuccess(url, title, task_id);
          clearInterval(interval);
        } else {
          console.log(`⏳ Poll #${retries + 1} - Status: ${result.data?.status} (waiting...)`);
        }

        if (++retries >= maxRetries) {
          console.warn("⏹️ Max retries reached, stopping polling.");
          clearInterval(interval);
        }
      } catch (err) {
        console.error("❌ Polling error:", err);
        clearInterval(interval);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [task_id]);
}
