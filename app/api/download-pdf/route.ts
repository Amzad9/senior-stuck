import { NextResponse } from 'next/server';
import { readFile, existsSync } from 'fs';
import { join } from 'path';

export async function GET() {
  try {
    const pdfPath = join(process.cwd(), 'public', 'lead-magnet.pdf');
    
    // Check if PDF exists
    if (existsSync(pdfPath)) {
      const pdfBuffer = await readFile(pdfPath);
      
      return new NextResponse(pdfBuffer, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': 'attachment; filename="senior-stuck-free-guide.pdf"',
          'Cache-Control': 'public, max-age=3600',
        },
      });
    }

    // If PDF doesn't exist yet, redirect to a message or return error
    return NextResponse.json(
      { 
        message: 'PDF is being prepared. Please check back soon or contact us at mjohnsonsports@aol.com',
        note: 'To enable PDF download, place your PDF file at /public/lead-magnet.pdf'
      },
      { status: 404 }
    );
  } catch (error) {
    console.error('Error serving PDF:', error);
    return NextResponse.json(
      { error: 'PDF not available yet. Please contact support at mjohnsonsports@aol.com' },
      { status: 500 }
    );
  }
}
