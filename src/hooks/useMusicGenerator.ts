// hooks/useMusicGenerator.ts
import { useState } from 'react';

export function useMusicGenerator() {
  const [loading, setLoading] = useState(false);
  const [taskId, setTaskId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const generate = async (prompt: string, lyricsType: string = 'instrumental') => {
    setLoading(true);
    setError(null);
    setTaskId(null);

    try {
      const res = await fetch('/api/music/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, lyricsType }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Failed to generate music');

      setTaskId(data.task_id);
      return data.task_id; 
    } catch (err: any) {
      const error = err as { message?: string };
      setError(error.message || 'Unknown error');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { taskId, loading, error, generate };
}


