'use client';

import { useEffect, useRef, useState } from 'react';

export default function MusicRetriever({ taskId }: { taskId: string }) {
  const [loading, setLoading] = useState(false);
  const [songUrl, setSongUrl] = useState<string | null>(null);
  const [title, setTitle] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleRetrieve = async () => {
    if (!taskId) return;
    setLoading(true);
    setError(null);
    setSongUrl(null);
    setTitle(null);

    try {
      const res = await fetch(`/api/music/retrieve?task_id=${taskId}`);
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Failed to retrieve music');

      const song = data?.data?.output?.songs?.[0];
      const url = song?.song_path;

      if (!url) throw new Error('No song URL found');

      setSongUrl(url);
      setTitle(song?.title || null);
    } catch (err: any) {
      setError(err.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (taskId) {
      handleRetrieve();
    }
  }, [taskId]);

    useEffect(() => {
    if (songUrl && audioRef.current) {
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(err => {
          console.warn('Autoplay prevented:', err);
        });
      }
    }
  }, [songUrl]);

  return (
    <div className="p-4 border rounded space-y-3">
      <h2 className="font-semibold text-lg">🔍 Retrieve Music</h2>
      <p className="text-sm">Task ID: <code>{taskId}</code></p>
      {loading && (
        <div className="flex items-center space-x-2 text-gray-500">
          <svg className="w-5 h-5 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          <span>Retrieving song...</span>
        </div>
      )}


      {songUrl && (
        <div className="pt-2">
          <p>🎵 {title}</p>
          <audio controls autoPlay src={songUrl} className="mt-2 w-full" />
          <p className="text-sm break-all">{songUrl}</p>
        </div>
      )}

      {error && <p className="text-red-500">❌ {error}</p>}
    </div>
  );
}
