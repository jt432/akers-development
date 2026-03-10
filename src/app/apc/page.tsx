'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  calculatePrice,
  SERVICE_LABELS,
  SERVICE_DESCRIPTIONS,
  FREQUENCY_LABELS,
  CONDITION_LABELS,
  type ServiceType,
  type Frequency,
  type Condition,
  type AddOns,
  type PricingInput,
} from '@/lib/apc-pricing';

// ─── Stepper Component ───
function Stepper({
  label,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-brand-charcoal mb-2">{label}</label>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => onChange(Math.max(min, value - 1))}
          className="w-9 h-9 flex items-center justify-center border border-gray-200 text-brand-charcoal hover:bg-gray-50 transition-colors text-lg font-medium"
        >
          &minus;
        </button>
        <span className="w-8 text-center font-semibold text-brand-charcoal">{value}</span>
        <button
          type="button"
          onClick={() => onChange(Math.min(max, value + 1))}
          className="w-9 h-9 flex items-center justify-center border border-gray-200 text-brand-charcoal hover:bg-gray-50 transition-colors text-lg font-medium"
        >
          +
        </button>
      </div>
    </div>
  );
}

export default function APCPage() {
  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');

  // Pricing state
  const [serviceType, setServiceType] = useState<ServiceType>('standard');
  const [sqft, setSqft] = useState(1500);
  const [bedrooms, setBedrooms] = useState(3);
  const [bathrooms, setBathrooms] = useState(2);
  const [pets, setPets] = useState(0);
  const [occupants, setOccupants] = useState(2);
  const [condition, setCondition] = useState<Condition>(2);
  const [frequency, setFrequency] = useState<Frequency>('biweekly');
  const [addOns, setAddOns] = useState<AddOns>({
    fridge: false,
    oven: false,
    laundry: false,
    windows: 0,
    garage: false,
    cabinets: false,
  });

  // UI state
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  // Calculate price in real-time
  const pricingInput: PricingInput = useMemo(
    () => ({
      serviceType,
      sqft,
      bedrooms,
      bathrooms,
      pets,
      occupants,
      condition,
      frequency,
      addOns,
    }),
    [serviceType, sqft, bedrooms, bathrooms, pets, occupants, condition, frequency, addOns]
  );

  const pricing = useMemo(() => calculatePrice(pricingInput), [pricingInput]);

  const toggleAddOn = (key: keyof Omit<AddOns, 'windows'>) => {
    setAddOns((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const canSubmit = name && email && location && sqft > 0;

  const handleSubmit = async () => {
    setSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/apc-quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          // Contact
          name,
          email,
          phone,
          location,
          notes,
          // Pricing input (server recalculates)
          serviceType,
          sqft,
          bedrooms,
          bathrooms,
          pets,
          occupants,
          condition,
          frequency,
          addOns,
        }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Submission failed');
      setSubmitted(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {/* ─── Hero ─── */}
      <section className="relative bg-brand-dark min-h-[60vh] flex items-center">
        <div className="absolute inset-0 bg-gradient-to-r from-brand-dark via-brand-dark/90 to-brand-dark/70" />
        <div className="relative z-10 section-padding container-wide">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-brand-sand hover:text-white transition-colors mb-8"
          >
            &larr; Back to Akers Development
          </Link>
          <div className="flex items-center gap-6 mb-6">
            <div className="flex items-center justify-center w-16 h-16 border-2 border-brand-sand/30 rounded-full">
              <div className="text-center">
                <span className="block font-serif text-white text-lg tracking-[0.15em]">APC</span>
              </div>
            </div>
            <div>
              <span className="block text-xs tracking-[0.25em] uppercase font-semibold text-brand-sand">
                An Akers Development Company
              </span>
              <h1 className="heading-xl text-white">Akers Property Care</h1>
            </div>
          </div>
          <p className="text-xl md:text-2xl text-gray-300 max-w-2xl leading-relaxed">
            Professional cleaning services for residential, commercial, and
            post-construction properties.
          </p>
        </div>
      </section>

      {/* ─── Services ─── */}
      <section className="section-padding bg-white">
        <div className="container-wide">
          <div className="max-w-2xl mb-12">
            <span className="text-xs tracking-[0.25em] uppercase font-semibold text-brand-stone mb-4 block">
              Our Services
            </span>
            <h2 className="heading-lg mb-4">What We Do</h2>
            <p className="body-md">
              From the final sweep on a new build to keeping your home spotless,
              Akers Property Care delivers consistent, professional results.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Post-Construction Cleanup',
                desc: 'Complete cleanup of new builds and renovation sites — dust removal, window cleaning, debris hauling, and final detailing so the property is move-in ready.',
                icon: (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                  </svg>
                ),
              },
              {
                title: 'Residential Cleaning',
                desc: 'Recurring or one-time home cleaning services — standard cleans, deep cleans, and move-in / move-out packages tailored to your needs.',
                icon: (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                  </svg>
                ),
              },
              {
                title: 'Commercial Cleaning',
                desc: 'Offices, retail spaces, and commercial properties kept clean and professional. Flexible scheduling that works around your business hours.',
                icon: (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
                  </svg>
                ),
              },
            ].map((service) => (
              <div key={service.title} className="card group">
                <div className="text-brand-stone mb-4 group-hover:text-brand-accent transition-colors">
                  {service.icon}
                </div>
                <h3 className="heading-sm mb-3">{service.title}</h3>
                <p className="body-md text-sm">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Why APC ─── */}
      <section className="section-padding bg-brand-cream">
        <div className="container-wide">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-xs tracking-[0.25em] uppercase font-semibold text-brand-stone mb-4 block">
                Why Akers Property Care
              </span>
              <h2 className="heading-lg mb-6">Same Team. Same Standards.</h2>
              <p className="body-md mb-6">
                Akers Property Care operates under the Akers Development umbrella, which means
                the same attention to detail that goes into planning and building a project carries
                over to maintaining it. Whether it&apos;s the final cleanup on a new construction
                site or keeping a property in top shape, we treat every job with the same level of care.
              </p>
              <div className="grid grid-cols-2 gap-6">
                {[
                  { stat: 'Insured', label: 'Full liability coverage' },
                  { stat: 'Reliable', label: 'Consistent scheduling' },
                  { stat: 'Detailed', label: 'Thorough every time' },
                  { stat: 'Flexible', label: 'Custom service plans' },
                ].map((item) => (
                  <div key={item.stat}>
                    <p className="font-semibold text-brand-charcoal">{item.stat}</p>
                    <p className="text-sm text-brand-stone">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-brand-dark p-10 lg:p-12">
              <h3 className="heading-sm text-white mb-6">Services Include</h3>
              <ul className="space-y-4">
                {[
                  'Post-construction dust & debris removal',
                  'Window & glass cleaning',
                  'Floor cleaning & polishing',
                  'Kitchen & bathroom deep sanitization',
                  'Recurring home cleaning programs',
                  'Move-in / move-out cleaning',
                  'Office & commercial space maintenance',
                  'Carpet & upholstery cleaning',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-gray-300 text-sm">
                    <span className="w-1.5 h-1.5 bg-brand-sand rounded-full mt-1.5 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Pricing Calculator ─── */}
      <section id="quote" className="section-padding bg-white">
        <div className="container-wide">
          <div className="max-w-2xl mb-12">
            <span className="text-xs tracking-[0.25em] uppercase font-semibold text-brand-stone mb-4 block">
              Instant Pricing
            </span>
            <h2 className="heading-lg mb-4">Build Your Cleaning Quote</h2>
            <p className="body-md">
              Select your services, enter your property details, and see your price update in real time.
              When you&apos;re ready, submit your order and we&apos;ll get it scheduled.
            </p>
          </div>

          {submitted ? (
            <div className="max-w-xl mx-auto bg-brand-cream p-12 text-center">
              <svg className="w-16 h-16 text-brand-accent mx-auto mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h2 className="heading-md mb-4">Booking Received!</h2>
              <p className="body-md mb-2">
                Your cleaning order for <strong>${pricing.total.toFixed(2)}</strong> has been submitted.
              </p>
              <p className="body-md mb-6 text-brand-stone">
                We&apos;ll confirm your appointment shortly.
              </p>
              <button onClick={() => setSubmitted(false)} className="btn-secondary">
                Book Another Cleaning
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              {/* ─── Left: Form Inputs ─── */}
              <div className="lg:col-span-2 space-y-10">

                {/* 1. Service Type */}
                <div>
                  <h3 className="text-sm font-semibold text-brand-charcoal uppercase tracking-wide mb-4">
                    1. Service Type
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {((['standard', 'deep', 'post-construction'] as ServiceType[]).map((key) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setServiceType(key)}
                        className={`p-5 border-2 text-left transition-all ${
                          serviceType === key
                            ? 'border-brand-accent bg-brand-accent/5'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <p className="font-semibold text-brand-charcoal text-sm">{SERVICE_LABELS[key]}</p>
                        <p className="text-xs text-brand-stone mt-1">{SERVICE_DESCRIPTIONS[key].tagline}</p>
                      </button>
                    )))}
                  </div>

                  {/* What's included in this service */}
                  <div className="mt-4 bg-gray-50 border border-gray-200 p-5">
                    <p className="text-xs font-semibold text-brand-charcoal uppercase tracking-wide mb-3">
                      {SERVICE_LABELS[serviceType]} Includes:
                    </p>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5">
                      {SERVICE_DESCRIPTIONS[serviceType].includes.map((item) => (
                        <li key={item} className="flex items-start gap-2 text-sm text-brand-stone">
                          <span className="text-brand-accent mt-0.5">&#10003;</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* 2. Property Details */}
                <div>
                  <h3 className="text-sm font-semibold text-brand-charcoal uppercase tracking-wide mb-4">
                    2. Property Details
                  </h3>
                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium text-brand-charcoal mb-2">
                        Square Footage <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        value={sqft || ''}
                        onChange={(e) => setSqft(Math.max(0, parseInt(e.target.value) || 0))}
                        className="input-field max-w-xs"
                        placeholder="e.g. 2000"
                        min={100}
                        max={20000}
                      />
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
                      <Stepper label="Bedrooms" value={bedrooms} min={1} max={8} onChange={setBedrooms} />
                      <Stepper label="Bathrooms" value={bathrooms} min={1} max={8} onChange={setBathrooms} />
                      <Stepper label="Occupants" value={occupants} min={1} max={10} onChange={setOccupants} />
                      <Stepper label="Pets" value={pets} min={0} max={6} onChange={setPets} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-brand-charcoal mb-2">
                        Property Condition
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {([1, 2, 3, 4, 5] as Condition[]).map((c) => (
                          <button
                            key={c}
                            type="button"
                            onClick={() => setCondition(c)}
                            className={`px-4 py-2 text-xs border-2 transition-all ${
                              condition === c
                                ? 'border-brand-accent bg-brand-accent/5 font-semibold'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            {c} &mdash; {CONDITION_LABELS[c]}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. Frequency */}
                <div>
                  <h3 className="text-sm font-semibold text-brand-charcoal uppercase tracking-wide mb-4">
                    3. Frequency
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {(
                      [
                        { key: 'one-time' as Frequency, discount: null },
                        { key: 'weekly' as Frequency, discount: '15% off' },
                        { key: 'biweekly' as Frequency, discount: '10% off' },
                        { key: 'monthly' as Frequency, discount: '5% off' },
                      ] as const
                    ).map((f) => (
                      <button
                        key={f.key}
                        type="button"
                        onClick={() => setFrequency(f.key)}
                        className={`relative p-4 border-2 text-center transition-all ${
                          frequency === f.key
                            ? 'border-brand-accent bg-brand-accent/5'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <p className="font-semibold text-sm text-brand-charcoal">{FREQUENCY_LABELS[f.key]}</p>
                        {f.discount && (
                          <span className="inline-block mt-1 text-xs text-brand-accent font-semibold">
                            {f.discount}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 4. Add-Ons */}
                <div>
                  <h3 className="text-sm font-semibold text-brand-charcoal uppercase tracking-wide mb-4">
                    4. Add-On Services
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {[
                      { key: 'fridge' as const, label: 'Inside Fridge', price: '$35' },
                      { key: 'oven' as const, label: 'Inside Oven', price: '$40' },
                      { key: 'laundry' as const, label: 'Laundry (Wash/Dry/Fold)', price: '$30' },
                      { key: 'garage' as const, label: 'Garage / Carport Sweep', price: '$25' },
                      { key: 'cabinets' as const, label: 'Cabinet Interior Wipe-Down', price: '$50' },
                    ].map((addon) => (
                      <button
                        key={addon.key}
                        type="button"
                        onClick={() => toggleAddOn(addon.key)}
                        className={`flex items-center justify-between p-4 border-2 text-left transition-all ${
                          addOns[addon.key]
                            ? 'border-brand-accent bg-brand-accent/5'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div>
                          <p className="text-sm font-medium text-brand-charcoal">{addon.label}</p>
                          <p className="text-xs text-brand-stone mt-0.5">{addon.price}</p>
                        </div>
                        <div
                          className={`w-5 h-5 border-2 flex items-center justify-center flex-shrink-0 ${
                            addOns[addon.key]
                              ? 'border-brand-accent bg-brand-accent'
                              : 'border-gray-300'
                          }`}
                        >
                          {addOns[addon.key] && (
                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                      </button>
                    ))}

                    {/* Windows — special: has count input */}
                    <div
                      className={`p-4 border-2 transition-all ${
                        addOns.windows > 0
                          ? 'border-brand-accent bg-brand-accent/5'
                          : 'border-gray-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-brand-charcoal">Interior Windows</p>
                          <p className="text-xs text-brand-stone mt-0.5">$5 / window</p>
                        </div>
                      </div>
                      <div className="mt-3 flex items-center gap-2">
                        <input
                          type="number"
                          min={0}
                          max={50}
                          value={addOns.windows || ''}
                          onChange={(e) =>
                            setAddOns((prev) => ({
                              ...prev,
                              windows: Math.max(0, Math.min(50, parseInt(e.target.value) || 0)),
                            }))
                          }
                          className="input-field w-20 text-center"
                          placeholder="0"
                        />
                        <span className="text-xs text-brand-stone">windows</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 5. Contact & Location */}
                <div>
                  <h3 className="text-sm font-semibold text-brand-charcoal uppercase tracking-wide mb-4">
                    5. Your Information
                  </h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-brand-charcoal mb-1">
                          Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="input-field"
                          placeholder="Your full name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-brand-charcoal mb-1">
                          Email <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="input-field"
                          placeholder="you@email.com"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-brand-charcoal mb-1">Phone</label>
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="input-field"
                          placeholder="(555) 123-4567"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-brand-charcoal mb-1">
                          Location <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          className="input-field"
                          placeholder="City, State"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-brand-charcoal mb-1">
                        Additional Notes
                      </label>
                      <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        rows={3}
                        className="input-field"
                        placeholder="Gate codes, parking instructions, specific areas of focus, etc."
                      />
                    </div>
                  </div>
                </div>

                {/* Submit (mobile only — desktop uses the sticky sidebar) */}
                <div className="lg:hidden">
                  {error && (
                    <div className="bg-red-50 border border-red-200 p-4 mb-4">
                      <p className="text-sm text-red-600">{error}</p>
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={submitting || !canSubmit}
                    className="btn-primary w-full justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? 'Submitting...' : `Book This Cleaning — $${pricing.total.toFixed(2)}`}
                  </button>
                </div>
              </div>

              {/* ─── Right: Sticky Price Summary ─── */}
              <div className="hidden lg:block">
                <div className="sticky top-28">
                  <div className="bg-brand-cream border border-gray-200 p-6">
                    <h3 className="text-sm font-semibold text-brand-charcoal uppercase tracking-wide mb-4">
                      Your Quote
                    </h3>

                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-brand-stone">{SERVICE_LABELS[serviceType]}</span>
                        <span className="font-medium">${pricing.basePrice.toFixed(2)}</span>
                      </div>

                      {pricing.adjusterTotal > 0 && (
                        <div className="flex justify-between">
                          <span className="text-brand-stone">Property adjustments</span>
                          <span className="font-medium">+${pricing.adjusterTotal.toFixed(2)}</span>
                        </div>
                      )}

                      {pricing.addOnTotal > 0 && (
                        <div className="flex justify-between">
                          <span className="text-brand-stone">Add-ons</span>
                          <span className="font-medium">+${pricing.addOnTotal.toFixed(2)}</span>
                        </div>
                      )}

                      {pricing.discountAmount > 0 && (
                        <div className="flex justify-between text-brand-accent">
                          <span>{FREQUENCY_LABELS[frequency]} discount</span>
                          <span className="font-medium">-${pricing.discountAmount.toFixed(2)}</span>
                        </div>
                      )}

                      <hr className="border-gray-300" />

                      <div className="flex justify-between text-lg font-bold text-brand-charcoal">
                        <span>Total per visit</span>
                        <span>${pricing.total.toFixed(2)}</span>
                      </div>

                      <div className="flex justify-between text-xs text-brand-stone">
                        <span>Estimated duration</span>
                        <span>{pricing.estimatedHours.toFixed(1)} hours</span>
                      </div>
                    </div>

                    <div className="mt-6">
                      {error && (
                        <div className="bg-red-50 border border-red-200 p-3 mb-3">
                          <p className="text-xs text-red-600">{error}</p>
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={submitting || !canSubmit}
                        className="btn-primary w-full justify-center disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                      >
                        {submitting ? 'Submitting...' : 'Book This Cleaning'}
                      </button>
                      {!canSubmit && (
                        <p className="text-xs text-brand-stone mt-2 text-center">
                          Fill in name, email, location &amp; square footage to continue.
                        </p>
                      )}
                    </div>

                    {/* Breakdown toggle */}
                    <details className="mt-4">
                      <summary className="text-xs text-brand-stone cursor-pointer hover:text-brand-charcoal">
                        View full breakdown
                      </summary>
                      <ul className="mt-2 space-y-1">
                        {pricing.breakdown.map((line, i) => (
                          <li key={i} className="text-xs text-brand-stone">{line}</li>
                        ))}
                      </ul>
                    </details>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
