// hooks/useIdleHideUI.ts
'use client'
import { useEffect, useRef } from "react";

export function useIdleHideUI(setShowUI: (v: boolean) => void) {
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const resetIdle = () => {
      setShowUI(true);
      if (idleTimer.current) clearTimeout(idleTimer.current);
      idleTimer.current = setTimeout(() => setShowUI(false), 5000);
    };
    ["mousemove", "mousedown", "touchstart",
      "wheel"].forEach((e) =>
        window.addEventListener(e, resetIdle)
      );

    resetIdle(); // initialize timer

    return () => {
      ["mousemove", "mousedown", "touchstart", "wheel"].forEach((e) =>
        window.removeEventListener(e, resetIdle)
      );
      if (idleTimer.current) clearTimeout(idleTimer.current);
    };
  }, []);
}
