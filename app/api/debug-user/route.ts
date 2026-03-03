import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/utils/supabase/service';

/**
 * Debug endpoint to check user data in database
 * Usage: /api/debug-user?uid=user-id-here
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const uid = searchParams.get('uid');

    if (!uid) {
      return NextResponse.json(
        { error: 'UID is required. Usage: /api/debug-user?uid=user-id' },
        { status: 400 }
      );
    }

    const supabase = createServiceClient();
    
    // Check if user exists
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', uid)
      .single();

    if (userError) {
      if (userError.code === 'PGRST116') {
        return NextResponse.json({
          exists: false,
          uid: uid,
          message: 'User not found in database',
        });
      }
      return NextResponse.json({
        error: 'Database error',
        code: userError.code,
        message: userError.message,
        details: userError.details,
      }, { status: 500 });
    }

    return NextResponse.json({
      exists: true,
      user: userData,
    });
  } catch (error: any) {
    console.error('Error in debug-user:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to debug user' },
      { status: 500 }
    );
  }
}
