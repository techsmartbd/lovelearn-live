import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');
  const direct = searchParams.get('direct');

  if (!code && !direct) {
    return new NextResponse('No URL provided', { status: 400 });
  }

  try {
    let fileUrl = direct;

    if (code) {
      const pcloudRes = await fetch(`https://api.pcloud.com/getpublinkdownload?code=${code}`, {
        referrerPolicy: "no-referrer"
      });
      const data = await pcloudRes.json();
      
      if (data.result === 0 && data.hosts?.length > 0 && data.path) {
        fileUrl = `https://${data.hosts[0]}${data.path}`;
      } else {
        return new NextResponse('File not found on pCloud', { status: 404 });
      }
    }

    if (!fileUrl) {
      return new NextResponse('Invalid URL', { status: 400 });
    }

    const pdfRes = await fetch(fileUrl, {
      referrerPolicy: "no-referrer"
    });

    if (!pdfRes.ok) {
      return new NextResponse('Failed to fetch PDF', { status: pdfRes.status });
    }

    return new NextResponse(pdfRes.body, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'inline',
        'Access-Control-Allow-Origin': '*', // Allow our canvas viewer to read it
      },
    });
  } catch (error) {
    console.error('PDF Proxy Error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
