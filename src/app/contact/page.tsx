'use client';

import { useState, useRef } from 'react';
import PageHero from '@/components/PageHero';

export default function ContactPage() {
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
      description: (form.elements.namedItem('description') as HTMLTextAreaElement).value,
    };

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || 'Submission failed');
      }

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
      <PageHero
        label="Contact"
        title="Get in Touch"
        description="Have a project to discuss? Reach out and we'll connect with you about your development or building goals."
      />

      <section className="section-padding bg-white">
        <div className="container-wide grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Form */}
          <div>
            {submitted ? (
              <div className="bg-brand-cream p-12 text-center">
                <svg className="w-16 h-16 text-brand-accent mx-auto mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h2 className="heading-md mb-4">Message Sent</h2>
                <p className="body-md mb-6">
                  Thank you for reaching out. We&apos;ll get back to you soon.
                </p>
                <button onClick={() => setSubmitted(false)} className="btn-secondary">
                  Send Another Message
                </button>
              </div>
            ) : (
              <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
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
                  <label htmlFor="phone" className="block text-sm font-medium text-brand-charcoal mb-1">
                    Phone
                  </label>
                  <input id="phone" name="phone" type="tel" className="input-field" placeholder="(555) 123-4567" />
                </div>
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-brand-charcoal mb-1">
                    Project Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    required
                    rows={6}
                    className="input-field"
                    placeholder="Tell us about your project or question..."
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
                  className="btn-primary w-full justify-center disabled:opacity-50"
                >
                  {submitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            )}
          </div>

          {/* Contact Info */}
          <div className="space-y-10">
            <div>
              <h3 className="heading-sm mb-4">Contact Information</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-brand-charcoal">Email</p>
                  <a href="mailto:jt@akers-development.com" className="text-brand-accent hover:underline">
                    jt@akers-development.com
                  </a>
                </div>
                <div>
                  <p className="text-sm font-medium text-brand-charcoal">Location</p>
                  <p className="text-brand-slate">Mississippi</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="heading-sm mb-4">What to Expect</h3>
              <div className="space-y-4 body-md text-sm">
                <p>
                  When you reach out, we&apos;ll set up a time to discuss your project, goals,
                  and timeline. There&apos;s no obligation — just a conversation to see if our
                  consulting model is a good fit for what you&apos;re trying to accomplish.
                </p>
                <p>
                  If you have building plans or project documents ready, consider using our
                  <a href="/upload-plans" className="text-brand-accent font-medium hover:underline"> Upload Plans </a>
                  feature for a preliminary cost review.
                </p>
              </div>
            </div>

            <div>
              <h3 className="heading-sm mb-4">Our Companies</h3>
              <div className="space-y-2">
                <a href="/our-companies" className="block text-sm text-brand-accent hover:underline">
                  Akers Development
                </a>
                <a href="https://vast.construction" target="_blank" rel="noopener noreferrer"
                  className="block text-sm text-brand-accent hover:underline">
                  Vast Construction
                </a>
                <a href="https://magnoliagranitems.com" target="_blank" rel="noopener noreferrer"
                  className="block text-sm text-brand-accent hover:underline">
                  Magnolia Granite
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
