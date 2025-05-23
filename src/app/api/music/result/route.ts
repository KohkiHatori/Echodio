import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const taskId = searchParams.get('task_id');

  if (!taskId) {
    return NextResponse.json({ error: 'Missing task_id' }, { status: 400 });
  }

  try {
    const response = await fetch(`https://api.goapi.ai/api/v1/task/${taskId}`, {
      method: 'GET',
      headers: {
        'x-api-key': process.env.GO_API_KEY || '', // Your GoAPI key from .env
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('GoAPI task status error:', errorText);
      return NextResponse.json({ error: 'Failed to fetch task status' }, { status: response.status });
    }

    const result = await response.json();
    return NextResponse.json(result);

  } catch (error) {
    console.error('Task status error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}


