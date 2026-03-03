import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { getUserDocument } from '@/lib/supabase-db';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const uid = searchParams.get('uid');

    if (!uid) {
      return NextResponse.json(
        { error: 'User ID is required. Please log in to access this resource.' },
        { status: 401 }
      );
    }

    // Get user document to check subscription status
    let userDoc;
    try {
      userDoc = await getUserDocument(uid);
    } catch (error) {
      console.error('Error fetching user document:', error);
      return NextResponse.json(
        { error: 'Failed to verify subscription status' },
        { status: 500 }
      );
    }

    // Check if user has active subscription
    if (!userDoc || userDoc.subscriptionStatus !== 'active') {
      return NextResponse.json(
        { error: 'Active subscription required to access this resource' },
        { status: 403 }
      );
    }

    // Read the PDF file
    try {
      const pdfPath = join(process.cwd(), 'public', '_Lead magner pdf .pdf');
      const pdfBuffer = await readFile(pdfPath);

      // Return PDF with proper headers
      return new NextResponse(pdfBuffer, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': 'inline; filename="Unstuck-Newsletter-Guide.pdf"',
          'Cache-Control': 'private, no-cache, no-store, must-revalidate',
        },
      });
    } catch (error) {
      console.error('Error reading PDF file:', error);
      return NextResponse.json(
        { error: 'PDF file not found' },
        { status: 404 }
      );
    }
  } catch (error: any) {
    console.error('Error in download-pdf route:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to download PDF' },
      { status: 500 }
    );
  }
}
