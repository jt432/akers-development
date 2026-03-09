import { NextRequest, NextResponse } from 'next/server';
import { calculateEstimate, type ProjectInput } from '@/lib/pricing';

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get('content-type') || '';

    // ── Mode 1: Direct calculation from user-provided specs (JSON body) ──
    if (contentType.includes('application/json')) {
      const body = await req.json();
      const input: ProjectInput = {
        projectName: body.projectName || 'Project Estimate',
        heatedSqFt: parseInt(body.heatedSqFt) || 2000,
        shopSqFt: parseInt(body.shopSqFt) || 0,
        carportSqFt: parseInt(body.carportSqFt) || 0,
        porchSqFt: parseInt(body.porchSqFt) || 0,
        numBathrooms: parseInt(body.numBathrooms) || 2,
        numBedrooms: parseInt(body.numBedrooms) || 3,
        stories: body.stories === 2 ? 2 : 1,
        roofType: body.roofType || 'metal',
        sidingType: body.sidingType || 'metal',
        foundationType: body.foundationType || 'slab',
        includeHVAC: body.includeHVAC !== false,
        includeSeptic: body.includeSeptic !== false,
        includeShopElectrical: body.includeShopElectrical === true,
        flooringType: body.flooringType || 'standard',
        cabinetGrade: body.cabinetGrade || 'budget',
      };

      const estimate = calculateEstimate(input);
      return NextResponse.json({ success: true, estimate, input, mode: 'manual' });
    }

    // ── Mode 2: File upload — always show manual specs form ──
    // Architectural plans are typically image-based CAD drawings with no
    // extractable text, so we skip PDF parsing and let the user enter specs.
    return NextResponse.json({
      success: true,
      needsManualInput: true,
      message: 'Please enter your project specs below for an instant cost estimate.',
    });
  } catch (error) {
    console.error('Plan analysis error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze plans. Please try again.' },
      { status: 500 }
    );
  }
}
