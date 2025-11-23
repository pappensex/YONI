import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  if (!stripe) {
    return NextResponse.json(
      { error: "Stripe not configured" },
      { status: 500 }
    );
  }

  const { priceId } = await req.json();

  if (!priceId) {
    return NextResponse.json(
      { error: "Missing priceId" },
      { status: 400 }
    );
  }

  if (!process.env.NEXT_PUBLIC_APP_URL) {
    console.warn("NEXT_PUBLIC_APP_URL is not set.");
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${baseUrl}/dashboard?checkout=success`,
    cancel_url: `${baseUrl}/?checkout=cancel`
  });

  return NextResponse.json({ url: session.url });
}
