import { useEffect } from "react";

export function usePollMusic(
  task_id: string | null,
  onSuccess: (url: string, title: string | null) => void
) {
  useEffect(() => {
    if (!task_id) return;

    let retries = 0;
    const maxRetries = 100;
    // Increase maxRetries!

    const interval = setInterval(async () => {
      try {
        const res = await fetch("/api/music/result", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ task_id }),
        });

        if (res.status === 400 || res.status === 500) {
          console.warn(`Polling stopped due to server error: ${res.status}`);
          clearInterval(interval);
          return;
        }

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
  }, [task_id]);
}
