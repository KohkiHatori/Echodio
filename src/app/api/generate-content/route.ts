import { getTimePeriodLabel } from '@/lib/time';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { time, location } = await request.json();

    let weather = null;

    // 1. If location is available, try to fetch weather
    if (location) {
      try {
        const weatherRes = await fetch('http://localhost:3000/api/weather', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ location }),
        });

        if (weatherRes.ok) {
          weather = await weatherRes.json();
        } else {
          console.warn('Weather API responded with status:', weatherRes.status);
        }
      } catch (weatherErr) {
        console.warn('Weather API failed:', weatherErr);
      }
    }

    // 2. Always call image and music APIs, with or without weather
    const timeLabel = getTimePeriodLabel(time, weather);
    const weatherDescription = weather?.weather?.[0]?.description || 'clear sky';
    const requestBody = {
      timeLabel,
      weatherDescription
    };

    //IMAGE
    const imageRes = await fetch('api/image/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    });
    if (!imageRes.ok) {
      throw new Error('Background API failed');
    }
    const imageTaskId = await imageRes.json();
    console.log("Image taskId:", imageTaskId);


    const lyricsType = 'instrumental'
    const musicRes = await fetch('/api/music/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestBody, lyricsType })
      });
    if (!musicRes.ok) {
      throw new Error('Background API failed');
    }
    
    const data = await musicRes.json()
    const musicTaskId = data.taskId;
    console.log("Music taskId:", musicTaskId);

    return NextResponse.json({ imageTaskId,musicTaskId });
  } catch (err) {
    console.error("generate-content error:", err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}