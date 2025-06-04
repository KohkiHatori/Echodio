'use client'
import { useEffect } from "react";

// Define Song interface locally or import from a shared types file
interface Song {
  url: string;
  title: string | null;
  task_id: string;
}

interface Props {
  setImageTaskId: (id: string) => void;
  setMusicTaskId: (id: string) => void;
  time: string | null;
  location: { lat: number; lon: number } | null;
  locationChecked: boolean;
  musicQueue: Song[];
  refreshLocationAndTime: () => void;
  selectedGenre: string;
}

export function useGenerate({ setImageTaskId, setMusicTaskId, time, location, locationChecked, musicQueue, refreshLocationAndTime, selectedGenre }: Props) {

  useEffect(() => {
    // Refresh location and time whenever this effect runs
    refreshLocationAndTime();
    if (time && locationChecked) {
      fetch('/api/generate-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          time,
          selectedGenre,
          ...(location && { location }), // only include if location exists
        })
      })
        .then((res) => res.json())
        .then((data) => {
          console.log("Generated content response:", data);
          if (data.imageTaskId) setImageTaskId(data.imageTaskId);
          if (data.musicTaskId) setMusicTaskId(data.musicTaskId);
        })
        .catch((err) => {
          console.error("Failed to send content request:", err);
        });
    }
  }, [locationChecked, musicQueue]);
}