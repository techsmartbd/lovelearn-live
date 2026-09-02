import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  
  if (!code) {
    return NextResponse.json({ error: 'No code provided' }, { status: 400 });
  }

  try {
    // Step 1: Resolve pCloud direct URL server-side (no CORS issue)
    const apiRes = await fetch(`https://api.pcloud.com/getpublinkdownload?code=${code}`);
    const apiData = await apiRes.json();

    if (apiData.result !== 0 || !apiData.hosts?.length || !apiData.path) {
      return NextResponse.json({ error: 'pCloud link invalid' }, { status: 404 });
    }

    const directUrl = `https://${apiData.hosts[0]}${apiData.path}`;

    // Step 2: Fetch video from pCloud and stream to client
    const videoRes = await fetch(directUrl);

    if (!videoRes.ok) {
      return NextResponse.json({ error: 'Failed to fetch video' }, { status: 502 });
    }

    // Stream the response with proper headers
    const headers = new Headers();
    const contentType = videoRes.headers.get('content-type') || 'video/mp4';
    const contentLength = videoRes.headers.get('content-length');
    
    headers.set('Content-Type', contentType);
    headers.set('Cache-Control', 'public, max-age=3600');
    headers.set('Access-Control-Allow-Origin', '*');
    
    if (contentLength) {
      headers.set('Content-Length', contentLength);
    }

    // Handle range requests for video seeking
    const range = request.headers.get('range');
    if (range) {
      headers.set('Content-Range', videoRes.headers.get('Content-Range') || '');
      headers.set('Accept-Ranges', 'bytes');
    }

    return new NextResponse(videoRes.body, {
      status: range ? 206 : 200,
      headers,
    });
  } catch (error: any) {
    console.error('Stream proxy error:', error);
    return NextResponse.json({ error: 'Stream failed' }, { status: 500 });
  }
}
