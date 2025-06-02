import { useEffect, useCallback } from "react";

export function useGlobalSpacebar(togglePlay: () => void) {
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Only trigger if not focused on an input/textarea/select
    const tag = (e.target as HTMLElement).tagName;
    if (
      e.code === "Space" &&
      tag !== "INPUT" &&
      tag !== "TEXTAREA" &&
      tag !== "SELECT"
    ) {
      e.preventDefault();
      togglePlay();
    }
  }, [togglePlay]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown, { passive: false });
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);
}