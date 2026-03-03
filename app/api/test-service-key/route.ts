import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/utils/supabase/service';

/**
 * Test endpoint to verify service role key is working
 * Usage: GET /api/test-service-key
 */
export async function GET(request: NextRequest) {
  try {
    // Test 1: Check if environment variables are set
    const hasUrl = !!process.env.NEXT_PUBLIC_SUPABASE_URL;
    const hasServiceKey = !!process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!hasUrl) {
      return NextResponse.json({
        error: 'NEXT_PUBLIC_SUPABASE_URL is not set',
        status: 'missing_env',
      }, { status: 500 });
    }
    
    if (!hasServiceKey) {
      return NextResponse.json({
        error: 'SUPABASE_SERVICE_ROLE_KEY is not set',
        status: 'missing_env',
        hint: 'Add SUPABASE_SERVICE_ROLE_KEY to your .env.local file',
      }, { status: 500 });
    }

    // Test 2: Try to create service client
    let supabase;
    try {
      supabase = createServiceClient();
    } catch (clientError: any) {
      return NextResponse.json({
        error: 'Failed to create service client',
        message: clientError.message,
        status: 'client_error',
      }, { status: 500 });
    }

    // Test 3: Try to query the database
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1);

    if (error) {
      return NextResponse.json({
        error: 'Database query failed',
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
        status: 'database_error',
      }, { status: 500 });
    }

    return NextResponse.json({
      status: 'success',
      message: 'Service role key is working correctly!',
      tests: {
        env_url_set: hasUrl,
        env_service_key_set: hasServiceKey,
        client_created: true,
        database_query: 'success',
      },
    });
  } catch (error: any) {
    return NextResponse.json({
      error: 'Unexpected error',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      status: 'unexpected_error',
    }, { status: 500 });
  }
}
