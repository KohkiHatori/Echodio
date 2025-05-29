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
  audioRef: React.RefObject<HTMLAudioElement | null>;
  songs: Song[];
  isPlaying: boolean;
  setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>;
  overlayIcon: 'play' | 'pause' | null;
  setOverlayIcon: (icon: 'play' | 'pause' | null) => void;
  currentSong: Song | null;
  onSongChange: (song: Song) => void;
}

export default function FullScreenMusicPlayer({
  audioRef,
  songs,
  isPlaying,
  setIsPlaying,
  overlayIcon,
  setOverlayIcon,
  currentSong,
  onSongChange,
}: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (songs.length > 0 && currentIndex >= 0 && currentIndex < songs.length) {
      const newSong = songs[currentIndex];
      if (currentSong?.task_id !== newSong.task_id) {
        onSongChange(newSong);
      }
    }
  }, [currentIndex, songs, onSongChange, currentSong]);

  useEffect(() => {
    if (currentSong && songs.length > 0) {
      const initialIndex = songs.findIndex(song => song.task_id === currentSong.task_id);
      if (initialIndex !== -1) {
        setCurrentIndex(initialIndex);
      }
    }
  }, [currentSong, songs]);

  // Play/Pause effect
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.play().catch(() => { });
    } else {
      audio.pause();
    }
  }, [isPlaying, songs, currentIndex, audioRef]);

  // Advance on end
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
  }, [currentIndex, songs.length, audioRef]);

  const togglePlay = useCallback(() => {
    if (songs.length === 0) return;
    setIsPlaying((prev: boolean) => {
      const next = !prev;
      setOverlayIcon(next ? 'play' : 'pause');
      setTimeout(() => setOverlayIcon(null), 1000);
      return next;
    });
  }, [setIsPlaying, setOverlayIcon, songs.length]);

  // Spacebar toggles play/pause
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'Space' && songs[currentIndex]) {
        e.preventDefault();
        togglePlay();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [togglePlay, songs, currentIndex]);

  const handleSkipBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
    }
  }
  const handleSkipForward = () => {
    if (currentIndex < songs.length - 1) {
      setCurrentIndex((i) => i + 1);
    }
  }

  if (songs.length === 0) {
    return null;
  }

  return (
    <>
      <div className="fixed inset-0 z-10 pointer-events-none">

        {/* Skip Back Button */}
        {currentIndex > 0 && (
          <button
            className="fixed top-1/2 left-4 -translate-y-1/2 p-2 bg-black/50 rounded-full pointer-events-auto"
            onClick={(e) => {
              e.stopPropagation();
              handleSkipBack();
            }}
          >
            <ChevronLeftIcon className="w-8 h-8 text-white" />
          </button>
        )}

        {/* Skip Forward Button */}
        {currentIndex < songs.length - 1 && (
          <button
            className="fixed top-1/2 right-4 -translate-y-1/2 p-2 bg-black/50 rounded-full pointer-events-auto"
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
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
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
