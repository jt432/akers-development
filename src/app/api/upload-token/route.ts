import { NextRequest, NextResponse } from 'next/server';
import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';

// This endpoint generates client-side upload tokens for Vercel Blob.
// Files go directly from the browser to Blob storage, bypassing the
// 4.5MB serverless function body size limit.
export async function POST(req: NextRequest) {
  const body = (await req.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request: req,
      onBeforeGenerateToken: async (pathname) => {
        // Validate the file extension
        const ext = pathname.split('.').pop()?.toLowerCase();
        const allowed = ['pdf', 'jpg', 'jpeg', 'png', 'docx'];
        if (!ext || !allowed.includes(ext)) {
          throw new Error(`File type .${ext} is not allowed. Use PDF, JPG, PNG, or DOCX.`);
        }

        return {
          allowedContentTypes: [
            'application/pdf',
            'image/jpeg',
            'image/png',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          ],
          maximumSizeInBytes: 25 * 1024 * 1024, // 25MB
          tokenPayload: JSON.stringify({}),
        };
      },
      onUploadCompleted: async ({ blob }) => {
        // File uploaded successfully to Vercel Blob
        console.log('File uploaded to blob:', blob.url);
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    console.error('Upload token error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate upload token.' },
      { status: 400 }
    );
  }
}
