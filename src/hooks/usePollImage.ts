import { useEffect } from "react";

export function usePollImage(taskId: string | null, onSuccess: (url: string) => void) {
  useEffect(() => {
    if (!taskId) return;

    let retries = 0;
    const maxRetries = 10;

    const interval = setInterval(async () => {
      try {
        const res = await fetch("/api/image/result", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ taskId }),
        });

        const result = await res.json();
        if (result.status === "completed" && result.imageUrl) {
          onSuccess(result.imageUrl);
          clearInterval(interval);
        } else if (++retries >= maxRetries) {
          clearInterval(interval);
        }
      } catch (err) {
        console.error("Polling error:", err);
        clearInterval(interval);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [taskId]);
}