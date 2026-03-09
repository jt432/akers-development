import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';

// Single-file streaming upload endpoint.
// Files stream directly to Vercel Blob without buffering in memory,
// bypassing the 4.5MB serverless body size limit.
export async function PUT(req: NextRequest) {
  try {
    const filename = req.nextUrl.searchParams.get('filename');
    if (!filename) {
      return NextResponse.json({ error: 'Missing filename parameter.' }, { status: 400 });
    }

    // Validate extension
    const ext = filename.split('.').pop()?.toLowerCase();
    const allowed = ['pdf', 'jpg', 'jpeg', 'png', 'docx'];
    if (!ext || !allowed.includes(ext)) {
      return NextResponse.json(
        { error: `File type .${ext} is not allowed. Use PDF, JPG, PNG, or DOCX.` },
        { status: 400 }
      );
    }

    if (!req.body) {
      return NextResponse.json({ error: 'No file body.' }, { status: 400 });
    }

    const timestamp = Date.now();
    const safeName = filename.replace(/[^a-zA-Z0-9._-]/g, '_');

    // Stream the request body directly to Vercel Blob — no buffering
    const blob = await put(`uploads/${timestamp}-${safeName}`, req.body, {
      access: 'public',
      addRandomSuffix: true,
    });

    return NextResponse.json({
      success: true,
      url: blob.url,
      filename: filename,
    });
  } catch (error) {
    console.error('File upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload file.' },
      { status: 500 }
    );
  }
}
