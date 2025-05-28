// src/app/api/proxy-image/route.ts
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get('url');

  if (!url) {
    return new Response('Missing image URL', { status: 400 });
  }

  try {
    const response = await fetch(url, {
      headers: {
        // optional: mimic browser headers
        'User-Agent': req.headers.get('user-agent') || '',
      },
    });

    if (!response.ok) {
      return new Response('Failed to fetch image', { status: 500 });
    }

    const contentType = response.headers.get('content-type') || 'image/png';
    const arrayBuffer = await response.arrayBuffer();

    return new Response(arrayBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Access-Control-Allow-Origin': '*', // allow canvas access
        'Cache-Control': 'public, max-age=86400', // optional
      },
    });
  } catch (e) {
    return new Response('Error fetching image', { status: 500 });
  }
}