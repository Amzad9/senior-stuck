import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { name, email } = await request.json();

    if (!name || !email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      );
    }

    // TODO: Integrate with your email service (e.g., SendGrid, Mailchimp, etc.)
    // For now, we'll just log the submission
    console.log('Lead submitted:', { name, email, timestamp: new Date().toISOString() });

    // You can add email sending logic here
    // Example: await sendEmail(email, name);

    return NextResponse.json(
      { success: true, message: 'Lead submitted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error submitting lead:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
