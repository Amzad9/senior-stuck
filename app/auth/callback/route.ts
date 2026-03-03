import { createClient } from '@/utils/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const next = requestUrl.searchParams.get('next') || '/dashboard';

  if (code) {
    const cookieStore = cookies();
    const supabase = await createClient(cookieStore);
    
    await supabase.auth.exchangeCodeForSession(code);
  }

  // Redirect to the dashboard or the specified next URL
  return NextResponse.redirect(new URL(next, request.url));
}
