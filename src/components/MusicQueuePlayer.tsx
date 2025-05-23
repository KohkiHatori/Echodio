'use client';

import { useEffect, useRef, useState } from 'react';

type Song = {
  url: string;
  title?: string;
};

export default function MusicQueuePlayer({ taskIds }: { taskIds: string[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [song, setSong] = useState<Song | null>(null);
  const [loading, setLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentTaskId = taskIds[currentIndex];

  // Fetch song for current task ID
  useEffect(() => {
    const fetchSong = async () => {
      if (!currentTaskId) return;
      setLoading(true);
      try {
        const res = await fetch(`/api/music/result?task_id=${currentTaskId}`);
        const data = await res.json();
        const fetched = data?.data?.output?.songs?.[0];
        if (fetched?.song_path) {
          setSong({ url: fetched.song_path, title: fetched.title });
        }
      } catch (err) {
        console.error('Failed to retrieve song:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSong();
  }, [currentTaskId]);

// Handle autoplay and next-track logic
useEffect(() => {
  const audio = audioRef.current;
  if (!song?.url || !audio) return;

  const playPromise = audio.play();
  if (playPromise !== undefined) {
    playPromise.catch((err) => {
      console.warn('Autoplay prevented:', err);
    });
  }

  const handleEnded = () => {
    if (currentIndex < taskIds.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  audio.addEventListener('ended', handleEnded);

  // Clean up listener on unmount or when song/url changes
  return () => {
    audio.removeEventListener('ended', handleEnded);
  };
}, [song?.url, currentIndex, taskIds.length]);

  
  return (
    <div className="p-4 border rounded space-y-2">
      <h2 className="font-semibold text-lg">🎶 Music Queue Player</h2>
      <p className="text-sm">Task ID: <code>{currentTaskId}</code></p>

    <div className="flex space-x-4">
      <button
        onClick={() => setCurrentIndex((prev) => Math.max(prev - 1, 0))}
        disabled={currentIndex === 0}
        className="bg-gray-300 px-3 py-1 rounded disabled:opacity-50"
      >
        ⬅ Prev
      </button>

      <button
        onClick={() => setCurrentIndex((prev) => Math.min(prev + 1, taskIds.length - 1))}
        disabled={currentIndex === taskIds.length - 1}
        className="bg-gray-300 px-3 py-1 rounded disabled:opacity-50"
      >
        Next ➡
      </button>
    </div>

      {loading && <p className="text-gray-500">Retrieving song...</p>}

      {song && (
        <>
          <p className="font-medium">🎵 {song.title}</p>
          <audio ref={audioRef} src={song.url} controls className="w-full" />
        </>
      )}
    </div>
  );
}
