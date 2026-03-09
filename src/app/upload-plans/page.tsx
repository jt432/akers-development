'use client';

import { useState, useRef } from 'react';
import PageHero from '@/components/PageHero';
import FileUploader from '@/components/FileUploader';
import type { Estimate } from '@/lib/pricing';

const projectTypes = [
  'Custom Home Build',
  'Spec Home',
  'Duplex / Multi-Family',
  'Land Development',
  'Renovation',
  'Other',
];

const consultants = [
  { name: 'Jon Tyler Akers', title: 'Sr. Development Consultant & President' },
  { name: 'Tristan Gardner', title: 'Sr. Development Consultant' },
  { name: 'Jacob Wilson', title: 'Jr. Development Consultant' },
  { name: 'Dylan Scott', title: 'Jr. Development Consultant' },
  { name: 'Chapman Suggs', title: 'Jr. Development Consultant' },
];

function formatCurrency(n: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(n);
}

const categoryOrder = ['Foundation', 'Structure', 'Exterior', 'Interior', 'Mechanical', 'Site Work'];

function groupByCategory(items: Estimate['lineItems']) {
  const groups: Record<string, Estimate['lineItems']> = {};
  for (const item of items) {
    if (!groups[item.category]) groups[item.category] = [];
    groups[item.category].push(item);
  }
  return groups;
}

// ─── Quick Specs Form for manual input ───
interface QuickSpecs {
  projectName: string;
  heatedSqFt: number;
  shopSqFt: number;
  carportSqFt: number;
  porchSqFt: number;
  numBedrooms: number;
  numBathrooms: number;
  stories: 1 | 2;
  roofType: 'metal' | 'shingle';
  sidingType: 'metal' | 'vinyl' | 'brick';
  includeHVAC: boolean;
  includeSeptic: boolean;
  includeShopElectrical: boolean;
  flooringType: 'standard' | 'upgraded' | 'premium';
  cabinetGrade: 'budget' | 'mid' | 'premium';
}

export default function UploadPlansPage() {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const filesRef = useRef<File[]>([]);
  const formRef = useRef<HTMLFormElement>(null);

  // Estimate flow state
  const [analyzing, setAnalyzing] = useState(false);
  const [showSpecsForm, setShowSpecsForm] = useState(false);
  const [estimate, setEstimate] = useState<Estimate | null>(null);
  const [estimateError, setEstimateError] = useState('');

  // Quick specs state
  const [specs, setSpecs] = useState<QuickSpecs>({
    projectName: '',
    heatedSqFt: 2400,
    shopSqFt: 0,
    carportSqFt: 0,
    porchSqFt: 0,
    numBedrooms: 3,
    numBathrooms: 2,
    stories: 1,
    roofType: 'metal',
    sidingType: 'metal',
    includeHVAC: true,
    includeSeptic: true,
    includeShopElectrical: false,
    flooringType: 'standard',
    cabinetGrade: 'budget',
  });

  const updateSpec = (field: keyof QuickSpecs, value: any) => {
    setSpecs(prev => ({ ...prev, [field]: value }));
  };

  // ── Submit the upload form ──
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    const form = e.currentTarget;
    const formData = new FormData();

    formData.append('name', (form.elements.namedItem('name') as HTMLInputElement).value);
    formData.append('email', (form.elements.namedItem('email') as HTMLInputElement).value);
    formData.append('phone', (form.elements.namedItem('phone') as HTMLInputElement).value);
    formData.append('location', (form.elements.namedItem('location') as HTMLInputElement).value);
    formData.append('projectType', (form.elements.namedItem('projectType') as HTMLSelectElement).value);
    formData.append('squareFootage', (form.elements.namedItem('squareFootage') as HTMLInputElement).value);
    formData.append('description', (form.elements.namedItem('description') as HTMLTextAreaElement).value);
    formData.append('consultant', (form.elements.namedItem('consultant') as HTMLSelectElement).value);

    // Save project name for estimate
    const pName = (form.elements.namedItem('name') as HTMLInputElement).value + ' Project';
    setSpecs(prev => ({ ...prev, projectName: pName }));

    filesRef.current.forEach((file) => {
      formData.append('files', file);
    });

    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Submission failed');
      setSubmitted(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // ── Try analyzing uploaded PDFs ──
  const handleAnalyzePlans = async () => {
    setAnalyzing(true);
    setEstimateError('');

    try {
      const hasPdf = filesRef.current.some(f => f.name.toLowerCase().endsWith('.pdf'));

      if (!hasPdf) {
        // No PDFs, go straight to manual form
        setShowSpecsForm(true);
        setAnalyzing(false);
        return;
      }

      // Try PDF analysis first
      const formData = new FormData();
      filesRef.current.forEach(file => formData.append('files', file));
      formData.append('projectName', specs.projectName);

      const res = await fetch('/api/analyze-plans', { method: 'POST', body: formData });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Analysis failed');

      if (data.needsManualInput) {
        // Image-based PDFs — show the specs form
        setShowSpecsForm(true);
      } else if (data.estimate) {
        // Auto-extracted — show the estimate directly
        setEstimate(data.estimate);
      }
    } catch (err: unknown) {
      // On any error, fall back to manual specs form
      setShowSpecsForm(true);
    } finally {
      setAnalyzing(false);
    }
  };

  // ── Generate estimate from manual specs ──
  const handleGenerateEstimate = async () => {
    setAnalyzing(true);
    setEstimateError('');

    try {
      const res = await fetch('/api/analyze-plans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(specs),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Calculation failed');
      setEstimate(data.estimate);
    } catch (err: unknown) {
      setEstimateError(err instanceof Error ? err.message : 'Failed to generate estimate.');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setEstimate(null);
    setShowSpecsForm(false);
    setEstimateError('');
    filesRef.current = [];
    formRef.current?.reset();
  };

  // ═══════════════════════════════════════════════
  //  VIEW 3: ESTIMATE RESULTS
  // ═══════════════════════════════════════════════
  if (estimate) {
    const grouped = groupByCategory(estimate.lineItems);

    return (
      <>
        <PageHero label="Cost Estimate" title="Your Preliminary Cost Estimate" />
        <section className="section-padding bg-white">
          <div className="container-narrow">
            {/* Summary Header */}
            <div className="bg-brand-dark text-white p-8 md:p-12 mb-10">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div>
                  <p className="text-xs tracking-[0.25em] uppercase text-brand-sand mb-2">Estimate For</p>
                  <h2 className="text-2xl md:text-3xl font-bold text-white">{estimate.projectName}</h2>
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
                      <h3 className="font-semibold text-brand-charcoal uppercase tracking-wide text-sm">{cat}</h3>
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
                  <h3 className="font-semibold text-brand-charcoal uppercase tracking-wide text-sm">Consulting Fee</h3>
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
              <div className="bg-brand-dark text-white p-8">
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
                <p className="font-semibold text-brand-charcoal mb-2">Preliminary Estimate Disclaimer</p>
                <p>
                  This estimate is based on current average rates and is intended as a
                  preliminary budget guide only. Actual costs may vary based on site conditions,
                  material availability, local labor rates, finish selections, and project-specific
                  requirements. Your assigned consultant will provide a detailed bid after a full
                  plan review and site evaluation.
                </p>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button onClick={handleReset} className="btn-secondary">Submit Another Project</button>
                <button onClick={() => window.print()} className="btn-primary">Print Estimate</button>
              </div>
            </div>
          </div>
        </section>
      </>
    );
  }

  // ═══════════════════════════════════════════════
  //  VIEW 2b: QUICK SPECS FORM (manual fallback)
  // ═══════════════════════════════════════════════
  if (submitted && showSpecsForm) {
    return (
      <>
        <PageHero label="Cost Estimate" title="Enter Your Project Specs" />
        <section className="section-padding bg-white">
          <div className="container-narrow">
            <div className="bg-brand-cream p-6 mb-8 border-l-4 border-brand-stone">
              <p className="text-sm text-brand-slate leading-relaxed">
                Enter the details from your building plans below and we&apos;ll calculate
                an instant cost estimate. You can find most of this information on your
                floor plan sheet (typically labeled A3 or the sheet with the area table).
              </p>
            </div>

            <div className="space-y-8">
              {/* Project Name */}
              <div>
                <label className="block text-sm font-medium text-brand-charcoal mb-2 uppercase tracking-wide">
                  Project Name
                </label>
                <input
                  type="text"
                  value={specs.projectName}
                  onChange={e => updateSpec('projectName', e.target.value)}
                  className="input-field"
                  placeholder="e.g. McAdams Residence"
                />
              </div>

              {/* Square Footage */}
              <div>
                <h3 className="heading-sm mb-4 pb-3 border-b border-gray-200">Square Footage</h3>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-brand-slate mb-1 uppercase tracking-wide">
                      Heated Area *
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={specs.heatedSqFt || ''}
                        onChange={e => updateSpec('heatedSqFt', parseInt(e.target.value) || 0)}
                        className="input-field pr-12"
                        min={100}
                        required
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">sq ft</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-brand-slate mb-1 uppercase tracking-wide">
                      Shop / Garage
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={specs.shopSqFt || ''}
                        onChange={e => updateSpec('shopSqFt', parseInt(e.target.value) || 0)}
                        className="input-field pr-12"
                        min={0}
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">sq ft</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-brand-slate mb-1 uppercase tracking-wide">
                      Carport
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={specs.carportSqFt || ''}
                        onChange={e => updateSpec('carportSqFt', parseInt(e.target.value) || 0)}
                        className="input-field pr-12"
                        min={0}
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">sq ft</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-brand-slate mb-1 uppercase tracking-wide">
                      Porch
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={specs.porchSqFt || ''}
                        onChange={e => updateSpec('porchSqFt', parseInt(e.target.value) || 0)}
                        className="input-field pr-12"
                        min={0}
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">sq ft</span>
                    </div>
                  </div>
                </div>
                <div className="mt-3 p-3 bg-gray-50 rounded text-sm">
                  <span className="text-brand-stone">Total Under Roof: </span>
                  <span className="font-semibold text-brand-charcoal">
                    {(specs.heatedSqFt + specs.shopSqFt + specs.carportSqFt + specs.porchSqFt).toLocaleString()} sq ft
                  </span>
                </div>
              </div>

              {/* Rooms & Structure */}
              <div>
                <h3 className="heading-sm mb-4 pb-3 border-b border-gray-200">Rooms &amp; Structure</h3>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-brand-slate mb-1 uppercase tracking-wide">Bedrooms</label>
                    <select value={specs.numBedrooms} onChange={e => updateSpec('numBedrooms', parseInt(e.target.value))} className="input-field">
                      {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-brand-slate mb-1 uppercase tracking-wide">Bathrooms</label>
                    <select value={specs.numBathrooms} onChange={e => updateSpec('numBathrooms', parseInt(e.target.value))} className="input-field">
                      {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-brand-slate mb-1 uppercase tracking-wide">Stories</label>
                    <select value={specs.stories} onChange={e => updateSpec('stories', parseInt(e.target.value))} className="input-field">
                      <option value={1}>1 Story</option>
                      <option value={2}>2 Story</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Exterior */}
              <div>
                <h3 className="heading-sm mb-4 pb-3 border-b border-gray-200">Exterior</h3>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-brand-slate mb-1 uppercase tracking-wide">Roof</label>
                    <select value={specs.roofType} onChange={e => updateSpec('roofType', e.target.value)} className="input-field">
                      <option value="metal">Metal</option>
                      <option value="shingle">Shingle</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-brand-slate mb-1 uppercase tracking-wide">Siding</label>
                    <select value={specs.sidingType} onChange={e => updateSpec('sidingType', e.target.value)} className="input-field">
                      <option value="metal">Metal</option>
                      <option value="vinyl">Vinyl</option>
                      <option value="brick">Brick</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Interior */}
              <div>
                <h3 className="heading-sm mb-4 pb-3 border-b border-gray-200">Interior Selections</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-brand-slate mb-1 uppercase tracking-wide">Flooring</label>
                    <select value={specs.flooringType} onChange={e => updateSpec('flooringType', e.target.value)} className="input-field">
                      <option value="standard">Standard</option>
                      <option value="upgraded">Upgraded (LVP / Mid-Grade)</option>
                      <option value="premium">Premium (Hardwood / Tile)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-brand-slate mb-1 uppercase tracking-wide">Cabinets &amp; Countertops</label>
                    <select value={specs.cabinetGrade} onChange={e => updateSpec('cabinetGrade', e.target.value)} className="input-field">
                      <option value="budget">Budget ($15,000)</option>
                      <option value="mid">Mid-Grade ($22,000)</option>
                      <option value="premium">Premium ($35,000)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Systems */}
              <div>
                <h3 className="heading-sm mb-4 pb-3 border-b border-gray-200">Systems</h3>
                <div className="flex flex-wrap gap-4">
                  <label className="flex items-center gap-2 p-3 border border-gray-200 cursor-pointer hover:border-brand-stone transition-colors">
                    <input type="checkbox" checked={specs.includeHVAC} onChange={e => updateSpec('includeHVAC', e.target.checked)} className="w-4 h-4 accent-brand-charcoal" />
                    <span className="text-sm font-medium text-brand-charcoal uppercase tracking-wide">HVAC</span>
                  </label>
                  <label className="flex items-center gap-2 p-3 border border-gray-200 cursor-pointer hover:border-brand-stone transition-colors">
                    <input type="checkbox" checked={specs.includeSeptic} onChange={e => updateSpec('includeSeptic', e.target.checked)} className="w-4 h-4 accent-brand-charcoal" />
                    <span className="text-sm font-medium text-brand-charcoal uppercase tracking-wide">Septic</span>
                  </label>
                  <label className="flex items-center gap-2 p-3 border border-gray-200 cursor-pointer hover:border-brand-stone transition-colors">
                    <input type="checkbox" checked={specs.includeShopElectrical} onChange={e => updateSpec('includeShopElectrical', e.target.checked)} className="w-4 h-4 accent-brand-charcoal" />
                    <span className="text-sm font-medium text-brand-charcoal uppercase tracking-wide">Shop Electrical</span>
                  </label>
                </div>
              </div>

              {/* Error */}
              {estimateError && (
                <div className="bg-red-50 border border-red-200 p-4">
                  <p className="text-sm text-red-600">{estimateError}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-gray-200">
                <button
                  onClick={handleGenerateEstimate}
                  disabled={analyzing || !specs.heatedSqFt}
                  className="btn-accent text-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {analyzing ? (
                    <span className="flex items-center gap-3">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Calculating...
                    </span>
                  ) : 'Generate Cost Estimate'}
                </button>
                <button onClick={handleReset} className="btn-secondary">Start Over</button>
              </div>
            </div>
          </div>
        </section>
      </>
    );
  }

  // ═══════════════════════════════════════════════
  //  VIEW 2a: POST-SUBMISSION (plans received + estimate button)
  // ═══════════════════════════════════════════════
  if (submitted) {
    return (
      <>
        <PageHero label="Upload Plans" title="Upload Your Plans for a Preliminary Cost Review" />
        <section className="section-padding bg-white">
          <div className="container-narrow text-center">
            <div className="bg-brand-cream p-12">
              <svg className="w-16 h-16 text-brand-accent mx-auto mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h2 className="heading-md mb-4">Plans Received</h2>
              <p className="body-lg mb-8">
                Thank you for submitting your project details. Your assigned consultant
                will review your plans and follow up with you directly.
              </p>

              {/* Generate Estimate CTA */}
              <div className="bg-white p-8 border-2 border-brand-stone mb-8 text-left sm:text-center">
                <svg className="w-12 h-12 text-brand-stone mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                <h3 className="heading-sm mb-3">Want to See a Cost Estimate?</h3>
                <p className="body-md text-sm mb-6 max-w-lg mx-auto">
                  Get an instant preliminary construction cost breakdown
                  based on your project details.
                </p>

                {estimateError && (
                  <div className="bg-red-50 border border-red-200 p-4 mb-4">
                    <p className="text-sm text-red-600">{estimateError}</p>
                  </div>
                )}

                <button
                  onClick={handleAnalyzePlans}
                  disabled={analyzing}
                  className="btn-accent text-center justify-center disabled:opacity-50"
                >
                  {analyzing ? (
                    <span className="flex items-center gap-3">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Analyzing Plans...
                    </span>
                  ) : 'Generate Cost Estimate'}
                </button>
              </div>

              <button onClick={handleReset} className="btn-secondary">
                Submit Another Project
              </button>
            </div>
          </div>
        </section>
      </>
    );
  }

  // ═══════════════════════════════════════════════
  //  VIEW 1: UPLOAD FORM
  // ═══════════════════════════════════════════════
  return (
    <>
      <PageHero
        label="Upload Plans"
        title="Upload Your Plans for a Preliminary Cost Review"
        description="Submit your building plans and project details. We'll review them and provide an early budgeting range and project insight — plus an instant cost estimate."
      />

      <section className="section-padding bg-white">
        <div className="container-narrow">
          <form ref={formRef} onSubmit={handleSubmit} className="space-y-8">
            {/* Contact Info */}
            <div>
              <h3 className="heading-sm mb-6">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-brand-charcoal mb-1">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input id="name" name="name" type="text" required className="input-field" placeholder="Your full name" />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-brand-charcoal mb-1">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input id="email" name="email" type="email" required className="input-field" placeholder="you@email.com" />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-brand-charcoal mb-1">Phone</label>
                  <input id="phone" name="phone" type="tel" className="input-field" placeholder="(555) 123-4567" />
                </div>
                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-brand-charcoal mb-1">
                    Project Location <span className="text-red-500">*</span>
                  </label>
                  <input id="location" name="location" type="text" required className="input-field" placeholder="City, State or County" />
                </div>
              </div>
            </div>

            {/* Project Details */}
            <div>
              <h3 className="heading-sm mb-6">Project Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="projectType" className="block text-sm font-medium text-brand-charcoal mb-1">
                    Type of Project <span className="text-red-500">*</span>
                  </label>
                  <select id="projectType" name="projectType" required className="input-field">
                    <option value="">Select project type</option>
                    {projectTypes.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="squareFootage" className="block text-sm font-medium text-brand-charcoal mb-1">
                    Estimated Square Footage
                  </label>
                  <input id="squareFootage" name="squareFootage" type="text" className="input-field" placeholder="e.g. 2,400 sq ft" />
                </div>
              </div>
              <div className="mt-4">
                <label htmlFor="description" className="block text-sm font-medium text-brand-charcoal mb-1">
                  Short Project Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  required
                  rows={5}
                  className="input-field"
                  placeholder="Describe your project — what you want to build, the stage you're at, any specific questions you have..."
                />
              </div>
            </div>

            {/* Consultant Selection */}
            <div>
              <h3 className="heading-sm mb-6">Select Your Consultant</h3>
              <p className="body-md text-sm mb-4">
                Choose which development consultant you&apos;d like to work with on your project.
              </p>
              <select id="consultant" name="consultant" required className="input-field">
                <option value="">Select a consultant</option>
                {consultants.map((c) => (
                  <option key={c.name} value={c.name}>
                    {c.name} — {c.title}
                  </option>
                ))}
              </select>
            </div>

            {/* File Upload */}
            <div>
              <h3 className="heading-sm mb-4">Upload Plans &amp; Documents</h3>
              <p className="text-sm text-brand-stone mb-4">
                Upload your building plans as PDF files. After submission, you&apos;ll be able to
                generate an instant cost estimate.
              </p>
              <FileUploader onFilesChange={(files) => { filesRef.current = files; }} />
            </div>

            {/* Disclaimer */}
            <div className="bg-brand-cream p-6 border-l-4 border-brand-stone">
              <p className="text-sm text-brand-slate leading-relaxed">
                <strong>Preliminary Estimate Disclaimer:</strong> This review is intended
                to provide an early budgeting range and project insight and should not be
                considered a final construction contract price.
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-50 border border-red-200 p-4">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              className="btn-primary w-full justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Submitting...' : 'Submit for Review'}
            </button>
          </form>
        </div>
      </section>
    </>
  );
}
