'use client';

import {
    ChevronLeftIcon,
    ChevronRightIcon,
    PauseIcon,
    PlayIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useRef, useState } from "react";

interface Song {
  url: string;
  title: string | null;
}

export default function FullScreenMusicPlayer({ songs }: { songs: Song[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [overlayIcon, setOverlayIcon] = useState<"play" | "pause" | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentSong = songs[currentIndex];

  // Play current song on change
  useEffect(() => {
    const audio = audioRef.current;
    if (!currentSong?.url || !audio) return;

    if (isPlaying) {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => console.warn("Autoplay prevented:", err));
      }
    } else {
      audio.pause();
    }

    const handleEnded = () => {
      if (currentIndex < songs.length - 1) {
        setCurrentIndex((prev) => prev + 1);
      }
    };

    audio.addEventListener("ended", handleEnded);
    return () => {
      audio.removeEventListener("ended", handleEnded);
    };
  }, [currentSong?.url, currentIndex, isPlaying]);

  // Spacebar toggles playback
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        togglePlay();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isPlaying]);

  const togglePlay = () => {
    const next = !isPlaying;
    setIsPlaying(next);
    setOverlayIcon(next ? "play" : "pause");
    setTimeout(() => setOverlayIcon(null), 1000);
  };

  const handleSkipBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleSkipForward = () => {
    if (currentIndex < songs.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  return (
    <>
      {/* Invisible audio element */}
      {currentSong && (
        <audio ref={audioRef} src={currentSong.url} autoPlay hidden />
      )}

      {/* Overlay Buttons */}
      <div
        className="fixed inset-0 z-50"
        onClick={togglePlay}
      >
        {currentIndex > 0 && (
            <button
                className="fixed top-1/2 left-4 transform -translate-y-1/2 z-50 p-2 bg-black/50 rounded-full"
                onClick={(e) => {
                e.stopPropagation();
                handleSkipBack();
                }}
            >
                <ChevronLeftIcon className="w-8 h-8 text-white" />
            </button>
        )}

        {currentIndex < songs.length - 1 && (
            <button
                className="fixed top-1/2 right-4 transform -translate-y-1/2 z-50 p-2 bg-black/50 rounded-full"
                onClick={(e) => {
                e.stopPropagation();
                handleSkipForward();
                }}
            >
                <ChevronRightIcon className="w-8 h-8 text-white" />
            </button>
        )}

        {/* Play/Pause Icon Feedback */}
        {overlayIcon && (
          <div className="fixed inset-0 flex items-center justify-center pointer-events-none">
            {overlayIcon === "play" ? (
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
