'use client';

import MusicGenerator from '@/components/MusicGenerator';
import MusicRetriever from '@/components/MusicRetriever';
import { useState } from 'react';

export default function MusicDemoPage() {
  const [generatedTaskId, setGeneratedTaskId] = useState<string | null>(null);

  return (
    <div className="max-w-xl mx-auto space-y-8 p-6">
      <h1 className="text-2xl font-bold text-center">🎧 Music Generator & Retriever</h1>

      <MusicGenerator onGenerated={setGeneratedTaskId} />

      {generatedTaskId && <MusicRetriever taskId={generatedTaskId} />}

    {/* テスト用として手打ちでtask-idを入れています、現状taskIdがうまく反映されていない */}
    <h1 className="text-2xl font-bold text-center">🎧 Retrieve a Known Track</h1>
      <MusicRetriever taskId="03ff5b05-4ccf-4562-a809-59cbd794418f" />
    </div>

  );
}
