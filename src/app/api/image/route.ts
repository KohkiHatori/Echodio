import { NextResponse } from 'next/server';
import { getTimePeriodLabel } from '@/lib/time';
import path from 'path';


const GENERATION_MODE = "relax";

function generatePrompt(time: string, weather: any) {
  const weatherDescription = weather?.weather?.[0]?.description || 'clear sky';
  const timeLabel = getTimePeriodLabel(time, weather);
  const prompt = `a girl using a laptop on a desk inside a house, lofi, painting, chil, pop, ${timeLabel}, with ${weatherDescription}.`;
  console.log("Generated prompt:", prompt);
  return prompt;
}


async function poll(taskId: string, headers: any): Promise<string> {
  const pollResponse = await fetch(`https://api.goapi.ai/api/v1/task/${taskId}`, {
    method: "GET",
    headers: headers,
  });

  const pollResult = await pollResponse.json();
  console.log("Image Generation:", pollResult?.data?.status);

  if (pollResult?.data?.status === "completed") {
    const imageUrl = pollResult?.data?.output?.image_url;
    if (!imageUrl) throw new Error("Image URL not found");
    return imageUrl;
  }

  if (pollResult?.data?.status === "failed") {
    throw new Error("Image generation failed.");
  }

  // Wait 3 seconds before polling again
  await new Promise(resolve => setTimeout(resolve, 3000));
  return poll(taskId, headers); // recursively poll again
}

export async function POST(request: Request) {
  try {
    const { time, weather } = await request.json();

    const apiKey = process.env.GO_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Missing API key' }, { status: 500 });
    }

    const headers = {
      "x-api-key": apiKey,
      "Content-Type": "application/json"
    };

    const prompt = generatePrompt(time, weather);



    const payload = {
      model: "midjourney",
      task_type: "imagine",
      input: {
        prompt,
        aspect_ratio: "16:9",
        process_mode: GENERATION_MODE,
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

    // const response = await fetch("https://api.goapi.ai/api/v1/task", {
    //   method: "POST",
    //   headers: headers,
    //   body: JSON.stringify(payload),
    // });

    // const result = await response.json();
    // const taskId = result?.data?.task_id;
    // if (!taskId) throw new Error("No task ID returned.");
    // const imageUrl = await poll(taskId, headers);

    // TEMPORARILY using a static image URL for testing
    const imageUrl = "https://img.theapi.app/cdn-cgi/image/trim=816;0;0;1456/mj/9497f855-c7eb-477d-9eb9-1cf1c5138747.png";
    //


    return NextResponse.json(imageUrl);
  } catch (err) {
    console.error("Image API error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}