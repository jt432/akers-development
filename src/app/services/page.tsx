import type { Metadata } from 'next';
import Link from 'next/link';
import PageHero from '@/components/PageHero';
import SectionHeading from '@/components/SectionHeading';

export const metadata: Metadata = {
  title: 'Services',
  description:
    'Akers Development provides development consulting, construction cost planning, project feasibility analysis, land development strategy, and residential development planning.',
};

const services = [
  {
    title: 'Development Consulting',
    desc: 'Comprehensive guidance through the development process — from initial concept to project completion. We help you understand every phase, make informed decisions, and avoid costly mistakes.',
  },
  {
    title: 'Project Feasibility Analysis',
    desc: 'Before you invest, we evaluate the land, market conditions, construction costs, permitting requirements, and timeline to determine whether your project is financially viable.',
  },
  {
    title: 'Construction Cost Planning',
    desc: 'Detailed cost breakdowns and budget strategies that give you a clear picture of what your project will cost — without hidden contractor markups inflating the numbers.',
  },
  {
    title: 'Land Development Strategy',
    desc: 'For landowners and investors with raw or undeveloped property, we plan the development approach — zoning, site work, infrastructure, and build strategy.',
  },
  {
    title: 'Builder Coordination',
    desc: 'We coordinate construction resources, crews, and subcontractors through our established network, ensuring quality execution without the traditional GC markup.',
  },
  {
    title: 'Residential Development Planning',
    desc: 'Planning for single-family homes, duplexes, and small residential developments — including layout, cost structure, construction sequencing, and market positioning.',
  },
  {
    title: 'Investor Development Consulting',
    desc: 'For investors looking to enter residential development, we provide the strategic framework — market analysis, cost modeling, risk assessment, and project structure.',
  },
];

export default function ServicesPage() {
  return (
    <>
      <PageHero
        label="Our Services"
        title="Development Consulting & Project Leadership"
        description="We guide and coordinate projects rather than acting as a traditional general contractor. The result: cost transparency, strategic planning, and developer-level insight."
      />

      {/* Services Grid */}
      <section className="section-padding bg-white">
        <div className="container-wide">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((service, i) => (
              <div key={service.title} className="card flex gap-6">
                <span className="text-3xl font-bold text-brand-sand shrink-0">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div>
                  <h3 className="heading-sm mb-3">{service.title}</h3>
                  <p className="body-md text-sm">{service.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ideal Clients */}
      <section className="section-padding bg-brand-cream">
        <div className="container-wide">
          <SectionHeading
            label="Who We Work With"
            title="Ideal Clients"
            description="Our consulting model is designed for people who want to take control of their building or development projects."
            align="center"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'Landowners', desc: 'People who own land and want to develop or build on it.' },
              { title: 'Investors', desc: 'Individuals exploring residential development as an investment.' },
              { title: 'Home Builders', desc: 'People wanting to build their own home with cost transparency.' },
              { title: 'First-Time Developers', desc: 'Anyone entering the development world for the first time.' },
            ].map((client) => (
              <div key={client.title} className="card text-center">
                <h3 className="heading-sm mb-2">{client.title}</h3>
                <p className="text-sm text-brand-slate">{client.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How Projects Work */}
      <section className="section-padding bg-brand-charcoal text-white">
        <div className="container-wide">
          <SectionHeading
            label="Our Process"
            title="How Projects Work with Akers Development"
            description="When you hire Akers Development, your project follows a structured path designed to control costs and deliver results."
            align="center"
            light
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                step: 'Step 1',
                title: 'Development Planning',
                desc: 'We evaluate the land, project idea, construction costs, and feasibility to build a clear plan.',
              },
              {
                step: 'Step 2',
                title: 'Cost Strategy',
                desc: 'The project is structured to help control costs and avoid unnecessary contractor markups.',
              },
              {
                step: 'Step 3',
                title: 'Resource Coordination',
                desc: 'Construction resources, crews, and industry relationships are coordinated through our network.',
              },
              {
                step: 'Step 4',
                title: 'Project Completion',
                desc: 'You move through the process with guidance, structure, and full cost transparency.',
              },
            ].map((item) => (
              <div key={item.step} className="border border-white/10 p-8">
                <span className="text-xs tracking-widest uppercase text-brand-sand font-semibold">
                  {item.step}
                </span>
                <h3 className="text-xl font-semibold text-white mt-3 mb-3">{item.title}</h3>
                <p className="text-gray-300 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
          <p className="text-center text-gray-400 mt-12 max-w-2xl mx-auto">
            Clients gain developer-level insight and construction resources while primarily
            paying a consulting fee rather than a large contractor markup.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-brand-cream text-center">
        <div className="container-narrow">
          <h2 className="heading-lg mb-4">Have a Project in Mind?</h2>
          <p className="body-lg mb-8">
            Upload your plans for a preliminary cost review, or reach out to discuss your project.
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
