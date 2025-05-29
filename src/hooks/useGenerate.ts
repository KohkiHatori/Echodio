'use client'
import { useEffect } from "react";

interface Props {
  setImageTaskId: (id: string) => void;
  setMusicTaskId: (id: string) => void;
  time: string | null;
  location: { lat: number; lon: number } | null;
  locationChecked: boolean;
}

export function useGenerate({ setImageTaskId, setMusicTaskId, time, location, locationChecked }: Props) {

  useEffect(() => {
    if (time && locationChecked) {
      fetch('http://localhost:3000/api/generate-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          time,
          ...(location && { location }) // only include if location exists
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
  }, [time, location, locationChecked]);
}