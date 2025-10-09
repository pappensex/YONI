import type { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

export const config = { api: { bodyParser: false } };

function buffer(req: any): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const _buf: any[] = [];
    req.on('data', (chunk: any) => _buf.push(chunk));
    req.on('end', () => resolve(Buffer.concat(_buf)));
    req.on('error', reject);
  });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error('Missing STRIPE_WEBHOOK_SECRET');
    return res.status(500).json({ error: 'Server misconfigured' });
  }

  const sig = req.headers['stripe-signature'] as string;
  const buf = await buffer(req as any);

  let event: Stripe.Event;
  try {
    // ⚠️ Kein Stripe-Client nötig
    event = Stripe.webhooks.constructEvent(buf, sig, webhookSecret);
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle events
  switch (event.type) {
    case 'checkout.session.completed':
      console.log('✅ checkout.session.completed', event.data.object);
      break;
    case 'payment_intent.succeeded':
      console.log('✅ payment_intent.succeeded', event.data.object);
      break;
    default:
      console.log(`ℹ️ Unhandled event: ${event.type}`);
  }

  return res.status(200).json({ received: true });
}
