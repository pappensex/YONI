import Stripe from "stripe";
import { NextResponse } from "next/server";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  console.warn("STRIPE_SECRET_KEY fehlt – Checkout-API im BLOCKER-Zustand.");
}

const stripe = stripeSecretKey ? new Stripe(stripeSecretKey) : null;

export async function POST(request: Request) {
  if (!stripe) {
    return NextResponse.json(
      { status: "BLOCKER", reason: "STRIPE_SECRET_KEY ist nicht gesetzt" },
      { status: 500 }
    );
  }

  const body = await request.json().catch(() => ({}));

  const priceId = body.priceId as string | undefined;
  const successUrl = body.successUrl as string | undefined;
  const cancelUrl = body.cancelUrl as string | undefined;

  if (!priceId || !successUrl || !cancelUrl) {
    return NextResponse.json(
      { status: "BLOCKER", reason: "priceId, successUrl, cancelUrl erforderlich" },
      { status: 400 }
    );
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price: priceId,
          quantity: 1
        }
      ],
      success_url: successUrl,
      cancel_url: cancelUrl
    });

    return NextResponse.json(
      {
        status: "STABIL",
        url: session.url
      },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("Stripe Checkout Fehler:", err);
    return NextResponse.json(
      {
        status: "BLOCKER",
        reason: "Stripe Fehler",
        detail: err?.message ?? "unbekannt"
      },
      { status: 500 }
    );
  }
}