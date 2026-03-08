import type { Metadata } from 'next';
import Link from 'next/link';
import PageHero from '@/components/PageHero';

export const metadata: Metadata = {
  title: 'Projects',
  description:
    'Explore residential development, custom home, and land development projects guided by Akers Development consulting.',
};

const projects = [
  {
    title: 'Cypress Lake Development',
    type: 'Residential Development',
    description:
      'A multi-phase residential development project featuring thoughtfully planned home sites, infrastructure coordination, and cost-efficient build strategies. Akers Development provided full development consulting from land planning through construction coordination.',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
    details: ['Development Planning', 'Cost Strategy', 'Builder Coordination', 'Infrastructure'],
  },
  {
    title: 'Custom Residential Build',
    type: 'Build Consulting',
    description:
      'A custom single-family home build where the client wanted to control costs while maintaining quality. Akers Development managed the planning, cost analysis, and resource coordination to deliver the project under traditional contractor pricing.',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
    details: ['Cost Planning', 'Resource Coordination', 'Quality Oversight', 'Budget Management'],
  },
  {
    title: 'Duplex Development Project',
    type: 'Investment Development',
    description:
      'An investor-focused duplex development designed for rental income. From feasibility analysis to construction coordination, Akers Development guided the investor through the entire development process with full cost transparency.',
    image: 'https://images.unsplash.com/photo-1558036117-15d82a90b9b1?w=800&q=80',
    details: ['Feasibility Analysis', 'Investment Strategy', 'Development Planning', 'Cost Control'],
  },
  {
    title: 'Land Development Planning',
    type: 'Land Development',
    description:
      'A raw land development project involving site evaluation, zoning research, infrastructure planning, and development cost modeling. The client gained a complete development roadmap before committing to construction.',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80',
    details: ['Site Evaluation', 'Zoning Research', 'Infrastructure Planning', 'Cost Modeling'],
  },
  {
    title: 'First-Time Developer Build',
    type: 'Developer Consulting',
    description:
      'A first-time developer wanted to build and sell a spec home but had no experience with construction, permitting, or cost management. Akers Development provided end-to-end consulting to guide the project from concept through sale.',
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80',
    details: ['Developer Education', 'Project Structure', 'Cost Strategy', 'Market Guidance'],
  },
  {
    title: 'Residential Renovation Consulting',
    type: 'Build Consulting',
    description:
      'A significant residential renovation where cost planning and contractor coordination were critical. Akers Development structured the project to control scope creep and deliver renovations within budget.',
    image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80',
    details: ['Scope Planning', 'Cost Analysis', 'Contractor Coordination', 'Budget Control'],
  },
];

export default function ProjectsPage() {
  return (
    <>
      <PageHero
        label="Our Projects"
        title="Development Projects We&rsquo;ve Guided"
        description="From residential builds to land development, every project benefits from strategic planning, cost control, and development consulting."
      />

      <section className="section-padding bg-white">
        <div className="container-wide">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {projects.map((project) => (
              <div key={project.title} className="group">
                <div
                  className="aspect-[16/10] bg-cover bg-center mb-6"
                  style={{ backgroundImage: `url('${project.image}')` }}
                />
                <span className="text-xs tracking-widest uppercase text-brand-stone font-semibold">
                  {project.type}
                </span>
                <h3 className="heading-md mt-2 mb-3">{project.title}</h3>
                <p className="body-md text-sm mb-4">{project.description}</p>
                <div className="flex flex-wrap gap-2">
                  {project.details.map((d) => (
                    <span
                      key={d}
                      className="text-xs px-3 py-1 bg-brand-cream text-brand-slate tracking-wide"
                    >
                      {d}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-brand-cream text-center">
        <div className="container-narrow">
          <h2 className="heading-lg mb-4">Have a Project to Discuss?</h2>
          <p className="body-lg mb-8">
            Whether you&apos;re planning a build, developing land, or exploring investment
            opportunities, we&apos;d like to hear about your project.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/upload-plans" className="btn-primary">Upload Your Plans</Link>
            <Link href="/contact" className="btn-secondary">Contact Us</Link>
          </div>
        </div>
      </section>
    </>
  );
}
