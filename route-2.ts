import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    items: [
      {
        id: "demo-energy-1",
        habit: "Fokus 25 min",
        state: "active"
      }
    ]
  });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  return NextResponse.json({ ok: true, item: body }, { status: 201 });
}
