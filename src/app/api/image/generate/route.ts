//src/app/api/image/result/route.ts
import { NextResponse } from 'next/server';

let counter = 0;
const task_ids = [
  "7e65b123-e28f-4dc3-a06f-a52a03f490bc",
  "cb0dd14f-9d3c-43b5-b805-8f9b2efbcf2c",
  "82827649-b3d5-4beb-88fa-fe815a799fbc"
]

// const GENERATION_MODE = "relax";

export async function POST(request: Request) {
  try {
    // const { timeLabel, weatherDescription } = await request.json();

    // const apiKey = process.env.GO_API_KEY;

    // if (!apiKey) {
    //   return NextResponse.json({ error: 'Missing API key' }, { status: 500 });
    // }

    // const headers = {
    //   "x-api-key": apiKey,
    //   "Content-Type": "application/json"
    // };

    // const prompt = `a middle aged fat man using a laptop on a desk lofi, painting, chil, pop, ${timeLabel}, with ${weatherDescription}.`;


    // const payload = {
    //   model: "midjourney",
    //   task_type: "imagine",
    //   input: {
    //     prompt,
    //     aspect_ratio: "16:9",
    //     process_mode: GENERATION_MODE,
    //     skip_prompt_check: false,
    //     bot_id: 0
    //   },
    //   config: {
    //     service_mode: "",
    //     webhook_config: {
    //       endpoint: "",
    //       secret: ""
    //     }
    //   }
    // };

    // const response = await fetch("https://api.goapi.ai/api/v1/task", {
    //   method: "POST",
    //   headers: headers,
    //   body: JSON.stringify(payload),
    // });

    // const result = await response.json();
    // const task_id = result?.data?.task_id;

    // TEMPRRARILY using a hard-coded task ID
    // const task_id = "7e65b123-e28f-4dc3-a06f-a52a03f490bc";
    const task_id = task_ids[counter++ % task_ids.length];

    return NextResponse.json({ task_id });
  } catch (err) {
    console.error("Image API error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}