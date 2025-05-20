import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { location } = await request.json();

    if (!location || !location.lat || !location.lon) {
      return NextResponse.json({ error: 'Missing or invalid location data' }, { status: 400 });
    }

    const { lat, lon } = location;
    const apiKey = process.env.WEATHER_API_KEY;

    if (!apiKey) {
      console.error('Missing WEATHER_API_KEY in environment');
      return NextResponse.json({ error: 'Server misconfiguration' }, { status: 500 });
    }

    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

    const res = await fetch(url);
    if (!res.ok) {
      console.error(`Weather API error: ${res.status} ${res.statusText}`);
      return NextResponse.json({ error: 'Failed to fetch weather data' }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error('Weather route error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}