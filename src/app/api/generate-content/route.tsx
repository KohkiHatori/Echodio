// src/app/api/generate-content/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { time, location } = await request.json();

    // Make two third-party API calls using the provided data
    const [backgroundRes, musicRes] = await Promise.all([
      fetch('../image/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          // include time and location if needed
        }),
      }),
      fetch('../music', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          // include time and location if needed
        }),
      })
    ]);

    const background = await backgroundRes.json();
    const music = await musicRes.json();

    return NextResponse.json({ background, music });

  } catch (err) {
    console.error("generate-content error:", err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}