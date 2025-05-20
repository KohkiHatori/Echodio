import { NextResponse } from 'next/server';
import { getTimePeriodLabel } from '@/lib/time';

export async function POST(request: Request) {
  try {
    const { time, weather } = await request.json();

    const apiKey = process.env.GO_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Missing API key' }, { status: 500 });
    }

    const weatherDescription = weather?.weather?.[0]?.description || 'clear sky';

    const timeLabel = getTimePeriodLabel(time, weather);

    const prompt = `a girl using a laptop on a desk inside a house, lofi, painting, chil, pop, ${timeLabel}, with ${weatherDescription}.`;
    console.log("Generated prompt:", prompt);

    const payload = {
      model: "midjourney",
      task_type: "imagine",
      input: {
        prompt,
        aspect_ratio: "16:9",
        process_mode: "relax",
        skip_prompt_check: false,
        bot_id: 0
      },
      config: {
        service_mode: "",
        webhook_config: {
          endpoint: "",
          secret: ""
        }
      }
    };

    const response = await fetch("https://api.goapi.ai/api/v1/task", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    return NextResponse.json(result);
  } catch (err) {
    console.error("Image API error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}