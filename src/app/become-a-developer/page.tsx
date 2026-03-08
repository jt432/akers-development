import type { Metadata } from 'next';
import Link from 'next/link';
import PageHero from '@/components/PageHero';
import SectionHeading from '@/components/SectionHeading';

export const metadata: Metadata = {
  title: 'Become a Developer',
  description:
    'Learn how to become a real estate developer. Akers Development guides first-time developers through financing, permitting, construction planning, and project execution.',
  keywords: [
    'how to become a real estate developer',
    'first-time developer',
    'real estate development guide',
    'residential development process',
    'development consulting',
  ],
};

export default function BecomeADeveloperPage() {
  return (
    <>
      <PageHero
        label="Become a Developer"
        title="Your Guide to Real Estate Development"
        description="Many people want to develop property but don't know where to start. We help you understand the process and execute your first project."
      />

      {/* The Problem */}
      <section className="section-padding bg-white">
        <div className="container-narrow">
          <SectionHeading
            label="The Challenge"
            title="Why Most People Never Get Started"
          />
          <div className="space-y-6 body-md">
            <p>
              Real estate development is one of the most reliable paths to building wealth,
              but it&apos;s also one of the most intimidating. The process involves financing,
              permitting, construction management, cost control, contractor coordination,
              and market timing — and most people don&apos;t have experience in any of these areas.
            </p>
            <p>
              The result? People with great land, solid ideas, and available capital never
              move forward because the process feels overwhelming. They either give up entirely
              or hand everything over to a general contractor who charges significant markups
              and makes all the decisions.
            </p>
            <p>
              Akers Development exists to change that. We provide the knowledge, planning,
              and coordination that lets you develop property on your own terms — with full
              cost transparency and developer-level guidance.
            </p>
          </div>
        </div>
      </section>

      {/* What You Need to Know */}
      <section className="section-padding bg-brand-cream">
        <div className="container-wide">
          <SectionHeading
            label="What You Need to Know"
            title="The Development Process"
            description="Successful development projects follow a structured process. Here's what's involved."
            align="center"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: 'Financing & Capital',
                desc: 'Understanding construction loans, development financing, and how to structure your capital so the project is viable from day one.',
              },
              {
                title: 'Land & Feasibility',
                desc: 'Evaluating land for development potential — zoning, utilities, topography, market conditions, and whether the numbers work.',
              },
              {
                title: 'Permitting & Approvals',
                desc: 'Navigating building permits, zoning approvals, site plans, engineering requirements, and regulatory compliance.',
              },
              {
                title: 'Construction Cost Planning',
                desc: 'Understanding what construction actually costs, how to budget accurately, and how to avoid cost overruns.',
              },
              {
                title: 'Contractor Coordination',
                desc: 'Managing the relationships between builders, subcontractors, suppliers, and inspectors to keep the project moving.',
              },
              {
                title: 'Project Sequencing',
                desc: 'Knowing what happens when — from site work to foundation to framing to finishes — and keeping the timeline on track.',
              },
            ].map((item) => (
              <div key={item.title} className="card">
                <h3 className="heading-sm mb-3">{item.title}</h3>
                <p className="body-md text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How We Help */}
      <section className="section-padding bg-white">
        <div className="container-wide grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <SectionHeading
              label="How We Help"
              title="We Walk You Through the Entire Process"
              description="Akers Development doesn't just advise — we actively guide you through each phase of your first (or next) development project."
            />
            <div className="space-y-6 body-md">
              <p>
                Our consulting model gives you access to the same knowledge, planning tools,
                and construction resources that experienced developers use. You maintain
                control of your project while we provide the expertise to execute it.
              </p>
              <p>
                We help with everything from evaluating whether a project makes financial
                sense to coordinating the construction resources needed to build it. And
                because you&apos;re paying a consulting fee rather than a general contractor
                markup, your project costs stay transparent and controlled.
              </p>
            </div>
            <Link href="/contact" className="btn-primary mt-8">
              Talk to Us About Your Project
            </Link>
          </div>
          <div
            className="aspect-[4/3] bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80')",
            }}
          />
        </div>
      </section>

      {/* Types of Projects */}
      <section className="section-padding bg-brand-charcoal text-white">
        <div className="container-wide">
          <SectionHeading
            label="Project Types"
            title="What Can You Develop?"
            align="center"
            light
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'Custom Homes', desc: 'Build your own home with full cost control and planning support.' },
              { title: 'Spec Homes', desc: 'Build to sell — we help with market analysis, cost strategy, and execution.' },
              { title: 'Duplexes & Small MF', desc: 'Develop duplexes or small multi-family for rental income or sale.' },
              { title: 'Land Development', desc: 'Develop raw land into buildable lots or completed projects.' },
            ].map((item) => (
              <div key={item.title} className="border border-white/10 p-8">
                <h3 className="text-xl font-semibold text-white mb-3">{item.title}</h3>
                <p className="text-gray-300 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-brand-cream text-center">
        <div className="container-narrow">
          <h2 className="heading-lg mb-4">Ready to Start Your Development Journey?</h2>
          <p className="body-lg mb-8">
            Whether you have land, plans, or just an idea, we can help you evaluate the
            opportunity and build a path forward.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/upload-plans" className="btn-primary">Upload Your Plans</Link>
            <Link href="/contact" className="btn-secondary">Schedule a Consultation</Link>
          </div>
        </div>
      </section>
    </>
  );
}
