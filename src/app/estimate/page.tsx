'use client';

import { useState } from 'react';
import { calculateEstimate, type ProjectInput, type Estimate } from '@/lib/pricing';

const defaultInput: ProjectInput = {
  projectName: '',
  heatedSqFt: 2400,
  shopSqFt: 0,
  carportSqFt: 0,
  porchSqFt: 0,
  numBathrooms: 2,
  numBedrooms: 3,
  stories: 1,
  roofType: 'metal',
  sidingType: 'metal',
  foundationType: 'slab',
  includeHVAC: true,
  includeSeptic: true,
  includeShopElectrical: false,
  flooringType: 'standard',
  cabinetGrade: 'budget',
};

function formatCurrency(n: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);
}

// Group line items by category for display
function groupByCategory(items: Estimate['lineItems']) {
  const groups: Record<string, Estimate['lineItems']> = {};
  for (const item of items) {
    if (!groups[item.category]) groups[item.category] = [];
    groups[item.category].push(item);
  }
  return groups;
}

const categoryOrder = ['Foundation', 'Structure', 'Exterior', 'Interior', 'Mechanical', 'Site Work'];
const categoryIcons: Record<string, string> = {
  'Foundation': '🏗',
  'Structure': '🪵',
  'Exterior': '🏠',
  'Interior': '🪟',
  'Mechanical': '⚡',
  'Site Work': '🌿',
};

export default function EstimatePage() {
  const [input, setInput] = useState<ProjectInput>(defaultInput);
  const [estimate, setEstimate] = useState<Estimate | null>(null);
  const [showForm, setShowForm] = useState(true);

  const update = (field: keyof ProjectInput, value: any) => {
    setInput(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = calculateEstimate(input);
    setEstimate(result);
    setShowForm(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReset = () => {
    setEstimate(null);
    setShowForm(true);
  };

  return (
    <>
      {/* Hero */}
      <section className="relative bg-brand-dark pt-32 pb-16">
        <div className="absolute inset-0 bg-gradient-to-b from-brand-dark to-brand-charcoal" />
        <div className="relative z-10 section-padding container-narrow text-center">
          <span className="inline-block text-xs tracking-[0.25em] uppercase font-semibold text-brand-sand mb-4">
            Cost Estimator
          </span>
          <h1 className="heading-lg text-white">
            Construction Cost Estimate
          </h1>
          <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
            Enter your project details below and get an instant cost breakdown
            based on our current rates.
          </p>
        </div>
      </section>

      {/* Form or Results */}
      <section className="section-padding bg-brand-white">
        <div className="container-narrow">
          {showForm ? (
            <form onSubmit={handleSubmit} className="space-y-10">
              {/* Project Info */}
              <div>
                <h2 className="heading-sm text-brand-charcoal mb-6 pb-3 border-b border-gray-200">
                  Project Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-brand-slate mb-2 uppercase tracking-wide">
                      Project Name
                    </label>
                    <input
                      type="text"
                      value={input.projectName}
                      onChange={e => update('projectName', e.target.value)}
                      placeholder="e.g. McAdams Residence"
                      className="input-field"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Square Footage */}
              <div>
                <h2 className="heading-sm text-brand-charcoal mb-6 pb-3 border-b border-gray-200">
                  Square Footage
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-brand-slate mb-2 uppercase tracking-wide">
                      Heated Area *
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={input.heatedSqFt || ''}
                        onChange={e => update('heatedSqFt', parseInt(e.target.value) || 0)}
                        className="input-field pr-12"
                        required
                        min={100}
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">sq ft</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-brand-slate mb-2 uppercase tracking-wide">
                      Shop / Garage
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={input.shopSqFt || ''}
                        onChange={e => update('shopSqFt', parseInt(e.target.value) || 0)}
                        className="input-field pr-12"
                        min={0}
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">sq ft</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-brand-slate mb-2 uppercase tracking-wide">
                      Carport
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={input.carportSqFt || ''}
                        onChange={e => update('carportSqFt', parseInt(e.target.value) || 0)}
                        className="input-field pr-12"
                        min={0}
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">sq ft</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-brand-slate mb-2 uppercase tracking-wide">
                      Porch
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={input.porchSqFt || ''}
                        onChange={e => update('porchSqFt', parseInt(e.target.value) || 0)}
                        className="input-field pr-12"
                        min={0}
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">sq ft</span>
                    </div>
                  </div>
                </div>
                {/* Total display */}
                <div className="mt-4 p-4 bg-brand-cream rounded">
                  <span className="text-sm text-brand-stone uppercase tracking-wide">Total Under Roof: </span>
                  <span className="font-semibold text-brand-charcoal">
                    {(input.heatedSqFt + input.shopSqFt + input.carportSqFt + input.porchSqFt).toLocaleString()} sq ft
                  </span>
                </div>
              </div>

              {/* Room Count */}
              <div>
                <h2 className="heading-sm text-brand-charcoal mb-6 pb-3 border-b border-gray-200">
                  Room Count
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-brand-slate mb-2 uppercase tracking-wide">
                      Bedrooms
                    </label>
                    <select
                      value={input.numBedrooms}
                      onChange={e => update('numBedrooms', parseInt(e.target.value))}
                      className="input-field"
                    >
                      {[1,2,3,4,5,6].map(n => (
                        <option key={n} value={n}>{n}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-brand-slate mb-2 uppercase tracking-wide">
                      Bathrooms
                    </label>
                    <select
                      value={input.numBathrooms}
                      onChange={e => update('numBathrooms', parseInt(e.target.value))}
                      className="input-field"
                    >
                      {[1,2,3,4,5].map(n => (
                        <option key={n} value={n}>{n}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-brand-slate mb-2 uppercase tracking-wide">
                      Stories
                    </label>
                    <select
                      value={input.stories}
                      onChange={e => update('stories', parseInt(e.target.value) as 1 | 2)}
                      className="input-field"
                    >
                      <option value={1}>1 Story</option>
                      <option value={2}>2 Story</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Exterior Selections */}
              <div>
                <h2 className="heading-sm text-brand-charcoal mb-6 pb-3 border-b border-gray-200">
                  Exterior Selections
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-brand-slate mb-2 uppercase tracking-wide">
                      Roof Type
                    </label>
                    <select
                      value={input.roofType}
                      onChange={e => update('roofType', e.target.value)}
                      className="input-field"
                    >
                      <option value="metal">Metal Roofing</option>
                      <option value="shingle">Shingle Roofing</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-brand-slate mb-2 uppercase tracking-wide">
                      Siding Type
                    </label>
                    <select
                      value={input.sidingType}
                      onChange={e => update('sidingType', e.target.value)}
                      className="input-field"
                    >
                      <option value="metal">Metal Siding</option>
                      <option value="vinyl">Vinyl Siding</option>
                      <option value="brick">Brick</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-brand-slate mb-2 uppercase tracking-wide">
                      Foundation
                    </label>
                    <select
                      value={input.foundationType}
                      onChange={e => update('foundationType', e.target.value)}
                      className="input-field"
                    >
                      <option value="slab">Slab</option>
                      <option value="crawlspace">Crawl Space</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Interior Selections */}
              <div>
                <h2 className="heading-sm text-brand-charcoal mb-6 pb-3 border-b border-gray-200">
                  Interior Selections
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-brand-slate mb-2 uppercase tracking-wide">
                      Flooring Grade
                    </label>
                    <select
                      value={input.flooringType}
                      onChange={e => update('flooringType', e.target.value)}
                      className="input-field"
                    >
                      <option value="standard">Standard</option>
                      <option value="upgraded">Upgraded (LVP / Mid-Grade)</option>
                      <option value="premium">Premium (Hardwood / Tile)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-brand-slate mb-2 uppercase tracking-wide">
                      Cabinets & Countertops
                    </label>
                    <select
                      value={input.cabinetGrade}
                      onChange={e => update('cabinetGrade', e.target.value)}
                      className="input-field"
                    >
                      <option value="budget">Budget ($15,000 allowance)</option>
                      <option value="mid">Mid-Grade ($22,000 allowance)</option>
                      <option value="premium">Premium ($35,000 allowance)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Systems & Site */}
              <div>
                <h2 className="heading-sm text-brand-charcoal mb-6 pb-3 border-b border-gray-200">
                  Systems & Site Work
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <label className="flex items-center gap-3 p-4 border border-gray-200 cursor-pointer hover:border-brand-stone transition-colors">
                    <input
                      type="checkbox"
                      checked={input.includeHVAC}
                      onChange={e => update('includeHVAC', e.target.checked)}
                      className="w-5 h-5 accent-brand-charcoal"
                    />
                    <span className="text-sm font-medium text-brand-charcoal uppercase tracking-wide">HVAC System</span>
                  </label>
                  <label className="flex items-center gap-3 p-4 border border-gray-200 cursor-pointer hover:border-brand-stone transition-colors">
                    <input
                      type="checkbox"
                      checked={input.includeSeptic}
                      onChange={e => update('includeSeptic', e.target.checked)}
                      className="w-5 h-5 accent-brand-charcoal"
                    />
                    <span className="text-sm font-medium text-brand-charcoal uppercase tracking-wide">Septic System</span>
                  </label>
                  <label className="flex items-center gap-3 p-4 border border-gray-200 cursor-pointer hover:border-brand-stone transition-colors">
                    <input
                      type="checkbox"
                      checked={input.includeShopElectrical}
                      onChange={e => update('includeShopElectrical', e.target.checked)}
                      className="w-5 h-5 accent-brand-charcoal"
                    />
                    <span className="text-sm font-medium text-brand-charcoal uppercase tracking-wide">Shop Electrical</span>
                  </label>
                </div>
              </div>

              {/* Submit */}
              <div className="pt-6 border-t border-gray-200">
                <button type="submit" className="btn-accent w-full sm:w-auto text-center justify-center">
                  Generate Estimate
                </button>
              </div>
            </form>
          ) : estimate ? (
            <EstimateResults estimate={estimate} onBack={handleReset} />
          ) : null}
        </div>
      </section>
    </>
  );
}

// ─── Results Component ───
function EstimateResults({ estimate, onBack }: { estimate: Estimate; onBack: () => void }) {
  const grouped = groupByCategory(estimate.lineItems);

  return (
    <div>
      {/* Summary Header */}
      <div className="bg-brand-dark text-white p-8 md:p-12 mb-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <p className="text-xs tracking-[0.25em] uppercase text-brand-sand mb-2">Estimate For</p>
            <h2 className="heading-md text-white">{estimate.projectName}</h2>
            <p className="text-gray-400 mt-2">
              {estimate.specs.heatedSqFt.toLocaleString()} sq ft heated
              {estimate.specs.shopSqFt > 0 && ` · ${estimate.specs.shopSqFt.toLocaleString()} sq ft shop`}
              {estimate.specs.carportSqFt > 0 && ` · ${estimate.specs.carportSqFt.toLocaleString()} sq ft carport`}
              {estimate.specs.porchSqFt > 0 && ` · ${estimate.specs.porchSqFt.toLocaleString()} sq ft porch`}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs tracking-[0.25em] uppercase text-brand-sand mb-2">Total Estimate</p>
            <p className="text-4xl md:text-5xl font-bold tracking-tight">{formatCurrency(estimate.totalCost)}</p>
            <p className="text-gray-400 mt-1">{formatCurrency(estimate.costPerHeatedSqFt)} / heated sq ft</p>
          </div>
        </div>
      </div>

      {/* Line Item Breakdown */}
      <div className="space-y-8">
        {categoryOrder.map(cat => {
          const items = grouped[cat];
          if (!items) return null;
          const catTotal = items.reduce((sum, i) => sum + i.cost, 0);
          return (
            <div key={cat} className="border border-gray-100">
              <div className="flex items-center justify-between p-5 bg-brand-cream">
                <h3 className="font-semibold text-brand-charcoal uppercase tracking-wide text-sm flex items-center gap-2">
                  <span>{categoryIcons[cat] || ''}</span> {cat}
                </h3>
                <span className="font-semibold text-brand-charcoal">{formatCurrency(catTotal)}</span>
              </div>
              <div className="divide-y divide-gray-100">
                {items.map((item, i) => (
                  <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-5 gap-2">
                    <div>
                      <p className="font-medium text-brand-charcoal">{item.description}</p>
                      <p className="text-sm text-brand-stone mt-0.5">{item.basis}</p>
                    </div>
                    <p className="font-semibold text-brand-charcoal text-right whitespace-nowrap">
                      {formatCurrency(item.cost)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {/* Consulting Fee */}
        <div className="border-2 border-brand-stone">
          <div className="flex items-center justify-between p-5 bg-brand-cream">
            <h3 className="font-semibold text-brand-charcoal uppercase tracking-wide text-sm">
              Consulting Fee
            </h3>
            <span className="font-semibold text-brand-charcoal">{formatCurrency(estimate.consultingFee)}</span>
          </div>
          <div className="p-5">
            <p className="text-sm text-brand-stone">
              Development consulting fee — includes project oversight, vendor coordination,
              budgeting, and construction management.
            </p>
          </div>
        </div>

        {/* Grand Total */}
        <div className="bg-brand-dark text-white p-8 mt-6">
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div>
              <p className="text-sm text-gray-400 uppercase tracking-wide">Construction Subtotal</p>
              <p className="text-2xl font-bold mt-1">{formatCurrency(estimate.subtotal)}</p>
            </div>
            <div className="sm:text-right">
              <p className="text-sm text-brand-sand uppercase tracking-wide">Total Project Cost</p>
              <p className="text-3xl md:text-4xl font-bold mt-1">{formatCurrency(estimate.totalCost)}</p>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="p-6 bg-gray-50 border border-gray-200 text-sm text-brand-stone leading-relaxed">
          <p className="font-semibold text-brand-charcoal mb-2">Disclaimer</p>
          <p>
            This estimate is generated based on current average rates and is intended as a
            preliminary budget guide only. Actual costs may vary based on site conditions,
            material availability, local labor rates, and project-specific requirements.
            A detailed bid will be provided after plan review and site evaluation.
            Contact Akers Development for an official project consultation.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <button onClick={onBack} className="btn-secondary">
            New Estimate
          </button>
          <button
            onClick={() => window.print()}
            className="btn-primary"
          >
            Print Estimate
          </button>
        </div>
      </div>
    </div>
  );
}
