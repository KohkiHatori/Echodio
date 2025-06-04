import { useEffect, useRef, useState } from "react";

/**
 * Custom hook to manage rotation for a logo.
 * @param isPlaying Whether the animation should run.
 * @param durationMs How long (ms) for a full 360deg rotation. Default: 20000 (20s)
 * @returns rotation angle in degrees (0-360)
 */
export function useRotatingLogo(isPlaying: boolean, durationMs: number = 20000) {
  const [rotation, setRotation] = useState(0);
  const lastTimestamp = useRef<number>(typeof window !== 'undefined' ? performance.now() : 0);

  useEffect(() => {
    let frameId: number;
    const animate = (now: number) => {
      if (isPlaying) {
        const delta = now - lastTimestamp.current;
        lastTimestamp.current = now;
        setRotation((prev) => (prev + delta * (360 / durationMs)) % 360);
        frameId = requestAnimationFrame(animate);
      }
    };
    if (isPlaying) {
      lastTimestamp.current = performance.now();
      frameId = requestAnimationFrame(animate);
    }
    return () => {
      if (frameId) cancelAnimationFrame(frameId);
    };
  }, [isPlaying, durationMs]);

  return rotation;
}