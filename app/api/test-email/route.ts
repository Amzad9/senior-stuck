import { NextRequest, NextResponse } from 'next/server';
import { sendPDF } from '@/lib/sendEmail';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  // Security: require a token so this can't be abused publicly.
  const token = request.nextUrl.searchParams.get('token') || '';
  const expected = process.env.EMAIL_TEST_TOKEN || '';

  if (!expected) {
    console.error('[test-email] EMAIL_TEST_TOKEN is missing; refusing to run');
    return NextResponse.json({ error: 'EMAIL_TEST_TOKEN not configured' }, { status: 500 });
  }

  if (token !== expected) {
    console.error('[test-email] invalid token');
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const to = request.nextUrl.searchParams.get('to') || '';
  if (!to) {
    return NextResponse.json({ error: 'Missing `to` query param' }, { status: 400 });
  }

  const downloadUrl = new URL('/_Lead%20magner%20pdf%20.pdf', request.nextUrl.origin).toString();

  console.log('[test-email] start', { to });
  try {
    await sendPDF(to, { downloadUrl });
    console.log('[test-email] success', { to });
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err: any) {
    console.error('[test-email] failed', { message: err?.message, stack: err?.stack });
    return NextResponse.json({ ok: false, error: 'Send failed' }, { status: 500 });
  }
}

