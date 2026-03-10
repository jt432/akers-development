import { NextRequest, NextResponse } from 'next/server';
import { sendNotificationEmail } from '@/lib/email';

// Rate limiting
const submissions = new Map<string, number>();
function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const last = submissions.get(ip) || 0;
  if (now - last < 60_000) return true;
  submissions.set(ip, now);
  for (const [key, time] of submissions) {
    if (now - time > 600_000) submissions.delete(key);
  }
  return false;
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

    const body = await req.json();
    const { name, email, phone, serviceType, propertyType, squareFootage, location, details } = body;

    if (!name || !email || !serviceType || !location) {
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

    await sendNotificationEmail({
      subject: `APC Quote Request from ${name} — ${serviceType}`,
      replyTo: email,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #2D2D2D; color: white; padding: 24px;">
            <h1 style="margin: 0; font-size: 20px;">New Quote Request</h1>
            <p style="margin: 8px 0 0; color: #C4B5A0; font-size: 14px;">Akers Property Care</p>
          </div>

          <div style="background: #6B7B5E; color: white; padding: 16px 24px;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="font-weight: bold; font-size: 14px;">SERVICE TYPE:</td>
                <td style="font-size: 18px; font-weight: bold; text-align: right;">${serviceType}</td>
              </tr>
            </table>
          </div>

          <div style="padding: 24px; border: 1px solid #eee;">
            <h2 style="font-size: 16px; margin: 0 0 16px; color: #2D2D2D;">Contact Information</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 6px 0; font-weight: bold; width: 140px;">Name:</td>
                <td style="padding: 6px 0;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; font-weight: bold;">Email:</td>
                <td style="padding: 6px 0;"><a href="mailto:${email}">${email}</a></td>
              </tr>
              <tr>
                <td style="padding: 6px 0; font-weight: bold;">Phone:</td>
                <td style="padding: 6px 0;">${phone || 'Not provided'}</td>
              </tr>
            </table>

            <hr style="border: none; border-top: 1px solid #eee; margin: 16px 0;" />

            <h2 style="font-size: 16px; margin: 0 0 16px; color: #2D2D2D;">Property Details</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 6px 0; font-weight: bold; width: 140px;">Property Type:</td>
                <td style="padding: 6px 0;">${propertyType || 'Not specified'}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; font-weight: bold;">Square Footage:</td>
                <td style="padding: 6px 0;">${squareFootage || 'Not specified'}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; font-weight: bold;">Location:</td>
                <td style="padding: 6px 0;">${location}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; font-weight: bold; vertical-align: top;">Details:</td>
                <td style="padding: 6px 0; white-space: pre-wrap;">${details || 'None provided'}</td>
              </tr>
            </table>
          </div>
          <div style="padding: 16px 24px; background: #f5f5f5; font-size: 12px; color: #888;">
            This quote request was submitted through the Akers Property Care page.
          </div>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('APC quote error:', error);
    return NextResponse.json(
      { error: 'Failed to submit quote request. Please try again.' },
      { status: 500 }
    );
  }
}
