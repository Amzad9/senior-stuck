import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/utils/supabase/service';

/**
 * Test endpoint to manually insert a test user record
 * Usage: GET /api/test-insert?uid=test-user-id&email=test@example.com
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const uid = searchParams.get('uid') || '4d8fe6e4-731f-484b-a53d-5b207666cf44'; // Your user ID from cookies
    const email = searchParams.get('email') || 'amzad.fineart@gmail.com';

    console.log('🧪 Test insert: Attempting to insert user:', uid);

    const supabase = createServiceClient();

    const testData = {
      id: uid,
      email: email,
      subscription_status: 'active' as const,
      plan: 'monthly' as const,
      stripe_customer_id: 'cus_test_123',
      current_period_end: Date.now() + (30 * 24 * 60 * 60 * 1000), // 30 days from now
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    console.log('📤 Inserting test data:', JSON.stringify(testData, null, 2));

    const { data, error } = await supabase
      .from('users')
      .upsert(testData, {
        onConflict: 'id',
      })
      .select();

    if (error) {
      console.error('❌ Error inserting:', error);
      return NextResponse.json({
        error: 'Failed to insert',
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
      }, { status: 500 });
    }

    console.log('✅ Inserted successfully:', data);

    // Verify it was saved
    const { data: verifyData, error: verifyError } = await supabase
      .from('users')
      .select('*')
      .eq('id', uid)
      .single();

    return NextResponse.json({
      success: true,
      message: 'Test user inserted successfully',
      inserted: data,
      verified: verifyData,
      verifyError: verifyError?.message,
    });
  } catch (error: any) {
    console.error('❌ Unexpected error:', error);
    return NextResponse.json({
      error: 'Unexpected error',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    }, { status: 500 });
  }
}
