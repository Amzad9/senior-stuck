import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set');
}

const googleSheetsWebhookUrl = 'https://script.google.com/macros/s/AKfycbwk0oDRiVoGHctGoW4g8-ug-p4hFPWGJoT7_Qi0ufcO8V-w-m5L-MZKFTM7Y5AXNqVKNw/exec'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2026-01-28.clover',
});

async function sendCheckoutToGoogleSheet(name: string, email: string) {
  if (!googleSheetsWebhookUrl) {
    return { synced: false, reason: 'missing_webhook_url' };
  }

  const response = await fetch(googleSheetsWebhookUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name,
      email,
      date: new Date().toISOString(),
    }),
  });

  if (!response.ok) {
    const responseBody = await response.text().catch(() => '');
    throw new Error(
      `Google Sheets webhook failed with status ${response.status}${responseBody ? `: ${responseBody}` : ''}`
    );
  }

  return { synced: true as const };
}

export async function GET(request: NextRequest) {
  try {
    const sessionId = request.nextUrl.searchParams.get('session_id');
    const syncSheet = request.nextUrl.searchParams.get('sync_sheet') === '1';

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      );
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const name = session.customer_details?.name || 'Unknown';
    const email =
      session.customer_details?.email ||
      session.customer_email ||
      session.metadata?.email ||
      null;

    let synced = false;
    let syncError: string | null = null;

    if (syncSheet && session.payment_status === 'paid' && email) {
      try { 
        const result = await sendCheckoutToGoogleSheet(name, email);
        synced = result.synced;
        console.log('[checkout-email] synced checkout to Google Sheet', {
          sessionId,
          name,
          email,
          webhookUrl: googleSheetsWebhookUrl,
        });
      } catch (error: any) {
        syncError = error?.message || 'Failed to sync Google Sheet';
        console.error('[checkout-email] failed to sync Google Sheet', {
          sessionId,
          name,
          email,
          message: error?.message,
          stack: error?.stack,
        });
      }
    }

    return NextResponse.json({
      name,
      email,
      paymentStatus: session.payment_status,
      synced,
      syncError,
    });
  } catch (error: any) {
    console.error('[checkout-email] failed to retrieve checkout email', {
      message: error?.message,
      stack: error?.stack,
    });

    return NextResponse.json(
      { error: 'Failed to retrieve checkout email' },
      { status: 500 }
    );
  }
}
