import { NextResponse } from 'next/server';


export async function POST(_request: Request) {
    try {
        // const body = await request.json();
        // const { timeLabel, weatherDescription, lyricsType = 'generate', negativeTags = '' } = body;

        // const prompt = `chil, pop, ${timeLabel}, with ${weatherDescription}`;

        // const payload = {
        //     model: "music-u",
        //     task_type: "generate_music",
        //     input: {
        //         gpt_description_prompt: prompt,
        //         negative_tags: negativeTags,
        //         lyrics_type: lyricsType,
        //         seed: -1,
        //     },
        //     config: {
        //         service_mode: "public",
        //         webhook_config: {
        //         endpoint: "",
        //         secret: "",
        //         },
        //     },
        // };
        //  const response = await fetch('https://api.goapi.ai/api/v1/task', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //         'x-api-key': process.env.GO_API_KEY ?? '',
        //     },
        //     body: JSON.stringify(payload),
        // });

        // if (!response.ok) {
        //     const errorText = await response.text();
        //     console.error('GoAPI error:', errorText);
        //     return NextResponse.json({ error: 'Failed to generate music' }, { status: response.status });
        // }

        // const result = await response.json();
        // return NextResponse.json({ task_id: result.task_id });

        // TEMPORALILLY using hardcoded task ids to prevent external API calls
        return NextResponse.json({ task_id: "XXXXXXXXX"});

    } catch (error) {
        console.error('Error in /api/music:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }

    
}