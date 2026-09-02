import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  
  if (!code) {
    return NextResponse.json({ error: 'No code provided' }, { status: 400 });
  }

  try {
    // Step 1: Resolve pCloud direct URL
    const apiRes = await fetch(`https://api.pcloud.com/getpublinkdownload?code=${code}`);
    const apiData = await apiRes.json();

    if (apiData.result !== 0 || !apiData.hosts?.length || !apiData.path) {
      return NextResponse.json({ error: 'pCloud link invalid' }, { status: 404 });
    }

    const directUrl = `https://${apiData.hosts[0]}${apiData.path}`;

    // Step 2: Forward range request to pCloud
    const range = request.headers.get('range');
    const fetchHeaders: Record<string, string> = {};
    if (range) {
      fetchHeaders['Range'] = range;
    }

    const videoRes = await fetch(directUrl, { headers: fetchHeaders });

    if (!videoRes.ok && videoRes.status !== 206) {
      return NextResponse.json({ error: 'Failed to fetch video' }, { status: 502 });
    }

    const headers = new Headers();
    const contentType = videoRes.headers.get('content-type') || 'video/mp4';
    
    headers.set('Content-Type', contentType);
    headers.set('Accept-Ranges', 'bytes');
    headers.set('Cache-Control', 'public, max-age=3600');
    headers.set('Access-Control-Allow-Origin', '*');

    const contentLength = videoRes.headers.get('content-length');
    if (contentLength) {
      headers.set('Content-Length', contentLength);
    }

    const contentRange = videoRes.headers.get('content-range');
    if (contentRange) {
      headers.set('Content-Range', contentRange);
    }

    return new NextResponse(videoRes.body, {
      status: videoRes.status,
      headers,
    });
  } catch (error: any) {
    console.error('Stream proxy error:', error);
    return NextResponse.json({ error: 'Stream failed' }, { status: 500 });
  }
}
