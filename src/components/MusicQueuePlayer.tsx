'use client';

import { useEffect, useRef, useState } from "react";

interface Song {
  url: string;
  title: string | null;
}

export default function MusicQueuePlayer({ songs }: { songs: Song[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentSong = songs[currentIndex];

  useEffect(() => {
    const audio = audioRef.current;
    if (!currentSong?.url || !audio) return;

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch((err) => {
        console.warn("Autoplay prevented:", err);
      });
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
  }, [currentSong?.url, currentIndex, songs.length]);

  return (
    <div className="p-4 border rounded space-y-2">
      <h2 className="font-semibold text-lg">🎶 Music Queue Player</h2>
      <div className="flex space-x-4">
        <button
          onClick={() => setCurrentIndex((prev) => Math.max(prev - 1, 0))}
          disabled={currentIndex === 0}
          className="bg-gray-300 px-3 py-1 rounded disabled:opacity-50"
        >
          ⬅ Prev
        </button>

        <button
          onClick={() =>
            setCurrentIndex((prev) => Math.min(prev + 1, songs.length - 1))
          }
          disabled={currentIndex === songs.length - 1}
          className="bg-gray-300 px-3 py-1 rounded disabled:opacity-50"
        >
          Next ➡
        </button>
      </div>

      {currentSong && (
        <>
          <p className="font-medium">🎵 {currentSong.title}</p>
          <audio ref={audioRef} src={currentSong.url} controls className="w-full" />
        </>
      )}
    </div>
  );
}
