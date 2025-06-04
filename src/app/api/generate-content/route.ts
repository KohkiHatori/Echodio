import { getTimePeriodLabel } from '@/lib/time';
import { getWeather } from '@/lib/getWeather';
import { NextResponse } from 'next/server';
import { generateImage } from '@/lib/generateImage';
import { generateMusic } from '@/lib/generateMusic';

export async function POST(request: Request) {
  try {
    const { time, location, selectedGenre } = await request.json();

    let weather = null;

    // 1. If location is available, try to fetch weather
    if (location) {
      weather = await getWeather(location);
    }

    // 2. Always call image and music APIs, with or without weather
    const timeLabel = getTimePeriodLabel(time, weather);
    console.log("timeLabel", timeLabel);
    const weatherDescription = weather?.weather?.[0]?.description || 'clear sky';

    //IMAGE
    const imageTaskId = await generateImage(timeLabel, weatherDescription);
    console.log("Image task ID:", imageTaskId);


    const lyricsType = 'instrumental'
    const negativeTags = ''
    const musicTaskId = await generateMusic(timeLabel, weatherDescription, lyricsType, negativeTags, selectedGenre);

    console.log("Music taskId:", musicTaskId);

    return NextResponse.json({
      imageTaskId, musicTaskId
    });
  } catch (err) {
    console.error("generate-content error:", err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}