import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/utils/supabase/service';

/**
 * Test endpoint to verify checkout flow and user ID matching
 * Usage: GET /api/test-checkout-flow?uid=user-id-here
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const uid = searchParams.get('uid');

    if (!uid) {
      return NextResponse.json(
        { error: 'UID is required. Usage: /api/test-checkout-flow?uid=user-id' },
        { status: 400 }
      );
    }

    const supabase = createServiceClient();

    // Check if user exists in users table
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', uid)
      .single();

    // Check if user exists in auth.users (Supabase auth)
    const { data: authUser, error: authError } = await supabase.auth.admin.getUserById(uid);

    return NextResponse.json({
      uid: uid,
      users_table: {
        exists: !!userData,
        data: userData,
        error: userError?.message,
      },
      auth_users: {
        exists: !!authUser?.user,
        email: authUser?.user?.email,
        error: authError?.message,
      },
      recommendation: !userData 
        ? 'User not found in users table. This is expected if they haven\'t subscribed yet.'
        : 'User found in users table with subscription data.',
    });
  } catch (error: any) {
    console.error('Error in test-checkout-flow:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to test checkout flow' },
      { status: 500 }
    );
  }
}
