'use client';

import MusicGenerator from '@/components/MusicGenerator';
import MusicRetriever from '@/components/MusicRetriever';
import { useEffect, useState } from 'react';

const taskIds = [
  "03ff5b05-4ccf-4562-a809-59cbd794418f",
  "47c32e02-fccc-46a6-b0a1-cd1da3678221",
  "4badac92-80c0-4b98-ad79-a9ccb984374e",
  "03ff5b05-4ccf-4562-a809-59cbd794418f"
];
export default function MusicDemoPage() {
  const [generatedTaskId, setGeneratedTaskId] = useState<string | null>(null);
  const [rotatingTaskId, setRotatingTaskId] = useState<string>(taskIds[0]);

    useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      index = (index + 1) % taskIds.length;
      setRotatingTaskId(taskIds[index]);
    }, 15000); 

    return () => clearInterval(interval);
  }, []);


  return (
    <div className="max-w-xl mx-auto space-y-8 p-6">
      <h1 className="text-2xl font-bold text-center">🎧 Music Generator & Retriever</h1>

      <MusicGenerator onGenerated={setGeneratedTaskId} />

      {generatedTaskId && <MusicRetriever taskId={generatedTaskId} />}

    {/* テスト用として手打ちでtask-idを入れています、music generatorで生成されたtaskIdがうまく反映されていない */}
      <MusicRetriever taskId={rotatingTaskId} />
      {/* <MusicRetriever taskId="47c32e02-fccc-46a6-b0a1-cd1da3678221" />
      <MusicRetriever taskId="4badac92-80c0-4b98-ad79-a9ccb984374e" />
      <MusicRetriever taskId="03ff5b05-4ccf-4562-a809-59cbd794418f" /> */}
    </div>

  );
}
