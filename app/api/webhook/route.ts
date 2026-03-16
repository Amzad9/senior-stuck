import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2026-01-28.clover',
});

const googleSheetsWebhookUrl =
  process.env.GOOGLE_SHEETS_WEBHOOK_URL?.trim() ||
  process.env.NEXT_PUBLIC_GOOGLE_SHEETS_WEBHOOK_URL?.trim() ||
  '';

interface SheetRow {
  name: string;
  email: string;
  payment_method: string;
  country: string;
  created: string;
  total_spend: string;
  currency: string;
  payment_status: string;
  date: string;
}

async function sendToGoogleSheet(row: SheetRow) {

  if (!googleSheetsWebhookUrl) {
    console.warn('[webhook] GOOGLE_SHEETS_WEBHOOK_URL not set');
    return;
  }

  try {

    console.log('[webhook] sending to sheet', row);

    const res = await fetch(googleSheetsWebhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(row),
    });

    const text = await res.text();

    if (!res.ok) {
      console.error('[webhook] Google Sheets send failed', {
        status: res.status,
        response: text,
      });
    } else {
      console.log('[webhook] Google Sheets updated');
    }

  } catch (err: any) {
    console.error('[webhook] Google Sheets error', err?.message);
  }
}

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {

  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 });
  }

  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {

    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );

  } catch (err: any) {

    return NextResponse.json({ error: err.message }, { status: 400 });

  }

  try {

    if (event.type === 'checkout.session.completed') {

        const session = event.data.object as Stripe.Checkout.Session;

      console.log('[webhook] session received', {
        id: session.id,
        payment_intent: session.payment_intent,
        subscription: session.subscription,
        amount_total: session.amount_total,
        currency: session.currency,
        customer_details: session.customer_details,
      });

        const email =
        session.customer_details?.email ||
        session.customer_email ||
        session.metadata?.email ||
        'unknown@email.com';

      const name =
        session.customer_details?.name ||
        'Unknown';

      const country =
        session.customer_details?.address?.country ||
        'N/A';

      const created = new Date(session.created * 1000).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });

      const amountTotal     = session.amount_total ?? 0;
      const currency        = (session.currency ?? 'usd').toUpperCase();
      const total_spend     = (amountTotal / 100).toFixed(2);
      const payment_method  = session.payment_method_types?.[0] || 'card';

      console.log('[webhook] Stripe Data', {
        name,
        email,
        country,
        total_spend,
        currency
      });

      await sendToGoogleSheet({
        name,
        email,
        payment_method,
        country,
        created,
        total_spend,
        currency,
        payment_status: session.payment_status,
        date: new Date().toLocaleString('en-US', {
          month: 'short', day: 'numeric', year: 'numeric',
          hour: '2-digit', minute: '2-digit', hour12: false,
        }),
      });

    }

    return NextResponse.json({ received: true });

  } catch (err: any) {

    console.error('[webhook] Processing error:', err?.message);

    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}