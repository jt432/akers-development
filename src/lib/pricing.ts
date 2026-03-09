// ─── Akers Development Cost Estimator Pricing Engine ───
// Calibrated from two real projects:
//   1) McAdams Residence — 2,400 sq ft heated, 1-story, metal roof/siding
//   2) Watertown Triplex — 1,464 sq ft heated per unit, 2-story, shingle/lap siding
// All rates can be adjusted as pricing changes.

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
  sidingType: 'metal' | 'vinyl' | 'brick' | 'lap' | 'board-batten';
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
  basis: string;
}

export interface Estimate {
  projectName: string;
  lineItems: LineItem[];
  subtotal: number;
  contingency: number;
  consultingFee: number;
  totalCost: number;
  costPerHeatedSqFt: number;
  specs: {
    heatedSqFt: number;
    totalSqFt: number;
    footprintSqFt: number;
    shopSqFt: number;
    carportSqFt: number;
    porchSqFt: number;
    stories: number;
  };
}

// ─── BASE RATES ───
// Concrete scales with FOOTPRINT (ground-level area only).
// Key insight: 1-story = bigger footprint = more concrete.
//              2-story = smaller footprint = less concrete, but more framing.
//
// McAdams (1-story): $40,200 concrete / 5,715 footprint = $7.03/sq ft
// Triplex (2-story): $19,349 concrete / 1,029 footprint = $18.80/sq ft
//   (higher per-footprint rate due to poured foundation walls for 2-story)

const RATES = {
  // ── CONCRETE ──
  // 1-story: simple slab, lower rate per footprint sq ft but MORE footprint
  concrete1StoryPerFootprintSqFt: 7.03,   // McAdams: $40,200 / 5,715
  // 2-story: poured foundation walls, higher rate but LESS footprint
  concrete2StoryPerFootprintSqFt: 12.50,  // Blended rate for residential 2-story slab

  // ── FRAMING ──
  // 1-story: framing scales with heated + enclosed area (no stairs)
  framing1StoryPerEnclosedSqFt: 11.30,    // McAdams calibrated
  framing1StoryPerOpenSqFt: 2.40,         // Carport/porch framing
  // 2-story: more framing per heated sq ft (2nd floor joists, taller walls, more structure)
  framing2StoryPerEnclosedSqFt: 14.50,    // Higher rate for 2-story complexity
  framing2StoryPerOpenSqFt: 2.40,
  // Stairs (2-story only)
  stairsAllowance: 11000,                  // Triplex: $3,850 labor + $7,150 materials

  // ── GENERAL MATERIALS ──
  // Lumber, sheathing, hardware, windows, doors, etc.
  materialsPerEnclosedSqFt: 28.00,         // McAdams calibrated
  materialsPerOpenSqFt: 6.50,
  materials2StoryMultiplier: 1.10,          // 10% more materials for 2-story

  // ── DRYWALL ──
  drywallPerSqFt: 6.00,                    // McAdams: $14,400 / 2,400
  drywall2StoryMultiplier: 1.10,            // More wall area in 2-story (stairwells, taller spaces)

  // ── INSULATION ──
  insulationPerSqFt: 2.92,                 // McAdams: $7,000 / 2,400

  // ── ELECTRICAL ──
  electricalPerEnclosedSqFt: 6.47,         // McAdams: $22,000 / 3,400

  // ── HVAC ──
  hvacPerSqFt: 7.50,                       // McAdams: $18,000 / 2,400

  // ── PLUMBING ──
  // Triplex data: $17,600 labor + $8,470 materials + $495 toilets = $26,565 per unit (3 baths + kitchen)
  // That's ~$6,641 per bathroom/kitchen fixture group
  plumbingPerBathroom: 5500,               // Rough + finish per bathroom
  plumbingBaseKitchen: 3500,               // Kitchen plumbing
  plumbingWalkInShowerUpgrade: 5800,       // Walk-in glass shower (master bath upgrade)

  // ── ROOFING ──
  // Scales with FOOTPRINT (roof covers footprint, not per-floor area)
  roofingMetalPerFootprintSqFt: 2.59,     // McAdams: $14,800 / 5,715
  roofingShinglePerFootprintSqFt: 2.10,   // Shingle ~20% less
  // 2-story: steeper roof pitches, more complexity
  roofing2StoryMultiplier: 1.20,           // Triplex has 6/12 and 10/12 pitches

  // ── SIDING ──
  // Scales with enclosed area; 2-story has taller walls = more siding
  sidingMetalPerEnclosedSqFt: 4.56,
  sidingVinylPerEnclosedSqFt: 3.80,
  sidingBrickPerEnclosedSqFt: 9.00,
  sidingLapPerEnclosedSqFt: 4.20,          // Lap siding (from triplex)
  sidingBoardBattenPerEnclosedSqFt: 4.80,  // Board & batten (from triplex)
  siding2StoryMultiplier: 1.35,            // 2-story = ~35% more wall surface

  // ── TRIM ──
  trimPerSqFt: 2.67,                       // McAdams: $6,400 / 2,400

  // ── PAINT ──
  paintLaborPerSqFt: 3.21,                 // Triplex: $7,700 / 2,400 (scaled to McAdams size)
  paintMaterialPerSqFt: 0.92,              // Triplex: $2,200 / 2,400

  // ── FLOORING ──
  flooringStandardPerSqFt: 1.67,           // McAdams: $4,000 / 2,400
  flooringUpgradedPerSqFt: 4.50,           // LVP / mid-grade (adjusted from triplex: $6.33)
  flooringPremiumPerSqFt: 7.00,            // Hardwood / tile

  // ── CABINETS & COUNTERTOPS ──
  cabinetsBudget: 15000,
  cabinetsMid: 22000,
  cabinetsPremium: 35000,

  // ── APPLIANCES ──
  applianceAllowance: 5720,                // Triplex: fridge $1,650 + stove $1,980 + micro $1,100 + water heater $990

  // ── SITE WORK ──
  septicSystem: 10000,
  sitePrepBase: 5500,                       // Triplex: dirt prep / grading

  // ── CONTINGENCY ──
  contingencyRate: 0.10,                    // 10% contingency on all construction costs

  // ── CONSULTING FEE ──
  // Scales with project size: $45,000 minimum, increases for larger projects
  consultingFeeMin: 45000,
  consultingFeeMax: 75000,
  // Fee scales linearly: $45K at 2,000 sq ft, $55K at 5,000 sq ft, up to $75K at 10,000+ sq ft
  consultingFeeSqFtFloor: 2000,
  consultingFeeSqFtCeiling: 10000,
};

// ─── Calculate consulting fee based on total heated sq ft ───
function calcConsultingFee(heatedSqFt: number): number {
  if (heatedSqFt <= RATES.consultingFeeSqFtFloor) return RATES.consultingFeeMin;
  if (heatedSqFt >= RATES.consultingFeeSqFtCeiling) return RATES.consultingFeeMax;
  const range = RATES.consultingFeeSqFtCeiling - RATES.consultingFeeSqFtFloor;
  const feeRange = RATES.consultingFeeMax - RATES.consultingFeeMin;
  const ratio = (heatedSqFt - RATES.consultingFeeSqFtFloor) / range;
  return Math.round(RATES.consultingFeeMin + (ratio * feeRange));
}

// ─── Calculate footprint (ground-level area) ───
function calcFootprint(input: ProjectInput): number {
  if (input.stories === 1) {
    // 1-story: everything is on one level
    return input.heatedSqFt + input.shopSqFt + input.carportSqFt + input.porchSqFt;
  }
  // 2-story: heated area split across 2 floors, garage/carport/porch on ground only
  const heatedFootprint = Math.ceil(input.heatedSqFt / 2);
  return heatedFootprint + input.shopSqFt + input.carportSqFt + input.porchSqFt;
}

export function calculateEstimate(input: ProjectInput): Estimate {
  const is2Story = input.stories === 2;
  const footprint = calcFootprint(input);
  const totalSqFt = input.heatedSqFt + input.shopSqFt + input.carportSqFt + input.porchSqFt;
  const enclosedSqFt = input.heatedSqFt + input.shopSqFt;
  const openSqFt = input.carportSqFt + input.porchSqFt;

  const lineItems: LineItem[] = [];

  // ── Site Prep ──
  lineItems.push({
    category: 'Site Work',
    description: 'Site Preparation & Grading',
    cost: RATES.sitePrepBase,
    basis: 'Base site prep allowance',
  });

  // ── Concrete ──
  // KEY: Concrete scales with FOOTPRINT, not total heated area
  // 1-story has MORE footprint → MORE concrete
  // 2-story has LESS footprint → LESS concrete (but higher per-sq-ft rate)
  const concreteRate = is2Story
    ? RATES.concrete2StoryPerFootprintSqFt
    : RATES.concrete1StoryPerFootprintSqFt;
  const concreteCost = footprint * concreteRate;

  lineItems.push({
    category: 'Foundation',
    description: `Concrete (${is2Story ? '2-story foundation' : 'slab on grade'})`,
    cost: Math.round(concreteCost),
    basis: `${footprint.toLocaleString()} sq ft footprint × $${concreteRate.toFixed(2)}/sq ft`,
  });

  // ── Framing ──
  // KEY: 2-story has higher framing rate (2nd floor joists, taller walls, more structural)
  const framingEnclosedRate = is2Story
    ? RATES.framing2StoryPerEnclosedSqFt
    : RATES.framing1StoryPerEnclosedSqFt;
  const framingOpenRate = is2Story
    ? RATES.framing2StoryPerOpenSqFt
    : RATES.framing1StoryPerOpenSqFt;

  const framingEnclosed = enclosedSqFt * framingEnclosedRate;
  const framingOpen = openSqFt * framingOpenRate;
  let framingTotal = framingEnclosed + framingOpen;
  let framingBasis = `${enclosedSqFt.toLocaleString()} enclosed × $${framingEnclosedRate}`;
  if (openSqFt > 0) framingBasis += ` + ${openSqFt.toLocaleString()} open × $${framingOpenRate}`;

  lineItems.push({
    category: 'Structure',
    description: `Framing (${is2Story ? '2-story' : '1-story'})`,
    cost: Math.round(framingTotal),
    basis: framingBasis,
  });

  // Stairs (2-story only)
  if (is2Story) {
    lineItems.push({
      category: 'Structure',
      description: 'Stairs (labor & materials)',
      cost: RATES.stairsAllowance,
      basis: '2-story stair system allowance',
    });
  }

  // ── General Materials ──
  const matMultiplier = is2Story ? RATES.materials2StoryMultiplier : 1;
  const matEnclosed = enclosedSqFt * RATES.materialsPerEnclosedSqFt * matMultiplier;
  const matOpen = openSqFt * RATES.materialsPerOpenSqFt;
  lineItems.push({
    category: 'Structure',
    description: 'General Materials (lumber, sheathing, hardware, windows, doors)',
    cost: Math.round(matEnclosed + matOpen),
    basis: `${enclosedSqFt.toLocaleString()} enclosed × $${RATES.materialsPerEnclosedSqFt}${is2Story ? ' (+10% 2-story)' : ''} + ${openSqFt.toLocaleString()} open × $${RATES.materialsPerOpenSqFt}`,
  });

  // ── Roofing ──
  // Roof covers the FOOTPRINT area, with pitch multiplier for 2-story
  const baseRoofRate = input.roofType === 'metal'
    ? RATES.roofingMetalPerFootprintSqFt
    : RATES.roofingShinglePerFootprintSqFt;
  const roofMultiplier = is2Story ? RATES.roofing2StoryMultiplier : 1;
  const roofingCost = footprint * baseRoofRate * roofMultiplier;
  lineItems.push({
    category: 'Exterior',
    description: `Roofing (${input.roofType === 'metal' ? 'Metal' : 'Shingle'})`,
    cost: Math.round(roofingCost),
    basis: `${footprint.toLocaleString()} sq ft footprint × $${baseRoofRate}/sq ft${is2Story ? ' (+20% steep pitch)' : ''}`,
  });

  // ── Siding ──
  const sidingRateMap: Record<string, number> = {
    metal: RATES.sidingMetalPerEnclosedSqFt,
    vinyl: RATES.sidingVinylPerEnclosedSqFt,
    brick: RATES.sidingBrickPerEnclosedSqFt,
    lap: RATES.sidingLapPerEnclosedSqFt,
    'board-batten': RATES.sidingBoardBattenPerEnclosedSqFt,
  };
  const sidingRate = sidingRateMap[input.sidingType] || RATES.sidingLapPerEnclosedSqFt;
  const sidingMultiplier = is2Story ? RATES.siding2StoryMultiplier : 1;
  const sidingCost = enclosedSqFt * sidingRate * sidingMultiplier;
  const sidingLabels: Record<string, string> = {
    metal: 'Metal', vinyl: 'Vinyl', brick: 'Brick',
    lap: 'Lap Siding', 'board-batten': 'Board & Batten',
  };
  lineItems.push({
    category: 'Exterior',
    description: `Siding (${sidingLabels[input.sidingType] || input.sidingType})`,
    cost: Math.round(sidingCost),
    basis: `${enclosedSqFt.toLocaleString()} enclosed × $${sidingRate}/sq ft${is2Story ? ' (+35% taller walls)' : ''}`,
  });

  // ── Drywall ──
  const drywallMultiplier = is2Story ? RATES.drywall2StoryMultiplier : 1;
  const drywallCost = input.heatedSqFt * RATES.drywallPerSqFt * drywallMultiplier;
  lineItems.push({
    category: 'Interior',
    description: 'Drywall (hang, tape & finish)',
    cost: Math.round(drywallCost),
    basis: `${input.heatedSqFt.toLocaleString()} heated sq ft × $${RATES.drywallPerSqFt}/sq ft${is2Story ? ' (+10% stairwells)' : ''}`,
  });

  // ── Insulation ──
  lineItems.push({
    category: 'Interior',
    description: 'Insulation',
    cost: Math.round(input.heatedSqFt * RATES.insulationPerSqFt),
    basis: `${input.heatedSqFt.toLocaleString()} heated sq ft × $${RATES.insulationPerSqFt}/sq ft`,
  });

  // ── Electrical ──
  const elecSqFt = input.includeShopElectrical ? enclosedSqFt : input.heatedSqFt;
  lineItems.push({
    category: 'Mechanical',
    description: `Electrical${input.includeShopElectrical ? ' (incl. shop)' : ''}`,
    cost: Math.round(elecSqFt * RATES.electricalPerEnclosedSqFt),
    basis: `${elecSqFt.toLocaleString()} sq ft × $${RATES.electricalPerEnclosedSqFt}/sq ft`,
  });

  // ── HVAC ──
  if (input.includeHVAC) {
    lineItems.push({
      category: 'Mechanical',
      description: 'HVAC System',
      cost: Math.round(input.heatedSqFt * RATES.hvacPerSqFt),
      basis: `${input.heatedSqFt.toLocaleString()} heated sq ft × $${RATES.hvacPerSqFt}/sq ft`,
    });
  }

  // ── Plumbing ──
  const plumbingCost = (input.numBathrooms * RATES.plumbingPerBathroom) + RATES.plumbingBaseKitchen;
  lineItems.push({
    category: 'Mechanical',
    description: 'Plumbing (rough-in & fixtures)',
    cost: Math.round(plumbingCost),
    basis: `${input.numBathrooms} bath × $${RATES.plumbingPerBathroom.toLocaleString()} + kitchen $${RATES.plumbingBaseKitchen.toLocaleString()}`,
  });

  // ── Trim ──
  lineItems.push({
    category: 'Interior',
    description: 'Trim (baseboards, window & door casings)',
    cost: Math.round(input.heatedSqFt * RATES.trimPerSqFt),
    basis: `${input.heatedSqFt.toLocaleString()} heated sq ft × $${RATES.trimPerSqFt}/sq ft`,
  });

  // ── Paint ──
  const paintCost = input.heatedSqFt * (RATES.paintLaborPerSqFt + RATES.paintMaterialPerSqFt);
  lineItems.push({
    category: 'Interior',
    description: 'Paint (labor & materials)',
    cost: Math.round(paintCost),
    basis: `${input.heatedSqFt.toLocaleString()} heated sq ft × $${(RATES.paintLaborPerSqFt + RATES.paintMaterialPerSqFt).toFixed(2)}/sq ft`,
  });

  // ── Flooring ──
  const flooringRateMap = {
    standard: RATES.flooringStandardPerSqFt,
    upgraded: RATES.flooringUpgradedPerSqFt,
    premium: RATES.flooringPremiumPerSqFt,
  };
  const floorRate = flooringRateMap[input.flooringType];
  const floorLabel = input.flooringType.charAt(0).toUpperCase() + input.flooringType.slice(1);
  lineItems.push({
    category: 'Interior',
    description: `Flooring (${floorLabel})`,
    cost: Math.round(input.heatedSqFt * floorRate),
    basis: `${input.heatedSqFt.toLocaleString()} heated sq ft × $${floorRate}/sq ft`,
  });

  // ── Cabinets & Countertops ──
  const cabinetCostMap = { budget: RATES.cabinetsBudget, mid: RATES.cabinetsMid, premium: RATES.cabinetsPremium };
  const cabinetCost = cabinetCostMap[input.cabinetGrade];
  const cabinetLabel = input.cabinetGrade.charAt(0).toUpperCase() + input.cabinetGrade.slice(1);
  lineItems.push({
    category: 'Interior',
    description: `Cabinets & Countertops (${cabinetLabel})`,
    cost: cabinetCost,
    basis: `${cabinetLabel} grade allowance`,
  });

  // ── Appliances ──
  lineItems.push({
    category: 'Interior',
    description: 'Appliances (fridge, range, microwave, water heater)',
    cost: RATES.applianceAllowance,
    basis: 'Standard appliance package',
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

  // ── Calculate totals ──
  const subtotal = lineItems.reduce((sum, item) => sum + item.cost, 0);
  const contingency = Math.round(subtotal * RATES.contingencyRate);
  const consultingFee = calcConsultingFee(input.heatedSqFt);
  const totalCost = subtotal + contingency + consultingFee;
  const costPerHeatedSqFt = Math.round((totalCost / input.heatedSqFt) * 100) / 100;

  return {
    projectName: input.projectName,
    lineItems,
    subtotal,
    contingency,
    consultingFee,
    totalCost,
    costPerHeatedSqFt,
    specs: {
      heatedSqFt: input.heatedSqFt,
      totalSqFt: totalSqFt,
      footprintSqFt: footprint,
      shopSqFt: input.shopSqFt,
      carportSqFt: input.carportSqFt,
      porchSqFt: input.porchSqFt,
      stories: input.stories,
    },
  };
}
