import { NextResponse } from 'next/server';

// for testing purposes, we're using hardcoded task ids
let counter = 0;
const task_ids = [
    "e3471dc2-d1ea-4cc5-ba65-5911a1f9091a",
    // "7a5b690a-0b13-45f6-8d8a-9cd8b1e7f047",
    "e47d2efc-1a4f-401a-8912-13aaa365df32"
]

export async function POST(request: Request) {
    try {
        //         const body = await request.json();
        //         const { timeLabel, weatherDescription, lyricsType = 'generate', negativeTags = '' } = body;

        //         const prompt = `chil, pop, ${timeLabel}, with ${weatherDescription}`;

        //         const payload = {
        //             model: "music-u",
        //             task_type: "generate_music",
        //             input: {
        //                 gpt_description_prompt: prompt,
        //                 negative_tags: negativeTags,
        //                 lyrics_type: lyricsType,
        //                 seed: -1,
        //             },
        //             config: {
        //                 service_mode: "public",
        //                 webhook_config: {
        //                 endpoint: "",
        //                 secret: "",
        //                 },
        //             },
        //         };
        //          const response = await fetch('https://api.goapi.ai/api/v1/task', {
        //             method: 'POST',
        //             headers: {
        //                 'Content-Type': 'application/json',
        //                 'x-api-key': process.env.GO_API_KEY ?? '',
        //             },
        //             body: JSON.stringify(payload),
        //         });

        //         if (!response.ok) {
        //             const errorText = await response.text();
        //             console.error('GoAPI error:', errorText);
        //             return NextResponse.json({ error: 'Failed to generate music' }, { status: response.status });
        //         }

        //         const result = await response.json();
        //         console.log("📩 GoAPI response body:", result);
        //         if (!result.data?.task_id) {
        //             console.error("❌ No task_id found in GoAPI response:", result);
        //             return NextResponse.json({ error: "Missing task_id" }, { status: 502 });
        // }

        //         // saveMusicTask(task_id, { prompt: prompt, lyricsType: lyricsType });

        //         return NextResponse.json({ task_id: result.data.task_id });

        // TEMPORALILLY using hardcoded task ids to prevent external API calls
        // return NextResponse.json({ task_id: "e3471dc2-d1ea-4cc5-ba65-5911a1f9091a" });
        return NextResponse.json({ task_id: task_ids[counter++ % task_ids.length] });

    } catch (error) {
        console.error('Error in /api/music:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }


}