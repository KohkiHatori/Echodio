'use client';

import { useMusicGenerator } from '@/hooks/useMusicGenerator';
import { useState } from 'react';

export default function MusicGenerator({ onGenerated }: { onGenerated: (taskId: string) => void }) {
  const { generate, taskId, loading, error } = useMusicGenerator();
  const [prompt, setPrompt] = useState('lofi jazz');

  const handleGenerate = async () => {
    const newTaskId = await generate(prompt, 'instrumental');
    if (taskId) {
       console.log('✅ Generated Task ID:', newTaskId); 
      onGenerated(newTaskId);
    }
  };

  return (
    <div className="p-4 border rounded space-y-3">
      <h2 className="font-semibold text-lg">🎼 Generate Music</h2>
      <input
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Genre or mood"
        className="border px-3 py-2 rounded w-full"
      />
      <button
        onClick={handleGenerate}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {loading ? 'Generating...' : 'Generate Music'}
      </button>
      {taskId && <p>✅ Created Task ID: <code>{taskId}</code></p>}
      {error && <p className="text-red-600">❌ {error}</p>}
    </div>
  );
}
