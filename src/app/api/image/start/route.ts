//src/app/api/image/result/route.ts
import { NextResponse } from 'next/server';


// const GENERATION_MODE = "relax";

export async function POST(_request: Request) {
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

    // const prompt = `a half naked middle aged fat man using a laptop on a desk lofi, painting, chil, pop, ${timeLabel}, with ${weatherDescription}.`;


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
    // const taskId = result?.data?.task_id;

    //TEMPORARILY USING A FIXED TASK ID
    const taskId = "9497f855-c7eb-477d-9eb9-1cf1c5138747";
    //

    return NextResponse.json(taskId);
  } catch (err) {
    console.error("Image API error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}