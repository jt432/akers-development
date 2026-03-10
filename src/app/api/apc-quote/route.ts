import { NextRequest, NextResponse } from 'next/server';
import { sendNotificationEmail } from '@/lib/email';
import {
  calculatePrice,
  SERVICE_LABELS,
  FREQUENCY_LABELS,
  CONDITION_LABELS,
  type ServiceType,
  type Frequency,
  type Condition,
  type AddOns,
} from '@/lib/apc-pricing';

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
    const {
      // Contact
      name,
      email,
      phone,
      location,
      notes,
      // Pricing
      serviceType,
      sqft,
      bedrooms,
      bathrooms,
      pets,
      occupants,
      condition,
      frequency,
      addOns,
    } = body as {
      name: string;
      email: string;
      phone: string;
      location: string;
      notes: string;
      serviceType: ServiceType;
      sqft: number;
      bedrooms: number;
      bathrooms: number;
      pets: number;
      occupants: number;
      condition: Condition;
      frequency: Frequency;
      addOns: AddOns;
    };

    // Validation
    if (!name || !email || !location || !sqft) {
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

    // Recalculate price server-side (don't trust client)
    const pricing = calculatePrice({
      serviceType,
      sqft,
      bedrooms,
      bathrooms,
      pets,
      occupants,
      condition,
      frequency,
      addOns,
    });

    // Build add-ons list for email
    const addOnsList: string[] = [];
    if (addOns.fridge) addOnsList.push('Inside Fridge ($35)');
    if (addOns.oven) addOnsList.push('Inside Oven ($40)');
    if (addOns.laundry) addOnsList.push('Laundry — Wash/Dry/Fold ($30)');
    if (addOns.windows > 0) addOnsList.push(`Interior Windows x${addOns.windows} ($${addOns.windows * 5})`);
    if (addOns.garage) addOnsList.push('Garage/Carport Sweep ($25)');
    if (addOns.cabinets) addOnsList.push('Cabinet Interior Wipe-Down ($50)');

    const serviceLabel = SERVICE_LABELS[serviceType];
    const frequencyLabel = FREQUENCY_LABELS[frequency];
    const conditionLabel = CONDITION_LABELS[condition];

    await sendNotificationEmail({
      subject: `APC Work Order — ${serviceLabel} — $${pricing.total.toFixed(2)} (${frequencyLabel})`,
      replyTo: email,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #2D2D2D; color: white; padding: 24px;">
            <h1 style="margin: 0; font-size: 20px;">New Work Order</h1>
            <p style="margin: 8px 0 0; color: #C4B5A0; font-size: 14px;">Akers Property Care</p>
          </div>

          <!-- Price & Service Header -->
          <div style="background: #6B7B5E; color: white; padding: 20px 24px;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="font-size: 14px;">${serviceLabel}</td>
                <td style="font-size: 28px; font-weight: bold; text-align: right;">$${pricing.total.toFixed(2)}</td>
              </tr>
              <tr>
                <td style="font-size: 13px; color: #d4e0cc;">${frequencyLabel} service</td>
                <td style="font-size: 13px; color: #d4e0cc; text-align: right;">per visit</td>
              </tr>
            </table>
          </div>

          <div style="padding: 24px; border: 1px solid #eee;">
            <!-- Duration & Schedule -->
            <div style="background: #f9f7f4; padding: 16px; margin-bottom: 20px;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="text-align: center; padding: 8px;">
                    <div style="font-size: 22px; font-weight: bold; color: #2D2D2D;">${pricing.estimatedHours.toFixed(1)}</div>
                    <div style="font-size: 11px; color: #888; text-transform: uppercase;">Est. Hours</div>
                  </td>
                  <td style="text-align: center; padding: 8px; border-left: 1px solid #ddd;">
                    <div style="font-size: 22px; font-weight: bold; color: #2D2D2D;">${sqft.toLocaleString()}</div>
                    <div style="font-size: 11px; color: #888; text-transform: uppercase;">Sq Ft</div>
                  </td>
                  <td style="text-align: center; padding: 8px; border-left: 1px solid #ddd;">
                    <div style="font-size: 22px; font-weight: bold; color: #2D2D2D;">${frequencyLabel}</div>
                    <div style="font-size: 11px; color: #888; text-transform: uppercase;">Schedule</div>
                  </td>
                </tr>
              </table>
            </div>

            <!-- Contact Info -->
            <h2 style="font-size: 14px; margin: 0 0 12px; color: #2D2D2D; text-transform: uppercase; letter-spacing: 1px;">Contact</h2>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
              <tr>
                <td style="padding: 5px 0; font-weight: bold; width: 120px; font-size: 13px;">Name:</td>
                <td style="padding: 5px 0; font-size: 13px;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 5px 0; font-weight: bold; font-size: 13px;">Email:</td>
                <td style="padding: 5px 0; font-size: 13px;"><a href="mailto:${email}">${email}</a></td>
              </tr>
              <tr>
                <td style="padding: 5px 0; font-weight: bold; font-size: 13px;">Phone:</td>
                <td style="padding: 5px 0; font-size: 13px;">${phone || 'Not provided'}</td>
              </tr>
              <tr>
                <td style="padding: 5px 0; font-weight: bold; font-size: 13px;">Location:</td>
                <td style="padding: 5px 0; font-size: 13px;">${location}</td>
              </tr>
            </table>

            <hr style="border: none; border-top: 1px solid #eee; margin: 16px 0;" />

            <!-- Property Details -->
            <h2 style="font-size: 14px; margin: 0 0 12px; color: #2D2D2D; text-transform: uppercase; letter-spacing: 1px;">Property</h2>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
              <tr>
                <td style="padding: 5px 0; font-weight: bold; width: 120px; font-size: 13px;">Square Feet:</td>
                <td style="padding: 5px 0; font-size: 13px;">${sqft.toLocaleString()}</td>
              </tr>
              <tr>
                <td style="padding: 5px 0; font-weight: bold; font-size: 13px;">Bedrooms:</td>
                <td style="padding: 5px 0; font-size: 13px;">${bedrooms}</td>
              </tr>
              <tr>
                <td style="padding: 5px 0; font-weight: bold; font-size: 13px;">Bathrooms:</td>
                <td style="padding: 5px 0; font-size: 13px;">${bathrooms}</td>
              </tr>
              <tr>
                <td style="padding: 5px 0; font-weight: bold; font-size: 13px;">Occupants:</td>
                <td style="padding: 5px 0; font-size: 13px;">${occupants}</td>
              </tr>
              <tr>
                <td style="padding: 5px 0; font-weight: bold; font-size: 13px;">Pets:</td>
                <td style="padding: 5px 0; font-size: 13px;">${pets}</td>
              </tr>
              <tr>
                <td style="padding: 5px 0; font-weight: bold; font-size: 13px;">Condition:</td>
                <td style="padding: 5px 0; font-size: 13px;">${condition}/5 — ${conditionLabel}</td>
              </tr>
            </table>

            ${addOnsList.length > 0 ? `
              <hr style="border: none; border-top: 1px solid #eee; margin: 16px 0;" />
              <h2 style="font-size: 14px; margin: 0 0 12px; color: #2D2D2D; text-transform: uppercase; letter-spacing: 1px;">Add-Ons</h2>
              <ul style="margin: 0; padding-left: 20px; font-size: 13px; color: #333;">
                ${addOnsList.map((a) => `<li style="padding: 3px 0;">${a}</li>`).join('')}
              </ul>
            ` : ''}

            <hr style="border: none; border-top: 1px solid #eee; margin: 16px 0;" />

            <!-- Price Breakdown -->
            <h2 style="font-size: 14px; margin: 0 0 12px; color: #2D2D2D; text-transform: uppercase; letter-spacing: 1px;">Price Breakdown</h2>
            <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
              <tr>
                <td style="padding: 5px 0;">Base (${serviceLabel})</td>
                <td style="padding: 5px 0; text-align: right;">$${pricing.basePrice.toFixed(2)}</td>
              </tr>
              ${pricing.adjusterTotal > 0 ? `
              <tr>
                <td style="padding: 5px 0;">Property adjustments</td>
                <td style="padding: 5px 0; text-align: right;">+$${pricing.adjusterTotal.toFixed(2)}</td>
              </tr>
              ` : ''}
              ${pricing.addOnTotal > 0 ? `
              <tr>
                <td style="padding: 5px 0;">Add-ons</td>
                <td style="padding: 5px 0; text-align: right;">+$${pricing.addOnTotal.toFixed(2)}</td>
              </tr>
              ` : ''}
              ${pricing.discountAmount > 0 ? `
              <tr style="color: #6B7B5E;">
                <td style="padding: 5px 0;">${frequencyLabel} discount (${(pricing.discountPercent * 100).toFixed(0)}%)</td>
                <td style="padding: 5px 0; text-align: right;">-$${pricing.discountAmount.toFixed(2)}</td>
              </tr>
              ` : ''}
              <tr style="border-top: 2px solid #2D2D2D;">
                <td style="padding: 10px 0; font-weight: bold; font-size: 16px;">Total per visit</td>
                <td style="padding: 10px 0; text-align: right; font-weight: bold; font-size: 16px;">$${pricing.total.toFixed(2)}</td>
              </tr>
            </table>

            ${notes ? `
              <hr style="border: none; border-top: 1px solid #eee; margin: 16px 0;" />
              <h2 style="font-size: 14px; margin: 0 0 8px; color: #2D2D2D; text-transform: uppercase; letter-spacing: 1px;">Notes</h2>
              <p style="font-size: 13px; color: #555; white-space: pre-wrap; margin: 0;">${notes}</p>
            ` : ''}
          </div>

          <div style="padding: 16px 24px; background: #f5f5f5; font-size: 12px; color: #888;">
            This work order was submitted through the Akers Property Care pricing calculator.
          </div>
        </div>
      `,
    });

    return NextResponse.json({ success: true, total: pricing.total });
  } catch (error) {
    console.error('APC work order error:', error);
    return NextResponse.json(
      { error: 'Failed to submit work order. Please try again.' },
      { status: 500 }
    );
  }
}
