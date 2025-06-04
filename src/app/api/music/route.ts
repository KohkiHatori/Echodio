import { saveMusicTask } from '@/services/firestore/musicTasks';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const body = await request.json();
  const task_id = body.task_id;

  if (!task_id) {
    return NextResponse.json({ error: 'Missing task_id' }, { status: 400 });
  }

  console.log("🎧 Received task_id for polling:", task_id);

  try {
    const response = await fetch(`https://api.goapi.ai/api/v1/task/${task_id}`, {
      method: 'GET',
      headers: {
        'x-api-key': process.env.GO_API_KEY || '', // Your GoAPI key from .env
      },
    });


    if (!response.ok) {
      const errorText = await response.text();
      console.error('GoAPI task status error:', errorText);
      return NextResponse.json({ error: 'Failed to fetch task status' }, { status: response.status });
    }

    const result = await response.json();
    // save the music task to firestore
    if (result.data.status === "completed") {
      const song = result.data.output.songs[0];
      saveMusicTask(task_id, {
        url: song.song_path,
        prompt: result.data.input.gpt_description_prompt,
        lyricsType: result.data.input.lyrics_type,
        // genre: song.genre,
        title: song.title
      });
    }

    return NextResponse.json(result);

  } catch (error) {
    console.error('Task status error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
