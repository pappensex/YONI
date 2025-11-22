import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ items: [] });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  // TODO: Persist flows to database
  return NextResponse.json({ ok: true, item: body }, { status: 201 });
}
