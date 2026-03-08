import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { sendNotificationEmail } from '@/lib/email';

const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25MB
const MAX_FILES = 10;
const ALLOWED_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];
const ALLOWED_EXTENSIONS = ['pdf', 'jpg', 'jpeg', 'png', 'docx'];

const VALID_CONSULTANTS = [
  'Jon Tyler Akers',
  'Tristan Gardner',
  'Jacob Wilson',
  'Dylan Scott',
  'Chapman Suggs',
];

// Rate limiting
const submissions = new Map<string, number>();
function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const last = submissions.get(ip) || 0;
  if (now - last < 120_000) return true; // 2 min cooldown for uploads
  submissions.set(ip, now);
  for (const [key, time] of submissions) {
    if (now - time > 600_000) submissions.delete(key);
  }
  return false;
}

// Log consultant selection to Vercel Blob for tracking
async function logConsultantSelection(consultant: string, clientName: string, projectType: string) {
  try {
    const entry = {
      consultant,
      clientName,
      projectType,
      timestamp: new Date().toISOString(),
    };

    // Store each submission as a separate JSON file in blob storage
    const filename = `consultant-log/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.json`;
    await put(filename, JSON.stringify(entry), {
      access: 'public',
      addRandomSuffix: false,
    });
  } catch (err) {
    // Don't fail the submission if logging fails
    console.error('Failed to log consultant selection:', err);
  }
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') || 'unknown';
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: 'Too many submissions. Please wait and try again.' },
        { status: 429 }
      );
    }

    const formData = await req.formData();

    // Extract fields
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const location = formData.get('location') as string;
    const projectType = formData.get('projectType') as string;
    const squareFootage = formData.get('squareFootage') as string;
    const description = formData.get('description') as string;
    const consultant = formData.get('consultant') as string;

    // Validation
    if (!name || !email || !location || !projectType || !description || !consultant) {
      return NextResponse.json(
        { error: 'Please fill in all required fields.' },
        { status: 400 }
      );
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: 'Please provide a valid email address.' },
        { status: 400 }
      );
    }
    if (!VALID_CONSULTANTS.includes(consultant)) {
      return NextResponse.json(
        { error: 'Please select a valid consultant.' },
        { status: 400 }
      );
    }

    // Process file uploads
    const files = formData.getAll('files') as File[];
    const uploadedFiles: { name: string; url: string; size: number }[] = [];

    if (files.length > MAX_FILES) {
      return NextResponse.json(
        { error: `Maximum ${MAX_FILES} files allowed.` },
        { status: 400 }
      );
    }

    for (const file of files) {
      if (!file.name || file.size === 0) continue;

      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          { error: `File "${file.name}" exceeds the 25MB size limit.` },
          { status: 400 }
        );
      }

      // Validate file type
      const ext = file.name.split('.').pop()?.toLowerCase();
      if (!ALLOWED_TYPES.includes(file.type) && !ALLOWED_EXTENSIONS.includes(ext || '')) {
        return NextResponse.json(
          { error: `File "${file.name}" is not an accepted type. Use PDF, JPG, PNG, or DOCX.` },
          { status: 400 }
        );
      }

      // Upload to Vercel Blob
      const timestamp = Date.now();
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
      const pathname = `uploads/${timestamp}-${safeName}`;

      const blob = await put(pathname, file, {
        access: 'public',
        addRandomSuffix: true,
      });

      uploadedFiles.push({
        name: file.name,
        url: blob.url,
        size: file.size,
      });
    }

    // Log the consultant selection for tracking
    await logConsultantSelection(consultant, name, projectType);

    // Build file links HTML
    const fileLinksHtml = uploadedFiles.length > 0
      ? uploadedFiles.map(f =>
          `<li style="padding: 4px 0;">
            <a href="${f.url}" style="color: #6B7B5E;">${f.name}</a>
            <span style="color: #999; font-size: 12px;"> (${(f.size / 1024 / 1024).toFixed(1)} MB)</span>
          </li>`
        ).join('')
      : '<li style="padding: 4px 0; color: #999;">No files uploaded</li>';

    // Send notification email
    await sendNotificationEmail({
      subject: `New Plan Upload from ${name} — Consultant: ${consultant}`,
      replyTo: email,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #2D2D2D; color: white; padding: 24px;">
            <h1 style="margin: 0; font-size: 20px;">New Plan Upload Submission</h1>
            <p style="margin: 8px 0 0; color: #C4B5A0; font-size: 14px;">Preliminary Cost Review Request</p>
          </div>

          <div style="background: #B8976A; color: white; padding: 16px 24px;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="font-weight: bold; font-size: 14px; vertical-align: middle;">ASSIGNED CONSULTANT:</td>
                <td style="font-size: 18px; font-weight: bold; text-align: right; vertical-align: middle;">${consultant}</td>
              </tr>
            </table>
          </div>

          <div style="padding: 24px; border: 1px solid #eee;">
            <h2 style="font-size: 16px; margin: 0 0 16px; color: #2D2D2D;">Contact Information</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 6px 0; font-weight: bold; width: 140px; vertical-align: top;">Name:</td>
                <td style="padding: 6px 0;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; font-weight: bold; vertical-align: top;">Email:</td>
                <td style="padding: 6px 0;"><a href="mailto:${email}">${email}</a></td>
              </tr>
              <tr>
                <td style="padding: 6px 0; font-weight: bold; vertical-align: top;">Phone:</td>
                <td style="padding: 6px 0;">${phone || 'Not provided'}</td>
              </tr>
            </table>

            <hr style="border: none; border-top: 1px solid #eee; margin: 16px 0;" />

            <h2 style="font-size: 16px; margin: 0 0 16px; color: #2D2D2D;">Project Details</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 6px 0; font-weight: bold; width: 140px; vertical-align: top;">Location:</td>
                <td style="padding: 6px 0;">${location}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; font-weight: bold; vertical-align: top;">Project Type:</td>
                <td style="padding: 6px 0;">${projectType}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; font-weight: bold; vertical-align: top;">Square Footage:</td>
                <td style="padding: 6px 0;">${squareFootage || 'Not specified'}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; font-weight: bold; vertical-align: top;">Description:</td>
                <td style="padding: 6px 0; white-space: pre-wrap;">${description}</td>
              </tr>
            </table>

            <hr style="border: none; border-top: 1px solid #eee; margin: 16px 0;" />

            <h2 style="font-size: 16px; margin: 0 0 12px; color: #2D2D2D;">Uploaded Files</h2>
            <ul style="margin: 0; padding: 0 0 0 20px;">
              ${fileLinksHtml}
            </ul>
          </div>
          <div style="padding: 16px 24px; background: #f5f5f5; font-size: 12px; color: #888;">
            This submission was received through the Akers Development plan upload form.
            Reply directly to this email to respond to the client.
          </div>
        </div>
      `,
    });

    return NextResponse.json({
      success: true,
      filesUploaded: uploadedFiles.length,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to process submission. Please try again.' },
      { status: 500 }
    );
  }
}
