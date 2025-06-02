import React from "react";
import { togglePlay } from "./togglePlay";

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

  if (!isInteractive && !isBottomFifth && !isWeatherWidget && musicQueue[currentIndex]) {
    togglePlay(setIsPlaying, setOverlayIcon);
  }
}