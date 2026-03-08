import type { Metadata } from 'next';
import Link from 'next/link';
import PageHero from '@/components/PageHero';
import SectionHeading from '@/components/SectionHeading';

export const metadata: Metadata = {
  title: 'Our Companies',
  description:
    'Akers Development operates within a broader business ecosystem including Vast Construction and Magnolia Granite — supporting projects from planning through construction and interior finishes.',
};

export default function OurCompaniesPage() {
  return (
    <>
      <PageHero
        label="Our Companies"
        title="A Connected Ecosystem"
        description="Akers Development operates within a broader business ecosystem that supports development projects from planning through construction and interior finishes."
      />

      {/* Ecosystem Overview */}
      <section className="section-padding bg-white">
        <div className="container-narrow">
          <SectionHeading
            label="How It Works"
            title="From Planning to Finished Project"
          />
          <div className="space-y-6 body-md">
            <p>
              When you work with Akers Development, you gain access to a network of
              businesses that support every phase of the construction and development
              process. Each company operates independently with its own expertise, but
              together they create an integrated support system for development projects.
            </p>
            <p>
              This connected ecosystem means your project benefits from established
              relationships, streamlined coordination, and consistent quality from
              the planning table to the finished build.
            </p>
          </div>
        </div>
      </section>

      {/* Companies */}
      <section className="section-padding bg-brand-cream">
        <div className="container-wide space-y-16">

          {/* Akers Development */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-xs tracking-widest uppercase text-brand-stone font-semibold">
                Planning &amp; Leadership
              </span>
              <h3 className="heading-lg mt-2 mb-4">Akers Development</h3>
              <p className="body-md mb-4">
                The hub of the ecosystem. Akers Development provides development consulting,
                project planning, cost strategy, and project management. We guide clients
                through the entire development process — from evaluating an idea to
                coordinating the resources needed to build it.
              </p>
              <p className="body-md mb-6">
                Whether you&apos;re a first-time builder, a landowner, or an investor,
                Akers Development is where your project starts and where the strategic
                decisions are made.
              </p>
              <div className="flex flex-wrap gap-3">
                <span className="text-xs px-4 py-2 bg-brand-charcoal text-white tracking-wide">
                  Development Consulting
                </span>
                <span className="text-xs px-4 py-2 bg-brand-charcoal text-white tracking-wide">
                  Cost Planning
                </span>
                <span className="text-xs px-4 py-2 bg-brand-charcoal text-white tracking-wide">
                  Project Management
                </span>
              </div>
            </div>
            <div
              className="aspect-[4/3] bg-cover bg-center"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&q=80')",
              }}
            />
          </div>

          <hr className="border-brand-sand" />

          {/* Vast Construction */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div
              className="aspect-[4/3] bg-cover bg-center order-2 lg:order-1"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80')",
              }}
            />
            <div className="order-1 lg:order-2">
              <span className="text-xs tracking-widest uppercase text-brand-stone font-semibold">
                Construction Resources
              </span>
              <h3 className="heading-lg mt-2 mb-4">Vast Construction</h3>
              <p className="body-md mb-4">
                Vast Construction brings an extensive network of crews, subcontractors,
                and construction resources that support projects coordinated through
                Akers Development. With deep field experience and established contractor
                relationships, Vast provides the construction execution backbone for
                development projects.
              </p>
              <p className="body-md mb-6">
                From site work to framing to finishes, Vast Construction&apos;s network
                ensures that the right people and resources are available when your
                project needs them.
              </p>
              <div className="flex flex-wrap gap-3 mb-6">
                <span className="text-xs px-4 py-2 bg-brand-charcoal text-white tracking-wide">
                  Construction Resources
                </span>
                <span className="text-xs px-4 py-2 bg-brand-charcoal text-white tracking-wide">
                  Contractor Relationships
                </span>
                <span className="text-xs px-4 py-2 bg-brand-charcoal text-white tracking-wide">
                  Field Experience
                </span>
              </div>
              <a
                href="https://vast.construction"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary"
              >
                Visit vast.construction &rarr;
              </a>
            </div>
          </div>

          <hr className="border-brand-sand" />

          {/* Magnolia Granite */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-xs tracking-widest uppercase text-brand-stone font-semibold">
                Interior Finishes
              </span>
              <h3 className="heading-lg mt-2 mb-4">Magnolia Granite</h3>
              <p className="body-md mb-4">
                Magnolia Granite specializes in countertop fabrication and stone surfaces,
                supporting residential construction and development projects with quality
                interior finishes that elevate the final product.
              </p>
              <p className="body-md mb-6">
                From kitchen countertops to bathroom vanities, Magnolia Granite provides the
                finish work that transforms a construction project into a completed home.
              </p>
              <div className="flex flex-wrap gap-3 mb-6">
                <span className="text-xs px-4 py-2 bg-brand-charcoal text-white tracking-wide">
                  Countertop Fabrication
                </span>
                <span className="text-xs px-4 py-2 bg-brand-charcoal text-white tracking-wide">
                  Stone Surfaces
                </span>
                <span className="text-xs px-4 py-2 bg-brand-charcoal text-white tracking-wide">
                  Residential Finishes
                </span>
              </div>
              <a
                href="https://magnoliagranitems.com"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary"
              >
                Visit magnoliagranitems.com &rarr;
              </a>
            </div>
            <div
              className="aspect-[4/3] bg-cover bg-center"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80')",
              }}
            />
          </div>
        </div>
      </section>

      {/* Ecosystem Flow */}
      <section className="section-padding bg-brand-charcoal text-white">
        <div className="container-wide text-center">
          <SectionHeading
            label="The Full Picture"
            title="Planning → Construction → Finishes"
            description="Together, these businesses support your project from the first planning meeting to the final countertop installation."
            align="center"
            light
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
            <div className="border border-white/10 p-8">
              <span className="text-brand-sand text-sm font-semibold tracking-widest uppercase">Phase 1</span>
              <h3 className="text-xl font-semibold text-white mt-3 mb-2">Akers Development</h3>
              <p className="text-gray-300 text-sm">Planning, strategy, and project management.</p>
            </div>
            <div className="border border-white/10 p-8">
              <span className="text-brand-sand text-sm font-semibold tracking-widest uppercase">Phase 2</span>
              <h3 className="text-xl font-semibold text-white mt-3 mb-2">Vast Construction</h3>
              <p className="text-gray-300 text-sm">Construction resources and project execution.</p>
            </div>
            <div className="border border-white/10 p-8">
              <span className="text-brand-sand text-sm font-semibold tracking-widest uppercase">Phase 3</span>
              <h3 className="text-xl font-semibold text-white mt-3 mb-2">Magnolia Granite</h3>
              <p className="text-gray-300 text-sm">Interior finishes and stone surfaces.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-brand-cream text-center">
        <div className="container-narrow">
          <h2 className="heading-lg mb-4">Ready to Work With Us?</h2>
          <p className="body-lg mb-8">
            Start with Akers Development. We&apos;ll bring the right resources to your project.
          </p>
          <Link href="/contact" className="btn-primary">Get in Touch</Link>
        </div>
      </section>
    </>
  );
}
