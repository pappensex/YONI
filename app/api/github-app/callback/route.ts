import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code');
  const state = req.nextUrl.searchParams.get('state');
  if (!code) return NextResponse.redirect('/?auth=missing_code');

  // Exchange code → access token (GitHub OAuth for GitHub App)
  const res = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: { 'Accept': 'application/json' },
    body: new URLSearchParams({
      client_id: process.env.GITHUB_APP_CLIENT_ID!,
      client_secret: process.env.GITHUB_APP_CLIENT_SECRET!,
      code,
      state: state ?? ''
    })
  });

  const data = await res.json();
  // Persist token (per user/installation) – store securely.
  // For demo we just echo status.
  return NextResponse.redirect('/?auth=ok&provider=github&x=148');
}
