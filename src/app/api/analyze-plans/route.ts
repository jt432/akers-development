import { NextRequest, NextResponse } from 'next/server';
import { analyzePlans } from '@/lib/plan-analyzer';
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

    // ── Mode 2: PDF analysis (multipart form data) ──
    const formData = await req.formData();
    const files = formData.getAll('files') as File[];
    const projectName = (formData.get('projectName') as string) || 'Untitled Project';

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: 'No files provided for analysis.' },
        { status: 400 }
      );
    }

    // Extract text from each PDF
    const pdfTexts: { filename: string; text: string }[] = [];

    for (const file of files) {
      const ext = file.name.split('.').pop()?.toLowerCase();
      if (ext !== 'pdf') continue;

      try {
        const buffer = Buffer.from(await file.arrayBuffer());
        const pdfParse = (await import('pdf-parse')).default;
        const data = await pdfParse(buffer);
        pdfTexts.push({
          filename: file.name,
          text: data.text || '',
        });
      } catch (pdfErr) {
        console.error(`Failed to parse ${file.name}:`, pdfErr);
        pdfTexts.push({ filename: file.name, text: '' });
      }
    }

    if (pdfTexts.length === 0) {
      return NextResponse.json(
        { error: 'No PDF files found to analyze. Please upload PDF building plans.' },
        { status: 400 }
      );
    }

    // Check if we got any extractable text
    const totalText = pdfTexts.reduce((sum, p) => sum + p.text.length, 0);

    if (totalText < 50) {
      // Image-based PDFs — can't extract text, need manual input
      return NextResponse.json({
        success: true,
        needsManualInput: true,
        message: 'Your plans appear to be image-based drawings. Please enter your project specs below for an instant estimate.',
        pdfCount: pdfTexts.length,
      });
    }

    // Text-based PDFs — run the analyzer
    const specs = analyzePlans(pdfTexts);
    if (projectName !== 'Untitled Project') {
      specs.projectName = projectName;
    }

    const estimateInput: ProjectInput = {
      projectName: specs.projectName,
      heatedSqFt: specs.heatedSqFt || 2000,
      shopSqFt: specs.shopSqFt || 0,
      carportSqFt: specs.carportSqFt || 0,
      porchSqFt: specs.porchSqFt || 0,
      numBathrooms: specs.numBathrooms || 2,
      numBedrooms: specs.numBedrooms || 3,
      stories: specs.stories || 1,
      roofType: specs.roofType || 'metal',
      sidingType: specs.sidingType || 'metal',
      foundationType: specs.foundationType || 'slab',
      includeHVAC: specs.hasHVAC || true,
      includeSeptic: specs.hasSeptic || true,
      includeShopElectrical: specs.hasShopElectrical,
      flooringType: 'standard',
      cabinetGrade: 'budget',
    };

    const estimate = calculateEstimate(estimateInput);

    return NextResponse.json({
      success: true,
      needsManualInput: false,
      specs,
      estimate,
      input: estimateInput,
      mode: 'auto',
      pdfCount: pdfTexts.length,
    });
  } catch (error) {
    console.error('Plan analysis error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze plans. Please try again.' },
      { status: 500 }
    );
  }
}
