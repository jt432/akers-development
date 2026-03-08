import { NextRequest, NextResponse } from 'next/server';
import { sendNotificationEmail } from '@/lib/email';

// Simple in-memory rate limiting
const submissions = new Map<string, number>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_SUBMISSIONS = 3;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const last = submissions.get(ip) || 0;
  if (now - last < RATE_LIMIT_WINDOW) {
    return true;
  }
  submissions.set(ip, now);
  // Clean old entries
  for (const [key, time] of submissions) {
    if (now - time > RATE_LIMIT_WINDOW * 10) submissions.delete(key);
  }
  return false;
}

export async function POST(req: NextRequest) {
  try {
    // Rate limiting
    const ip = req.headers.get('x-forwarded-for') || 'unknown';
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: 'Too many submissions. Please wait a moment and try again.' },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { name, email, phone, description } = body;

    // Validation
    if (!name || !email || !description) {
      return NextResponse.json(
        { error: 'Name, email, and project description are required.' },
        { status: 400 }
      );
    }

    // Basic email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: 'Please provide a valid email address.' },
        { status: 400 }
      );
    }

    // Honeypot / basic spam check
    if (description.length > 5000) {
      return NextResponse.json(
        { error: 'Description too long.' },
        { status: 400 }
      );
    }

    // Send notification email
    await sendNotificationEmail({
      subject: `New Contact Inquiry from ${name}`,
      replyTo: email,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #2D2D2D; color: white; padding: 24px;">
            <h1 style="margin: 0; font-size: 20px;">New Contact Inquiry</h1>
            <p style="margin: 8px 0 0; color: #C4B5A0; font-size: 14px;">akers-development.com</p>
          </div>
          <div style="padding: 24px; border: 1px solid #eee;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; font-weight: bold; width: 120px; vertical-align: top;">Name:</td>
                <td style="padding: 8px 0;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold; vertical-align: top;">Email:</td>
                <td style="padding: 8px 0;"><a href="mailto:${email}">${email}</a></td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold; vertical-align: top;">Phone:</td>
                <td style="padding: 8px 0;">${phone || 'Not provided'}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold; vertical-align: top;">Message:</td>
                <td style="padding: 8px 0; white-space: pre-wrap;">${description}</td>
              </tr>
            </table>
          </div>
          <div style="padding: 16px 24px; background: #f5f5f5; font-size: 12px; color: #888;">
            This inquiry was submitted through the Akers Development website contact form.
          </div>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Failed to send message. Please try again.' },
      { status: 500 }
    );
  }
}
