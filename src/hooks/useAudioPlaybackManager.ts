'use client';

import { togglePlay } from '@/app/utils/togglePlay';
import { useEffect, RefObject } from 'react';
import { useGlobalSpacebar } from './useGlobalSpacebar';

interface Song {
  url: string;
  title: string | null;
  task_id: string;
}

interface UseAudioPlaybackManagerProps {
  audioRef: RefObject<HTMLAudioElement | null>;
  isPlaying: boolean;
  songs: Song[];
  currentIndex: number;
  setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>;
  setCurrentIndex: React.Dispatch<React.SetStateAction<number>>;
  setOverlayIcon: React.Dispatch<React.SetStateAction<'play' | 'pause' | null>>;
}

export function useAudioPlaybackManager({
  audioRef,
  isPlaying,
  songs,
  currentIndex,
  setIsPlaying,
  setCurrentIndex,
  setOverlayIcon,
}: UseAudioPlaybackManagerProps) {

  // Play/Pause effect
  useEffect(() => {
    console.log("💿 Current song (in hook):", songs[currentIndex], "Is Playing:", isPlaying);
    const audio = audioRef.current;
    if (!audio) return;

    if (songs[currentIndex]) {
      const targetSrc = `/api/proxy-audio?url=${encodeURIComponent(songs[currentIndex].url)}`;


      // Check if the browser's current source is different from the target
      // This helps ensure we call load() if React has updated src but browser hasn't picked it up.
      if (audio.currentSrc !== targetSrc && audio.src === targetSrc) {
        audio.load();
      }

      if (isPlaying) {
        // Attempt to play. If source changed, load() should have been called.
        // If source didn't change but was paused, this will resume.
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise.catch(error => {
            // Autoplay was prevented. This can happen if the page hasn't been interacted with,
            // or if the browser has strict autoplay policies.
            // console.error("Error attempting to play audio:", error);
            // You might want to set isPlaying to false here if play was rejected and not by user pause
            setIsPlaying(false);
          });
        }
      } else {
        // If not isPlaying, ensure audio is paused.
        if (!audio.paused) {
          audio.pause();
        }
      }
    } else if (!songs[currentIndex]) {
      // If there's no current song, pause and reset the audio element
      if (!audio.paused) {
        audio.pause();
      }
      if (audio.src !== '') { // Only change if not already empty
        audio.src = '';
      }
      // audio.removeAttribute('src'); // Alternative way to clear
      // audio.load(); // After clearing src, some browsers might need a load() to reflect empty state
    }
  }, [songs[currentIndex], isPlaying, audioRef]); // audioRef itself should be stable

  // Advance on end
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onEnded = () => {
      if (songs.length === 0) return;
      if (currentIndex < songs.length - 1) {
        setCurrentIndex((i) => i + 1);
        setIsPlaying(true);
      } else {
        setCurrentIndex(0);
        setIsPlaying(true);
      }
    };
    audio.addEventListener('ended', onEnded);
    return () => void audio.removeEventListener('ended', onEnded);
  }, [currentIndex, songs.length, audioRef, setIsPlaying]);


  // Spacebar toggles play/pause
  useGlobalSpacebar(() => togglePlay(setIsPlaying, setOverlayIcon));
}