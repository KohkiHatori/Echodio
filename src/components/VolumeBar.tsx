'use client';
import { useEffect, useState } from "react";

import { SpeakerWaveIcon } from '@heroicons/react/24/outline';


interface VolumeControlProps {
  audioRef: React.RefObject<HTMLAudioElement | null>;
  isSidebarOpen: boolean
}

export default function VolumeControl({ audioRef, isSidebarOpen }: VolumeControlProps) {
  const [volume, setVolume] = useState(0.5);

  // Sync with audio element
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume, audioRef]);

  return (
    <div className="fixed top-20 transform -translate-x-1/2 z-50 flex flex-col items-center truncate">
      <div
        className="flex items-center gap-2 px-3 py-1 rounded-full backdrop-blur-md border border-white/20"
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          height: '2rem', // ensure consistent height with text
        }}>

        <SpeakerWaveIcon
          className="w-4 h-4 text-white"
          style={{ mixBlendMode: 'difference' }}
        />
        <input
          id="volume-slider"
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={volume}
          onChange={(e) => {
            setVolume(Number(e.target.value));
            e.target.blur(); // Blur after change to release focus
          }}
          className="w-40 h-2 accent-white appearance-none bg-zinc-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/60"
          style={{
            mixBlendMode: 'difference',
          }}
        />
      </div>
    </div>
  );
}
