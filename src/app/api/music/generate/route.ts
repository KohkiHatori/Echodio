import { NextResponse } from 'next/server';


export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { prompt, lyricsType = 'generate', negativeTags = '' } = body;

        if (!prompt) {
            return NextResponse.json({ error: 'Missing prompt' }, { status: 400 });
        }

        const payload = {
            model: "music-u",
            task_type: "generate_music",
            input: {
                gpt_description_prompt: prompt,
                negative_tags: "",
                lyrics_type: lyricsType,
                seed: -1,
            },
            config: {
                service_mode: "public",
                webhook_config: {
                endpoint: "",
                secret: "",
                },
            },
        };
         const response = await fetch('https://api.goapi.ai/api/v1/task', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': process.env.GO_API_KEY ?? '',
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('GoAPI error:', errorText);
            return NextResponse.json({ error: 'Failed to generate music' }, { status: response.status });
        }

        const result = await response.json();
        return NextResponse.json({ task_id: result.task_id });

    } catch (error) {
        console.error('Error in /api/music:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }

    
}