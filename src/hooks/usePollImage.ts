'use client'
import { useEffect } from "react";



export function usePollImage(task_id: string | null, onSuccess: (url: string) => void) {
  useEffect(() => {
    if (!task_id) return;

    let retries = 0;
    const maxRetries = 100;

    const interval = setInterval(async () => {
      try {
        const res = await fetch("/api/image/", {
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
        if (result.status === "completed" && result.imageUrl) {
          onSuccess(result.imageUrl);
          console.log("Image URL:", result.imageUrl);
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
  }, [task_id]);
}