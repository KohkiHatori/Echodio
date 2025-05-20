import { writeFile } from 'fs/promises';
import path from 'path';
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

    const requestBody = {
      time,
      ...(weather && { weather }),
    };
    const imageRes = await fetch('http://localhost:3000/api/image/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    });
    if (!imageRes.ok) {
      throw new Error('Background API failed');
    }
    // const image = await imageRes.json();

    ///// TESTTING /////
    const imageDataString: string = '{"task_id":"c130c235-8cc4-4a64-8db1-238fd073c697","model":"midjourney","task_type":"imagine","status":"completed","config":{"service_mode":"public","webhook_config":{"endpoint":"","secret":""}},"input":{"aspect_ratio":"16:9","bot_id":0,"process_mode":"fast","prompt":"a girl using a laptop on a desk inside a house, lofi, painting, chil, pop, midnight, rainy","skip_prompt_check":false},"output":{"image_url":"https://img.theapi.app/mj/c130c235-8cc4-4a64-8db1-238fd073c697.png","image_urls":null,"temporary_image_urls":["https://img.theapi.app/cdn-cgi/image/trim=0;1456;816;0/mj/c130c235-8cc4-4a64-8db1-238fd073c697.png","https://img.theapi.app/cdn-cgi/image/trim=0;0;816;1456/mj/c130c235-8cc4-4a64-8db1-238fd073c697.png","https://img.theapi.app/cdn-cgi/image/trim=816;1456;0;0/mj/c130c235-8cc4-4a64-8db1-238fd073c697.png","https://img.theapi.app/cdn-cgi/image/trim=816;0;0;1456/mj/c130c235-8cc4-4a64-8db1-238fd073c697.png"],"discord_image_url":"","actions":["reroll","upscale1","upscale2","upscale3","upscale4","variation1","variation2","variation3","variation4"],"progress":100,"intermediate_image_urls":null},"meta":{"created_at":"2025-05-19T12:14:12Z","started_at":"2025-05-19T12:14:15Z","ended_at":"2025-05-19T12:14:39Z","usage":{"type":"point","frozen":700000,"consume":700000},"is_using_private_pool":false,"model_version":"unknown","process_mode":"fast","failover_triggered":false},"detail":null,"logs":[],"error":{"code":0,"raw_message":"","message":"","detail":null}}';
    ////// TESTTING /////


    const image = JSON.parse(imageDataString);
    const imageUrl = image?.output?.image_url; // adjust key to match real API response
    if (!imageUrl) {
      throw new Error("No image URL returned from image API");
    }

    // Fetch image binary
    const imageData = await fetch(imageUrl);
    const buffer = await imageData.arrayBuffer();

    // Define a filename and path
    const fileName = `image-${Date.now()}.jpg`;
    const filePath = path.join(process.cwd(), 'public', fileName);

    // Save image
    await writeFile(filePath, Buffer.from(buffer));

    console.log("Image saved:", filePath);


    // return NextResponse.json({ image });
    return NextResponse.json({ weather });
    // return NextResponse.json({ background, music });

  } catch (err) {
    console.error("generate-content error:", err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}