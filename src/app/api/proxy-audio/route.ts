import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");
  if (!url) return new Response("Missing URL", { status: 400 });

  // Force correct Range for streaming
  const range = req.headers.get("range") ?? "bytes=0-";

  const res = await fetch(url, {
    headers: {
      Range: range,
    },
  });

  const ext = url.split('.').pop()?.toLowerCase();
  const forcedContentType =
    ext === "mp3" ? "audio/mpeg" :
      ext === "wav" ? "audio/wav" :
        ext === "ogg" ? "audio/ogg" :
          "audio/mpeg"; // default fallback to prevent ORB

  const headers = new Headers();
  headers.set("Content-Type", forcedContentType);
  headers.set("Accept-Ranges", "bytes");
  headers.set("Access-Control-Allow-Origin", "*");

  // copy relevant streaming headers
  const contentRange = res.headers.get("Content-Range");
  const contentLength = res.headers.get("Content-Length");
  if (contentRange) headers.set("Content-Range", contentRange);
  if (contentLength) headers.set("Content-Length", contentLength);

  return new Response(res.body, {
    status: res.status,
    headers,
  });
}