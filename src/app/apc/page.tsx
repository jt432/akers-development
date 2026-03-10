'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';

const serviceTypes = [
  'Post-Construction Cleanup',
  'Residential Cleaning',
  'Commercial Cleaning',
  'Move-In / Move-Out Clean',
  'Deep Clean',
  'Other',
];

const propertyTypes = [
  'Single-Family Home',
  'Apartment / Condo',
  'Townhome / Duplex',
  'Office / Retail',
  'New Construction Site',
  'Other',
];

export default function APCPage() {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    const form = e.currentTarget;
    const data = {
      name: (form.elements.namedItem('name') as HTMLInputElement).value,
      email: (form.elements.namedItem('email') as HTMLInputElement).value,
      phone: (form.elements.namedItem('phone') as HTMLInputElement).value,
      serviceType: (form.elements.namedItem('serviceType') as HTMLSelectElement).value,
      propertyType: (form.elements.namedItem('propertyType') as HTMLSelectElement).value,
      squareFootage: (form.elements.namedItem('squareFootage') as HTMLInputElement).value,
      location: (form.elements.namedItem('location') as HTMLInputElement).value,
      details: (form.elements.namedItem('details') as HTMLTextAreaElement).value,
    };

    try {
      const res = await fetch('/api/apc-quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Submission failed');
      setSubmitted(true);
      formRef.current?.reset();
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

      {/* ─── Quote Form ─── */}
      <section id="quote" className="section-padding bg-white">
        <div className="container-wide grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div>
            <span className="text-xs tracking-[0.25em] uppercase font-semibold text-brand-stone mb-4 block">
              Get Started
            </span>
            <h2 className="heading-lg mb-4">Request a Quote</h2>
            <p className="body-md mb-8">
              Fill out the form and we&apos;ll get back to you with a quote for your
              cleaning project. No obligations, no pressure — just straightforward pricing.
            </p>

            <div className="space-y-6">
              <div className="border border-gray-100 p-5">
                <p className="text-sm font-medium text-brand-charcoal">Email</p>
                <a href="mailto:jt@akers-development.com" className="text-brand-accent hover:underline text-sm">
                  jt@akers-development.com
                </a>
              </div>
              <div className="border border-gray-100 p-5">
                <p className="text-sm font-medium text-brand-charcoal">Part of the Akers Family</p>
                <p className="text-sm text-brand-stone mt-1">
                  Akers Property Care is a division of Akers Development — the same
                  team trusted to build and manage development projects across Mississippi.
                </p>
                <Link href="/" className="text-sm text-brand-accent hover:underline mt-2 inline-block">
                  Learn about Akers Development &rarr;
                </Link>
              </div>
            </div>
          </div>

          <div>
            {submitted ? (
              <div className="bg-brand-cream p-12 text-center">
                <svg className="w-16 h-16 text-brand-accent mx-auto mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h2 className="heading-md mb-4">Quote Request Received</h2>
                <p className="body-md mb-6">
                  Thank you for your interest. We&apos;ll review your request and get
                  back to you with a quote shortly.
                </p>
                <button onClick={() => setSubmitted(false)} className="btn-secondary">
                  Submit Another Request
                </button>
              </div>
            ) : (
              <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
                {/* Contact */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-brand-charcoal mb-1">Phone</label>
                    <input id="phone" name="phone" type="tel" className="input-field" placeholder="(555) 123-4567" />
                  </div>
                  <div>
                    <label htmlFor="location" className="block text-sm font-medium text-brand-charcoal mb-1">
                      Location <span className="text-red-500">*</span>
                    </label>
                    <input id="location" name="location" type="text" required className="input-field" placeholder="City, State" />
                  </div>
                </div>

                {/* Service Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="serviceType" className="block text-sm font-medium text-brand-charcoal mb-1">
                      Service Type <span className="text-red-500">*</span>
                    </label>
                    <select id="serviceType" name="serviceType" required className="input-field">
                      <option value="">Select service</option>
                      {serviceTypes.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="propertyType" className="block text-sm font-medium text-brand-charcoal mb-1">
                      Property Type
                    </label>
                    <select id="propertyType" name="propertyType" className="input-field">
                      <option value="">Select type</option>
                      {propertyTypes.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="squareFootage" className="block text-sm font-medium text-brand-charcoal mb-1">
                    Estimated Square Footage
                  </label>
                  <input id="squareFootage" name="squareFootage" type="text" className="input-field" placeholder="e.g. 2,400 sq ft" />
                </div>

                <div>
                  <label htmlFor="details" className="block text-sm font-medium text-brand-charcoal mb-1">
                    Additional Details
                  </label>
                  <textarea
                    id="details"
                    name="details"
                    rows={4}
                    className="input-field"
                    placeholder="Tell us about the property, any specific requirements, preferred schedule, etc."
                  />
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 p-4">
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary w-full justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Submitting...' : 'Request a Quote'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
