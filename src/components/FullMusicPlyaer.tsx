'use client';

import {
  ChevronLeftIcon,
  ChevronRightIcon,
  PauseIcon,
  PlayIcon,
} from '@heroicons/react/24/outline';
import { useEffect, useRef, useState } from 'react';

interface Song { url: string; title: string | null }
interface Props {
  songs: Song[];
  isPlaying: boolean;
  setIsPlaying: (v: boolean) => void;
}

export default function FullScreenMusicPlayer({
  songs,
  isPlaying,
  setIsPlaying,
}: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [overlayIcon, setOverlayIcon] = useState<'play' | 'pause' | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentSong = songs[currentIndex];

  // 1) Play / Pause effect
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  }, [isPlaying, currentSong?.url]);

  // 2) Advance on end
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onEnded = () => {
      if (currentIndex < songs.length - 1) {
        setCurrentIndex((i) => i + 1);
      }
    };
    audio.addEventListener('ended', onEnded);
    return () => void audio.removeEventListener('ended', onEnded);
  }, [currentIndex, songs.length]);

  // 3) Spacebar toggles play/pause
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        togglePlay();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isPlaying]);

  const togglePlay = () => {
    const next = !isPlaying;
    setIsPlaying(next);
    setOverlayIcon(next ? 'play' : 'pause');
    setTimeout(() => setOverlayIcon(null), 1000);
  };

  const handleSkipBack = () =>
    currentIndex > 0 && setCurrentIndex((i) => i - 1);
  const handleSkipForward = () =>
    currentIndex < songs.length - 1 && setCurrentIndex((i) => i + 1);

  return (
    <>
      {currentSong && (
        <audio ref={audioRef} src={currentSong.url} autoPlay hidden />
      )}

      <div className="fixed inset-0 z-50" onClick={togglePlay}>
        {currentIndex > 0 && (
          <button
            className="fixed top-1/2 left-4 -translate-y-1/2 p-2 bg-black/50 rounded-full"
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
            className="fixed top-1/2 right-4 -translate-y-1/2 p-2 bg-black/50 rounded-full"
            onClick={(e) => {
              e.stopPropagation();
              handleSkipForward();
            }}
          >
            <ChevronRightIcon className="w-8 h-8 text-white" />
          </button>
        )}

        {overlayIcon && (
          <div className="fixed inset-0 flex items-center justify-center pointer-events-none">
            {overlayIcon === 'play' ? (
              <PlayIcon className="w-16 h-16 text-white animate-pulse" />
            ) : (
              <PauseIcon className="w-16 h-16 text-white animate-pulse" />
            )}
          </div>
        )}
      </div>

      {/* If you still want the analyzer here: */}

    </>
  );
}
