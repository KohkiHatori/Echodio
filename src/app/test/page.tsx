'use client';

import MusicGenerator from '@/components/MusicGenerator';
import MusicQueuePlayer from '@/components/MusicQueuePlayer';
import MusicRetriever from '@/components/MusicRetriever';
import { useState } from 'react';

const taskIds = [
  "03ff5b05-4ccf-4562-a809-59cbd794418f",
  "47c32e02-fccc-46a6-b0a1-cd1da3678221",
  "4badac92-80c0-4b98-ad79-a9ccb984374e",
  "03ff5b05-4ccf-4562-a809-59cbd794418f"
];
export default function MusicDemoPage() {
  const [generatedTaskId, setGeneratedTaskId] = useState<string | null>(null);



  return (
    <div className="max-w-xl mx-auto space-y-8 p-6">
      <h1 className="text-2xl font-bold text-center">🎧 Music Generator & Retriever</h1>

      <MusicGenerator onGenerated={setGeneratedTaskId} />

      {generatedTaskId && <MusicRetriever taskId={generatedTaskId} />}

     <MusicQueuePlayer taskIds={taskIds} />
    </div>

  );
}
