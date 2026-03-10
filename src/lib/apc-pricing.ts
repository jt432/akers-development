// APC Pricing Engine — Akers Property Care
// All pricing logic lives here so it can be shared between client (real-time) and server (verification)

export type ServiceType = 'standard' | 'deep' | 'post-construction';
export type Frequency = 'one-time' | 'weekly' | 'biweekly' | 'monthly';
export type Condition = 1 | 2 | 3 | 4 | 5;

export interface AddOns {
  fridge: boolean;
  oven: boolean;
  laundry: boolean;
  windows: number; // count of windows
  garage: boolean;
  cabinets: boolean;
}

export interface PricingInput {
  serviceType: ServiceType;
  sqft: number;
  bedrooms: number;
  bathrooms: number;
  pets: number;
  occupants: number;
  condition: Condition;
  frequency: Frequency;
  addOns: AddOns;
}

export interface PricingResult {
  basePrice: number;
  adjusterTotal: number;
  addOnTotal: number;
  subtotal: number;
  discountPercent: number;
  discountAmount: number;
  total: number;
  estimatedHours: number;
  breakdown: string[];
}

// --- Constants ---

const BASE_RATES: Record<ServiceType, number> = {
  standard: 0.15,
  deep: 0.25,
  'post-construction': 0.40,
};

const FREQUENCY_DISCOUNTS: Record<Frequency, number> = {
  'one-time': 0,
  weekly: 0.15,
  biweekly: 0.10,
  monthly: 0.05,
};

const CONDITION_MULTIPLIERS: Record<Condition, number> = {
  1: 0,
  2: 0,
  3: 0.10,
  4: 0.20,
  5: 0.35,
};

const ADD_ON_PRICES = {
  fridge: 35,
  oven: 40,
  laundry: 30,
  windowPer: 5,
  garage: 25,
  cabinets: 50,
};

// sq ft cleaned per hour by service type
const SQFT_PER_HOUR: Record<ServiceType, number> = {
  standard: 500,
  deep: 350,
  'post-construction': 250,
};

const MINUTES_PER_ADDON = 15;

// --- Labels ---

export const SERVICE_LABELS: Record<ServiceType, string> = {
  standard: 'Standard Clean',
  deep: 'Deep Clean',
  'post-construction': 'Post-Construction Cleanup',
};

export const FREQUENCY_LABELS: Record<Frequency, string> = {
  'one-time': 'One-Time',
  weekly: 'Weekly',
  biweekly: 'Biweekly',
  monthly: 'Monthly',
};

export const CONDITION_LABELS: Record<Condition, string> = {
  1: 'Excellent',
  2: 'Good',
  3: 'Average',
  4: 'Below Average',
  5: 'Needs Heavy Cleaning',
};

// --- Calculator ---

export function calculatePrice(input: PricingInput): PricingResult {
  const breakdown: string[] = [];

  // 1. Base price
  const rate = BASE_RATES[input.serviceType];
  const basePrice = round(rate * input.sqft);
  breakdown.push(`${SERVICE_LABELS[input.serviceType]}: ${input.sqft.toLocaleString()} sq ft × $${rate}/sq ft = $${basePrice.toFixed(2)}`);

  // 2. Property adjusters
  let adjusterTotal = 0;

  // Bedrooms above 2
  const extraBeds = Math.max(0, input.bedrooms - 2);
  if (extraBeds > 0) {
    const bedAdj = round(0.01 * input.sqft * extraBeds);
    adjusterTotal += bedAdj;
    breakdown.push(`Extra bedrooms (${extraBeds}): +$${bedAdj.toFixed(2)}`);
  }

  // Bathrooms above 1
  const extraBaths = Math.max(0, input.bathrooms - 1);
  if (extraBaths > 0) {
    const bathAdj = round(0.015 * input.sqft * extraBaths);
    adjusterTotal += bathAdj;
    breakdown.push(`Extra bathrooms (${extraBaths}): +$${bathAdj.toFixed(2)}`);
  }

  // Pets
  if (input.pets > 0) {
    const petAdj = round(0.02 * input.sqft * input.pets);
    adjusterTotal += petAdj;
    breakdown.push(`Pets (${input.pets}): +$${petAdj.toFixed(2)}`);
  }

  // Occupants above 2
  const extraOccupants = Math.max(0, input.occupants - 2);
  if (extraOccupants > 0) {
    const occAdj = round(0.005 * input.sqft * extraOccupants);
    adjusterTotal += occAdj;
    breakdown.push(`Extra occupants (${extraOccupants}): +$${occAdj.toFixed(2)}`);
  }

  // Condition
  const condMult = CONDITION_MULTIPLIERS[input.condition];
  let conditionAdj = 0;
  if (condMult > 0) {
    conditionAdj = round((basePrice + adjusterTotal) * condMult);
    adjusterTotal += conditionAdj;
    breakdown.push(`Condition (${CONDITION_LABELS[input.condition]}): +${(condMult * 100).toFixed(0)}% = +$${conditionAdj.toFixed(2)}`);
  }

  // 3. Add-ons
  let addOnTotal = 0;
  let addOnCount = 0;

  if (input.addOns.fridge) {
    addOnTotal += ADD_ON_PRICES.fridge;
    addOnCount++;
    breakdown.push(`Inside fridge: +$${ADD_ON_PRICES.fridge.toFixed(2)}`);
  }
  if (input.addOns.oven) {
    addOnTotal += ADD_ON_PRICES.oven;
    addOnCount++;
    breakdown.push(`Inside oven: +$${ADD_ON_PRICES.oven.toFixed(2)}`);
  }
  if (input.addOns.laundry) {
    addOnTotal += ADD_ON_PRICES.laundry;
    addOnCount++;
    breakdown.push(`Laundry (wash/dry/fold): +$${ADD_ON_PRICES.laundry.toFixed(2)}`);
  }
  if (input.addOns.windows > 0) {
    const windowPrice = ADD_ON_PRICES.windowPer * input.addOns.windows;
    addOnTotal += windowPrice;
    addOnCount++;
    breakdown.push(`Interior windows (${input.addOns.windows}): +$${windowPrice.toFixed(2)}`);
  }
  if (input.addOns.garage) {
    addOnTotal += ADD_ON_PRICES.garage;
    addOnCount++;
    breakdown.push(`Garage/carport sweep: +$${ADD_ON_PRICES.garage.toFixed(2)}`);
  }
  if (input.addOns.cabinets) {
    addOnTotal += ADD_ON_PRICES.cabinets;
    addOnCount++;
    breakdown.push(`Cabinet interior wipe-down: +$${ADD_ON_PRICES.cabinets.toFixed(2)}`);
  }

  // 4. Subtotal before discount
  const subtotal = round(basePrice + adjusterTotal + addOnTotal);

  // 5. Frequency discount
  const discountPercent = FREQUENCY_DISCOUNTS[input.frequency];
  const discountAmount = round(subtotal * discountPercent);
  if (discountPercent > 0) {
    breakdown.push(`${FREQUENCY_LABELS[input.frequency]} discount (${(discountPercent * 100).toFixed(0)}%): -$${discountAmount.toFixed(2)}`);
  }

  // 6. Total
  const total = round(subtotal - discountAmount);

  // 7. Estimated duration
  const baseDurationHours = input.sqft / SQFT_PER_HOUR[input.serviceType];
  const addOnMinutes = addOnCount * MINUTES_PER_ADDON;
  const estimatedHours = round(baseDurationHours + addOnMinutes / 60);

  return {
    basePrice,
    adjusterTotal,
    addOnTotal,
    subtotal,
    discountPercent,
    discountAmount,
    total,
    estimatedHours,
    breakdown,
  };
}

function round(n: number): number {
  return Math.round(n * 100) / 100;
}
