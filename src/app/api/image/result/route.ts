//src/app/api/image/result/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { taskId } = await request.json();
  console.log("taskId", taskId);
  const apiKey = process.env.GO_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ error: 'Missing API key' }, { status: 500 });
  }

  const response = await fetch(`https://api.goapi.ai/api/v1/task/${taskId}`, {
    method: "GET",
    headers: {
      "x-api-key": apiKey,
      "Content-Type": "application/json"
    }
  });

  const result = await response.json();
  console.log("result", result);

  const status = result?.data?.status;
  if (status === "completed") {
    const index = Math.floor(Math.random() * 4);
    const imageUrl = result?.data?.output?.temporary_image_urls?.[index];
    return NextResponse.json({ status, imageUrl });
  }

  return NextResponse.json({ status });
}