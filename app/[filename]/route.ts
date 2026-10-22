import { NextRequest } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  const { filename } = await params;

  // Handle any Google Search Console HTML verification file request (e.g., google1234567890abcdef.html)
  if (filename && filename.startsWith('google') && filename.endsWith('.html')) {
    return new Response(`google-site-verification: ${filename}`, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, max-age=86400',
      },
    });
  }

  return new Response('Not Found', { status: 404 });
}
