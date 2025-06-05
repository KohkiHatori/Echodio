'use client';

import {
  ChevronLeftIcon,
  ChevronRightIcon,
  PauseIcon,
  PlayIcon,
} from '@heroicons/react/24/outline';
import { useEffect, useState, useCallback } from 'react';

interface Song { url: string; title: string | null; task_id: string }
interface Props {
  currentIndex: number;
  setCurrentIndex: React.Dispatch<React.SetStateAction<number>>;
  length: number;
  overlayIcon: 'play' | 'pause' | null;
  isSidebarOpen: boolean;
  showUI: boolean;
}

export default function FullScreenMusicPlayer({
  currentIndex,
  setCurrentIndex,
  length,
  overlayIcon,
  isSidebarOpen,
  showUI,
}: Props) {

  const handleSkipBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
    }
  }
  const handleSkipForward = () => {
    if (currentIndex < length) {
      setCurrentIndex((i) => i + 1);
    }
  }

  if (length === 0) {
    return null;
  }

  return (
    <>
      <div className="fixed inset-0 z-10 pointer-events-none">

        {/* Skip Back Button */}
        {showUI && currentIndex > 0 && (
          <button
            className="fixed top-1/2 -translate-y-1/2 p-2 bg-black/50 rounded-full pointer-events-auto cursor-pointer transition-[left] duration-500"
            style={{ left: isSidebarOpen ? "288px" : "16px" }}
            onClick={(e) => {
              e.stopPropagation();
              handleSkipBack();
            }}
          >
            <ChevronLeftIcon className="w-8 h-8 text-white" />
          </button>
        )}

        {/* Skip Forward Button */}
        {showUI && currentIndex < length - 1 && (
          <button
            className="fixed top-1/2 right-4 -translate-y-1/2 p-2 bg-black/50 rounded-full pointer-events-auto cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              handleSkipForward();
            }}
          >
            <ChevronRightIcon className="w-8 h-8 text-white" />
          </button>
        )}

        {/* Play/Pause Overlay Icon */}
        {overlayIcon && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ marginLeft: '270px' }}>
  {overlayIcon === 'play' ? (
    <PlayIcon className="w-16 h-16 text-white animate-pulse" />
  ) : (
    <PauseIcon className="w-16 h-16 text-white animate-pulse" />
  )}
</div>
        )}
      </div>
    </>
  );
}

function fadeOutAndPause(audio: HTMLAudioElement, duration = 1.5) {
  if (!audio) return;
  const startVolume = audio.volume;
  const steps = 30;
  const stepTime = (duration * 1000) / steps;
  let currentStep = 0;

  function fade() {
    currentStep++;
    const newVolume = startVolume * (1 - currentStep / steps);
    audio.volume = Math.max(newVolume, 0);
    if (currentStep < steps) {
      setTimeout(fade, stepTime);
    } else {
      audio.pause();
      audio.currentTime = 0;
      audio.volume = startVolume;
    }
  }

  fade();
}