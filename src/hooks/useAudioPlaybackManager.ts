'use client';

import { useEffect, RefObject } from 'react';

interface Song {
  url: string;
  // Add other song properties if needed by the hook, though currently only url is used directly
}

interface UseAudioPlaybackManagerProps {
  audioRef: RefObject<HTMLAudioElement | null>;
  currentSong: Song | null;
  isPlaying: boolean;
}

export function useAudioPlaybackManager({
  audioRef,
  currentSong,
  isPlaying,
}: UseAudioPlaybackManagerProps) {
  useEffect(() => {
    console.log("💿 Current song (in hook):", currentSong, "Is Playing:", isPlaying);
    const audio = audioRef.current;

    if (currentSong && audio) {
      const targetSrc = `/api/proxy-audio?url=${encodeURIComponent(currentSong.url)}`;
      let sourceChanged = false;

      // Check if the source attribute needs to be updated or if it's already correct
      // This handles the case where currentSong object changes but URL is the same,
      // or when src is not yet set by React's declarative update.
      if (audio.src !== targetSrc) {
        // console.log("Audio source changed or needs update. Current:", audio.src, "Target:", targetSrc);
        // It's generally better to let React manage the src attribute declaratively.
        // This effect primarily ensures playback state and loading for the declaratively set src.
      }

      // Check if the browser's current source is different from the target
      // This helps ensure we call load() if React has updated src but browser hasn't picked it up.
      if (audio.currentSrc !== targetSrc && audio.src === targetSrc) {
        // console.log("Browser currentSrc differs from targetSrc, calling load(). Current:", audio.currentSrc, "Target:", targetSrc);
        audio.load();
        sourceChanged = true;
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
          });
        }
      } else {
        // If not isPlaying, ensure audio is paused.
        if (!audio.paused) {
          audio.pause();
        }
      }
    } else if (!currentSong && audio) {
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
  }, [currentSong, isPlaying, audioRef]); // audioRef itself should be stable
}