'use client';

import { useState, useRef } from 'react';
import PageHero from '@/components/PageHero';
import FileUploader from '@/components/FileUploader';

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

export default function UploadPlansPage() {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const filesRef = useRef<File[]>([]);
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    const form = e.currentTarget;
    const formData = new FormData();

    // Append form fields
    formData.append('name', (form.elements.namedItem('name') as HTMLInputElement).value);
    formData.append('email', (form.elements.namedItem('email') as HTMLInputElement).value);
    formData.append('phone', (form.elements.namedItem('phone') as HTMLInputElement).value);
    formData.append('location', (form.elements.namedItem('location') as HTMLInputElement).value);
    formData.append('projectType', (form.elements.namedItem('projectType') as HTMLSelectElement).value);
    formData.append('squareFootage', (form.elements.namedItem('squareFootage') as HTMLInputElement).value);
    formData.append('description', (form.elements.namedItem('description') as HTMLTextAreaElement).value);
    formData.append('consultant', (form.elements.namedItem('consultant') as HTMLSelectElement).value);

    // Append files
    filesRef.current.forEach((file) => {
      formData.append('files', file);
    });

    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Submission failed');
      }

      setSubmitted(true);
      formRef.current?.reset();
      filesRef.current = [];
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <>
        <PageHero
          label="Upload Plans"
          title="Upload Your Plans for a Preliminary Cost Review"
        />
        <section className="section-padding bg-white">
          <div className="container-narrow text-center">
            <div className="bg-brand-cream p-12">
              <svg className="w-16 h-16 text-brand-accent mx-auto mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h2 className="heading-md mb-4">Plans Received</h2>
              <p className="body-lg mb-6">
                Thank you for submitting your project details. We&apos;ll review your plans
                and get back to you with a preliminary cost review.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="btn-secondary"
              >
                Submit Another Project
              </button>
            </div>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <PageHero
        label="Upload Plans"
        title="Upload Your Plans for a Preliminary Cost Review"
        description="Submit your building plans and project details. We'll review them and provide an early budgeting range and project insight."
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
                  <label htmlFor="phone" className="block text-sm font-medium text-brand-charcoal mb-1">
                    Phone
                  </label>
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
              <h3 className="heading-sm mb-6">Upload Plans &amp; Documents</h3>
              <FileUploader onFilesChange={(files) => { filesRef.current = files; }} />
            </div>

            {/* Disclaimer */}
            <div className="bg-brand-cream p-6 border-l-4 border-brand-stone">
              <p className="text-sm text-brand-slate leading-relaxed">
                <strong>Preliminary Estimate Disclaimer:</strong> This review is intended
                to provide an early budgeting range and project insight and should not be
                considered a final construction contract price. Accurate pricing may require
                a full plan review, site information, finish selections, engineering review,
                and scope clarification.
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
