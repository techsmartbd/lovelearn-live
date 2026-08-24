import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  
  if (!code) {
    return NextResponse.json({ error: 'No pCloud code provided' }, { status: 400 });
  }

  try {
    const res = await fetch(`https://api.pcloud.com/getpublinkdownload?code=${code}`);
    const data = await res.json();

    if (data.result === 0 && data.hosts && data.hosts.length > 0 && data.path) {
      const directUrl = `https://${data.hosts[0]}${data.path}`;
      // Redirect to the direct media stream URL
      return NextResponse.redirect(directUrl);
    } else {
      console.error('pCloud API error:', data);
      return NextResponse.json({ error: 'Failed to resolve pCloud link', details: data }, { status: 404 });
    }
  } catch (error: any) {
    console.error('pCloud fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
