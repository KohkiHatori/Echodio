import { useEffect } from "react";

export function usePollMusic(
  taskId: string | null,
  onSuccess: (url: string, title: string | null) => void
) {
  useEffect(() => {
    if (!taskId) return;

    let retries = 0;
    const maxRetries = 10;

    const interval = setInterval(async () => {
      try {
        const res = await fetch("/api/music/retrieve", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ taskId }),
        });

        const result = await res.json();

        const song = result?.data?.output?.songs?.[0];
        const url = song?.song_path;
        const title = song?.title ?? null;

        if (result.status === "completed" && url) {
          onSuccess(url, title);
          clearInterval(interval);
        } else if (++retries >= maxRetries) {
          clearInterval(interval);
        }
      } catch (err) {
        console.error("Polling error (music):", err);
        clearInterval(interval);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [taskId]);
}
