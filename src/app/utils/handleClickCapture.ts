import React from "react";
import { togglePlay } from "./togglePlay";

// Track if the weather widget is being resized
let isWeatherWidgetResizing = false;

// Expose a setter for the weather widget to use
export function setWeatherWidgetResizing(val: boolean) {
  isWeatherWidgetResizing = val;
}

// Add at the top
declare global {
  interface Window { __weatherWidgetJustResized?: boolean }
}

export function handleMainUIClickCapture(
  e: React.MouseEvent,
  options: {
    setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>;
    setOverlayIcon: (v: 'play' | 'pause' | null) => void;
    musicQueue: any[];
    currentIndex: number;
  }
) {
  const { setIsPlaying, setOverlayIcon, musicQueue, currentIndex } = options;
  const clickedElement = e.target as HTMLElement;
  const isInteractive =
    clickedElement.closest('button') ||
    clickedElement.closest('a') ||
    clickedElement.closest('input') ||
    clickedElement.closest('aside');

  const windowHeight = window.innerHeight;
  const clickY = e.clientY;
  const isBottomFifth = clickY > windowHeight * 0.8;
  const isWeatherWidget = clickedElement.closest('.city-weather-clock-widget');

  // Prevent toggle if a resize just happened
  if (
    !isInteractive &&
    !isBottomFifth &&
    !isWeatherWidget &&
    musicQueue[currentIndex] &&
    !window.__weatherWidgetJustResized
  ) {
    togglePlay(setIsPlaying, setOverlayIcon);
  }
  // Always clear the flag after handling
  window.__weatherWidgetJustResized = false;
}