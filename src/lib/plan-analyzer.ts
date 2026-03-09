// ─── Plan Analyzer ───
// Extracts construction specs from uploaded PDF text content.
// Looks for area tables, room counts, material callouts, schedules, etc.

export interface ExtractedSpecs {
  projectName: string;
  heatedSqFt: number | null;
  shopSqFt: number | null;
  carportSqFt: number | null;
  porchSqFt: number | null;
  numBedrooms: number | null;
  numBathrooms: number | null;
  stories: 1 | 2 | null;
  roofType: 'metal' | 'shingle' | null;
  sidingType: 'metal' | 'vinyl' | 'brick' | null;
  foundationType: 'slab' | 'crawlspace' | null;
  hasHVAC: boolean;
  hasSeptic: boolean;
  hasShopElectrical: boolean;
  confidence: Record<string, 'extracted' | 'estimated' | 'default'>;
  rawFindings: string[];
}

// Combine all PDF texts into one analysis
export function analyzePlans(pdfTexts: { filename: string; text: string }[]): ExtractedSpecs {
  const allText = pdfTexts.map(p => p.text).join('\n\n');
  const allTextLower = allText.toLowerCase();
  const findings: string[] = [];
  const confidence: Record<string, 'extracted' | 'estimated' | 'default'> = {};

  // ─── Project Name ───
  let projectName = 'Untitled Project';
  // Look for "RESIDENCE", "HOME", or project title patterns
  const namePatterns = [
    /(?:the\s+)?(\w+(?:\s+\w+)?)\s+residence/i,
    /(?:project|home|house)[:\s]+([A-Z][a-zA-Z\s]+?)(?:\n|$)/,
    /(?:for|owner)[:\s]+([A-Z][a-zA-Z\s]+?)(?:\n|$)/,
  ];
  for (const pat of namePatterns) {
    const m = allText.match(pat);
    if (m) {
      projectName = m[1].trim() + ' Residence';
      findings.push(`Found project name: "${projectName}"`);
      break;
    }
  }

  // ─── Square Footage — Area Table ───
  let heatedSqFt: number | null = null;
  let shopSqFt: number | null = null;
  let carportSqFt: number | null = null;
  let porchSqFt: number | null = null;

  // Pattern: "HEATED AREA" followed by a number
  const areaPatterns: [RegExp, string][] = [
    [/heated\s*(?:area|space|sq\.?\s*ft\.?|living)[:\s]*(\d[\d,]*)/i, 'heated'],
    [/(?:shop|garage|workshop)\s*(?:area|space|sq\.?\s*ft\.?)?[:\s]*(\d[\d,]*)/i, 'shop'],
    [/carport\s*(?:area|space|sq\.?\s*ft\.?)?[:\s]*(\d[\d,]*)/i, 'carport'],
    [/porch\s*(?:area|space|sq\.?\s*ft\.?)?[:\s]*(\d[\d,]*)/i, 'porch'],
  ];

  for (const [pat, type] of areaPatterns) {
    const m = allText.match(pat);
    if (m) {
      const val = parseInt(m[1].replace(/,/g, ''));
      if (val > 0 && val < 50000) {
        switch (type) {
          case 'heated': heatedSqFt = val; break;
          case 'shop': shopSqFt = val; break;
          case 'carport': carportSqFt = val; break;
          case 'porch': porchSqFt = val; break;
        }
        findings.push(`Found ${type} area: ${val.toLocaleString()} sq ft`);
        confidence[`${type}SqFt`] = 'extracted';
      }
    }
  }

  // Also look for total sq ft patterns like "2,400 SF" or "2400 SQFT"
  if (!heatedSqFt) {
    const totalMatch = allText.match(/(\d[\d,]*)\s*(?:sf|sq\.?\s*ft\.?|square\s*feet?)(?:\s*(?:heated|living|conditioned))?/i);
    if (totalMatch) {
      const val = parseInt(totalMatch[1].replace(/,/g, ''));
      if (val >= 500 && val <= 20000) {
        heatedSqFt = val;
        findings.push(`Found total area: ${val.toLocaleString()} sq ft (assumed heated)`);
        confidence.heatedSqFt = 'estimated';
      }
    }
  }

  // ─── Room Count ───
  let numBedrooms: number | null = null;
  let numBathrooms: number | null = null;

  // Count bedroom labels in floor plan text
  const bedroomMatches = allText.match(/\b(?:bed(?:room)?|br|bdrm)\s*\.?\s*#?\s*\d?/gi);
  if (bedroomMatches) {
    // Deduplicate (same label might appear in multiple PDFs)
    const unique = new Set(bedroomMatches.map(m => m.toLowerCase().trim()));
    numBedrooms = unique.size;
    findings.push(`Found ${numBedrooms} bedroom(s) labeled in plans`);
    confidence.numBedrooms = 'extracted';
  }

  // Also check for "X BEDROOM" or "X BR" pattern
  if (!numBedrooms) {
    const brMatch = allText.match(/(\d)\s*(?:bedroom|br|bed)/i);
    if (brMatch) {
      numBedrooms = parseInt(brMatch[1]);
      findings.push(`Found ${numBedrooms} bedrooms from text`);
      confidence.numBedrooms = 'extracted';
    }
  }

  // Count bathroom labels
  const bathMatches = allText.match(/\b(?:bath(?:room)?|half\s*bath|powder|full\s*bath)\s*\.?\s*#?\s*\d?/gi);
  if (bathMatches) {
    const unique = new Set(bathMatches.map(m => m.toLowerCase().trim()));
    numBathrooms = unique.size;
    findings.push(`Found ${numBathrooms} bathroom(s) labeled in plans`);
    confidence.numBathrooms = 'extracted';
  }

  if (!numBathrooms) {
    const baMatch = allText.match(/(\d)\s*(?:bathroom|bath|ba)/i);
    if (baMatch) {
      numBathrooms = parseInt(baMatch[1]);
      findings.push(`Found ${numBathrooms} bathrooms from text`);
      confidence.numBathrooms = 'extracted';
    }
  }

  // ─── Stories ───
  let stories: 1 | 2 | null = null;
  if (/(?:2nd\s*(?:floor|level|story)|second\s*(?:floor|level|story)|upper\s*(?:floor|level)|dormer\s*(?:level|detail|floor\s*plan))/i.test(allText)) {
    // Check if it's just a dormer detail vs actual 2nd floor
    if (/2nd\s*(?:floor|level)\s*(?:plan|layout)/i.test(allText)) {
      stories = 2;
      findings.push('Detected 2-story structure from floor plan references');
    } else {
      stories = 1;
      findings.push('Detected single story with dormer/loft');
    }
    confidence.stories = 'extracted';
  }

  // ─── Roof Type ───
  let roofType: 'metal' | 'shingle' | null = null;
  if (/metal\s*(?:roof|roofing|panel)/i.test(allText)) {
    roofType = 'metal';
    findings.push('Found metal roofing callout');
    confidence.roofType = 'extracted';
  } else if (/(?:shingle|asphalt|architectural\s*shingle|dimensional\s*shingle)/i.test(allText)) {
    roofType = 'shingle';
    findings.push('Found shingle roofing callout');
    confidence.roofType = 'extracted';
  }

  // ─── Siding Type ───
  let sidingType: 'metal' | 'vinyl' | 'brick' | null = null;
  if (/metal\s*(?:siding|panel|wall\s*panel)/i.test(allText)) {
    sidingType = 'metal';
    findings.push('Found metal siding callout');
    confidence.sidingType = 'extracted';
  } else if (/vinyl\s*siding/i.test(allText)) {
    sidingType = 'vinyl';
    findings.push('Found vinyl siding callout');
    confidence.sidingType = 'extracted';
  } else if (/brick\s*(?:veneer|exterior|siding)/i.test(allText)) {
    sidingType = 'brick';
    findings.push('Found brick exterior callout');
    confidence.sidingType = 'extracted';
  }

  // ─── Foundation Type ───
  let foundationType: 'slab' | 'crawlspace' | null = null;
  if (/slab\s*(?:on\s*grade|foundation|plan)/i.test(allText) || /monolithic\s*slab/i.test(allText)) {
    foundationType = 'slab';
    findings.push('Found slab foundation from plans');
    confidence.foundationType = 'extracted';
  } else if (/crawl\s*space|pier\s*(?:and|&)\s*beam/i.test(allText)) {
    foundationType = 'crawlspace';
    findings.push('Found crawl space foundation from plans');
    confidence.foundationType = 'extracted';
  } else if (/foundation\s*plan/i.test(allText)) {
    foundationType = 'slab'; // Default assumption for residential
    findings.push('Found foundation plan — assumed slab');
    confidence.foundationType = 'estimated';
  }

  // ─── HVAC ───
  const hasHVAC = /\b(?:hvac|heat\s*pump|air\s*handler|furnace|duct|supply\s*air|return\s*air|thermostat|mini\s*split|condenser)/i.test(allText);
  if (hasHVAC) {
    findings.push('Found HVAC references in plans');
    confidence.hasHVAC = 'extracted';
  }

  // ─── Septic ───
  const hasSeptic = /\b(?:septic|drain\s*field|leach\s*field)/i.test(allText);
  if (hasSeptic) {
    findings.push('Found septic system references');
    confidence.hasSeptic = 'extracted';
  }

  // ─── Shop Electrical ───
  // Check if electrical plan includes shop/garage areas
  const hasShopElectrical = shopSqFt !== null && shopSqFt > 0 &&
    /(?:shop|garage)\s*(?:.*?\s*)?(?:outlet|receptacle|light|switch|panel)/i.test(allText);
  if (hasShopElectrical) {
    findings.push('Found electrical fixtures in shop/garage area');
    confidence.hasShopElectrical = 'extracted';
  }

  // ─── Estimate bedrooms/bathrooms from sq footage if not found ───
  if (!numBedrooms && heatedSqFt) {
    // Rule of thumb: ~400-500 sq ft per bedroom
    numBedrooms = Math.max(2, Math.min(6, Math.round(heatedSqFt / 500)));
    findings.push(`Estimated ${numBedrooms} bedrooms based on ${heatedSqFt} sq ft`);
    confidence.numBedrooms = 'estimated';
  }

  if (!numBathrooms && heatedSqFt) {
    // Rule of thumb: roughly 1 bath per 800 sq ft, min 1
    numBathrooms = Math.max(1, Math.min(5, Math.round(heatedSqFt / 800)));
    findings.push(`Estimated ${numBathrooms} bathrooms based on ${heatedSqFt} sq ft`);
    confidence.numBathrooms = 'estimated';
  }

  return {
    projectName,
    heatedSqFt,
    shopSqFt: shopSqFt || 0,
    carportSqFt: carportSqFt || 0,
    porchSqFt: porchSqFt || 0,
    numBedrooms,
    numBathrooms,
    stories,
    roofType,
    sidingType,
    foundationType,
    hasHVAC,
    hasSeptic,
    hasShopElectrical,
    confidence,
    rawFindings: findings,
  };
}
