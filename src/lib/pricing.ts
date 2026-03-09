// ─── Akers Development Cost Estimator Pricing Engine ───
// Rates derived from McAdams Residence baseline (2,400 sq ft heated)
// All rates can be adjusted as pricing changes

export interface ProjectInput {
  projectName: string;
  heatedSqFt: number;
  shopSqFt: number;
  carportSqFt: number;
  porchSqFt: number;
  numBathrooms: number;
  numBedrooms: number;
  stories: 1 | 2;
  roofType: 'metal' | 'shingle';
  sidingType: 'metal' | 'vinyl' | 'brick';
  foundationType: 'slab' | 'crawlspace';
  includeHVAC: boolean;
  includeSeptic: boolean;
  includeShopElectrical: boolean;
  flooringType: 'standard' | 'upgraded' | 'premium';
  cabinetGrade: 'budget' | 'mid' | 'premium';
}

export interface LineItem {
  category: string;
  description: string;
  cost: number;
  basis: string; // e.g. "2,400 sq ft × $10.08"
}

export interface Estimate {
  projectName: string;
  lineItems: LineItem[];
  subtotal: number;
  consultingFee: number;
  totalCost: number;
  costPerHeatedSqFt: number;
  specs: {
    heatedSqFt: number;
    totalSqFt: number;
    shopSqFt: number;
    carportSqFt: number;
    porchSqFt: number;
  };
}

// ─── BASE RATES ───
// These are derived from the McAdams Residence (2,400 heated sq ft)
// Adjust these numbers to update all future estimates

const RATES = {
  // Concrete — scales with total footprint (foundation goes under everything)
  concreteLaborPerSqFt: 4.23,     // $24,200 / 5,715 total sq ft
  concreteMaterialPerSqFt: 2.80,  // $16,000 / 5,715 total sq ft

  // Framing — scales mainly with enclosed area (heated + shop)
  framingPerEnclosedSqFt: 11.30,  // Calibrated to McAdams baseline
  framingPerOpenSqFt: 2.40,       // Reduced rate for carport/porch framing

  // General materials (lumber, sheathing, hardware, windows, doors, etc.)
  materialsPerEnclosedSqFt: 28.00, // Calibrated to McAdams baseline
  materialsPerOpenSqFt: 6.50,      // Reduced rate for carport/porch materials

  // Drywall — heated area only
  drywallPerSqFt: 6.00,           // $14,400 / 2,400

  // Insulation — heated area only
  insulationPerSqFt: 2.92,        // $7,000 / 2,400

  // Electrical — heated + shop
  electricalPerEnclosedSqFt: 6.47, // $22,000 / 3,400

  // HVAC — heated area only
  hvacPerSqFt: 7.50,              // $18,000 / 2,400

  // Roofing — scales with total footprint (roof covers everything)
  roofingMetalPerSqFt: 2.59,      // $14,800 / 5,715
  roofingShinglePerSqFt: 2.10,    // Shingle typically ~20% less

  // Siding — scales with enclosed perimeter (approximated from sq footage)
  sidingMetalPerEnclosedSqFt: 4.56, // $15,500 / 3,400
  sidingVinylPerEnclosedSqFt: 3.80, // Vinyl ~17% less
  sidingBrickPerEnclosedSqFt: 9.00, // Brick roughly double metal

  // Trim (baseboards, window/door casings) — heated area
  trimPerSqFt: 2.67,              // $6,400 / 2,400

  // Flooring — heated area
  flooringStandardPerSqFt: 1.67,  // $4,000 / 2,400
  flooringUpgradedPerSqFt: 3.50,  // LVP / mid-grade
  flooringPremiumPerSqFt: 6.00,   // Hardwood / tile

  // Plumbing fixtures — per bathroom + kitchen base
  plumbingPerBathroom: 2125.00,   // $8,500 / 4 (assumes ~3 bath + kitchen)
  plumbingBaseKitchen: 2125.00,   // Base kitchen plumbing allowance

  // Cabinets & countertops
  cabinetsBudget: 15000,          // Budget allowance
  cabinetsMid: 22000,
  cabinetsPremium: 35000,

  // Septic system — fixed cost
  septicSystem: 10000,

  // Consulting fee — fixed per project
  consultingFee: 45000,

  // Story multiplier (2-story adds complexity)
  twoStoryMultiplier: 1.15,       // 15% increase for 2-story framing/materials
};

export function calculateEstimate(input: ProjectInput): Estimate {
  const totalSqFt = input.heatedSqFt + input.shopSqFt + input.carportSqFt + input.porchSqFt;
  const enclosedSqFt = input.heatedSqFt + input.shopSqFt;
  const openSqFt = input.carportSqFt + input.porchSqFt;
  const storyFactor = input.stories === 2 ? RATES.twoStoryMultiplier : 1;

  const lineItems: LineItem[] = [];

  // ── Concrete ──
  const concreteLab = totalSqFt * RATES.concreteLaborPerSqFt;
  lineItems.push({
    category: 'Foundation',
    description: 'Concrete Pouring & Finishing (Labor)',
    cost: Math.round(concreteLab),
    basis: `${totalSqFt.toLocaleString()} sq ft × $${RATES.concreteLaborPerSqFt}/sq ft`,
  });

  const concreteMat = totalSqFt * RATES.concreteMaterialPerSqFt;
  lineItems.push({
    category: 'Foundation',
    description: 'Concrete Materials',
    cost: Math.round(concreteMat),
    basis: `${totalSqFt.toLocaleString()} sq ft × $${RATES.concreteMaterialPerSqFt}/sq ft`,
  });

  // ── Framing ──
  const framingEnclosed = enclosedSqFt * RATES.framingPerEnclosedSqFt * storyFactor;
  const framingOpen = openSqFt * RATES.framingPerOpenSqFt;
  const framingTotal = framingEnclosed + framingOpen;
  lineItems.push({
    category: 'Structure',
    description: 'Framing',
    cost: Math.round(framingTotal),
    basis: `${enclosedSqFt.toLocaleString()} enclosed × $${RATES.framingPerEnclosedSqFt} + ${openSqFt.toLocaleString()} open × $${RATES.framingPerOpenSqFt}${input.stories === 2 ? ' (2-story +15%)' : ''}`,
  });

  // ── General Materials ──
  const matEnclosed = enclosedSqFt * RATES.materialsPerEnclosedSqFt * storyFactor;
  const matOpen = openSqFt * RATES.materialsPerOpenSqFt;
  const materialsTotal = matEnclosed + matOpen;
  lineItems.push({
    category: 'Structure',
    description: 'General Materials (lumber, sheathing, hardware, windows, doors)',
    cost: Math.round(materialsTotal),
    basis: `${enclosedSqFt.toLocaleString()} enclosed × $${RATES.materialsPerEnclosedSqFt} + ${openSqFt.toLocaleString()} open × $${RATES.materialsPerOpenSqFt}${input.stories === 2 ? ' (2-story +15%)' : ''}`,
  });

  // ── Roofing ──
  const roofRate = input.roofType === 'metal' ? RATES.roofingMetalPerSqFt : RATES.roofingShinglePerSqFt;
  const roofingCost = totalSqFt * roofRate;
  lineItems.push({
    category: 'Exterior',
    description: `Roofing (${input.roofType === 'metal' ? 'Metal' : 'Shingle'})`,
    cost: Math.round(roofingCost),
    basis: `${totalSqFt.toLocaleString()} sq ft × $${roofRate}/sq ft`,
  });

  // ── Siding ──
  const sidingRateMap = {
    metal: RATES.sidingMetalPerEnclosedSqFt,
    vinyl: RATES.sidingVinylPerEnclosedSqFt,
    brick: RATES.sidingBrickPerEnclosedSqFt,
  };
  const sidingRate = sidingRateMap[input.sidingType];
  const sidingCost = enclosedSqFt * sidingRate * storyFactor;
  const sidingLabel = input.sidingType.charAt(0).toUpperCase() + input.sidingType.slice(1);
  lineItems.push({
    category: 'Exterior',
    description: `Siding (${sidingLabel})`,
    cost: Math.round(sidingCost),
    basis: `${enclosedSqFt.toLocaleString()} enclosed sq ft × $${sidingRate}/sq ft${input.stories === 2 ? ' (2-story +15%)' : ''}`,
  });

  // ── Drywall ──
  const drywallCost = input.heatedSqFt * RATES.drywallPerSqFt * storyFactor;
  lineItems.push({
    category: 'Interior',
    description: 'Drywall (hang, tape & finish)',
    cost: Math.round(drywallCost),
    basis: `${input.heatedSqFt.toLocaleString()} heated sq ft × $${RATES.drywallPerSqFt}/sq ft${input.stories === 2 ? ' (2-story +15%)' : ''}`,
  });

  // ── Insulation ──
  const insulationCost = input.heatedSqFt * RATES.insulationPerSqFt;
  lineItems.push({
    category: 'Interior',
    description: 'Insulation',
    cost: Math.round(insulationCost),
    basis: `${input.heatedSqFt.toLocaleString()} heated sq ft × $${RATES.insulationPerSqFt}/sq ft`,
  });

  // ── Electrical ──
  const elecSqFt = input.includeShopElectrical ? enclosedSqFt : input.heatedSqFt;
  const electricalCost = elecSqFt * RATES.electricalPerEnclosedSqFt;
  lineItems.push({
    category: 'Mechanical',
    description: `Electrical${input.includeShopElectrical ? ' (incl. shop)' : ''}`,
    cost: Math.round(electricalCost),
    basis: `${elecSqFt.toLocaleString()} sq ft × $${RATES.electricalPerEnclosedSqFt}/sq ft`,
  });

  // ── HVAC ──
  if (input.includeHVAC) {
    const hvacCost = input.heatedSqFt * RATES.hvacPerSqFt;
    lineItems.push({
      category: 'Mechanical',
      description: 'HVAC System',
      cost: Math.round(hvacCost),
      basis: `${input.heatedSqFt.toLocaleString()} heated sq ft × $${RATES.hvacPerSqFt}/sq ft`,
    });
  }

  // ── Plumbing ──
  const plumbingCost = (input.numBathrooms * RATES.plumbingPerBathroom) + RATES.plumbingBaseKitchen;
  lineItems.push({
    category: 'Mechanical',
    description: 'Plumbing Fixtures & Rough-in',
    cost: Math.round(plumbingCost),
    basis: `${input.numBathrooms} bathrooms × $${RATES.plumbingPerBathroom.toLocaleString()} + kitchen`,
  });

  // ── Trim ──
  const trimCost = input.heatedSqFt * RATES.trimPerSqFt;
  lineItems.push({
    category: 'Interior',
    description: 'Trim (baseboards, window & door casings)',
    cost: Math.round(trimCost),
    basis: `${input.heatedSqFt.toLocaleString()} heated sq ft × $${RATES.trimPerSqFt}/sq ft`,
  });

  // ── Flooring ──
  const flooringRateMap = {
    standard: RATES.flooringStandardPerSqFt,
    upgraded: RATES.flooringUpgradedPerSqFt,
    premium: RATES.flooringPremiumPerSqFt,
  };
  const floorRate = flooringRateMap[input.flooringType];
  const flooringCost = input.heatedSqFt * floorRate;
  const floorLabel = input.flooringType.charAt(0).toUpperCase() + input.flooringType.slice(1);
  lineItems.push({
    category: 'Interior',
    description: `Flooring (${floorLabel})`,
    cost: Math.round(flooringCost),
    basis: `${input.heatedSqFt.toLocaleString()} heated sq ft × $${floorRate}/sq ft`,
  });

  // ── Cabinets & Countertops ──
  const cabinetCostMap = {
    budget: RATES.cabinetsBudget,
    mid: RATES.cabinetsMid,
    premium: RATES.cabinetsPremium,
  };
  const cabinetCost = cabinetCostMap[input.cabinetGrade];
  const cabinetLabel = input.cabinetGrade.charAt(0).toUpperCase() + input.cabinetGrade.slice(1);
  lineItems.push({
    category: 'Interior',
    description: `Cabinets & Countertops (${cabinetLabel})`,
    cost: cabinetCost,
    basis: `${cabinetLabel} grade allowance`,
  });

  // ── Septic ──
  if (input.includeSeptic) {
    lineItems.push({
      category: 'Site Work',
      description: 'Septic System',
      cost: RATES.septicSystem,
      basis: 'Fixed cost',
    });
  }

  // Calculate totals
  const subtotal = lineItems.reduce((sum, item) => sum + item.cost, 0);
  const consultingFee = RATES.consultingFee;
  const totalCost = subtotal + consultingFee;
  const costPerHeatedSqFt = Math.round((totalCost / input.heatedSqFt) * 100) / 100;

  return {
    projectName: input.projectName,
    lineItems,
    subtotal,
    consultingFee,
    totalCost,
    costPerHeatedSqFt,
    specs: {
      heatedSqFt: input.heatedSqFt,
      totalSqFt: totalSqFt,
      shopSqFt: input.shopSqFt,
      carportSqFt: input.carportSqFt,
      porchSqFt: input.porchSqFt,
    },
  };
}
