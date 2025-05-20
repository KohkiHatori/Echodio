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
    // const requestBody = {
    //   time,
    //   ...(location && { location }),
    //   ...(weather && { weather }),
    // };

    // const [backgroundRes, musicRes] = await Promise.all([
    //   fetch('../image/', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(requestBody),
    //   }),
    //   fetch('../music', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(requestBody),
    //   }),
    // ]);

    // if (!backgroundRes.ok || !musicRes.ok) {
    //   throw new Error('One of the content APIs failed');
    // }

    // const background = await backgroundRes.json();
    // const music = await musicRes.json();

    return NextResponse.json({ weather });
    // return NextResponse.json({ background, music });

  } catch (err) {
    console.error("generate-content error:", err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}