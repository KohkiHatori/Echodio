//src/app/api/image/result/route.ts
import { NextResponse } from 'next/server';
import { saveImageTask } from '@/services/firestore/imageTasks';

export async function POST(request: Request) {
  const { task_id } = await request.json();
  console.log("task_id", task_id);
  const apiKey = process.env.GO_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ error: 'Missing API key' }, { status: 500 });
  }

  const response = await fetch(`https://api.goapi.ai/api/v1/task/${task_id}`, {
    method: "GET",
    headers: {
      "x-api-key": apiKey,
      "Content-Type": "application/json"
    }
  });

  const result = await response.json();

  const status = result?.data?.status;
  if (status === "completed") {
    // const index = Math.floor(Math.random() * 4);
    const imageUrl = result?.data?.output?.temporary_image_urls?.[1];
    saveImageTask(task_id, {
      url: imageUrl,
      prompt: result.data.input.prompt
    });
    return NextResponse.json({ status, imageUrl });
  }

  const message = result?.message;
  if (message === "task not found" || message === "failed to find task") {
    return NextResponse.json({ error: 'task not found' }, { status: 400 });
  }

  return NextResponse.json({ status });
}