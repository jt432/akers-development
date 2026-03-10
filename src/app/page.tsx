import Link from 'next/link';
import SectionHeading from '@/components/SectionHeading';

export default function HomePage() {
  return (
    <>
      {/* ─── Hero ─── */}
      <section className="relative bg-brand-dark min-h-[90vh] flex items-center">
        {/* Background image placeholder */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1920&q=80')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-dark via-brand-dark/80 to-transparent" />

        <div className="relative z-10 section-padding container-wide">
          <span className="inline-block text-xs tracking-[0.25em] uppercase font-semibold text-brand-sand mb-6">
            Development Consulting &middot; Project Management
          </span>
          <h1 className="heading-xl text-white max-w-3xl">
            Helping People Become Developers
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mt-6 max-w-2xl leading-relaxed">
            We guide landowners, investors, and builders through the process of turning
            ideas into profitable development projects.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-10">
            <Link href="/upload-plans" className="btn-accent">
              Upload Your Plans
            </Link>
            <Link href="/services" className="btn-secondary border-white text-white hover:bg-white hover:text-brand-dark">
              How We Work
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Who We Are ─── */}
      <section className="section-padding bg-white">
        <div className="container-narrow">
            <SectionHeading
              label="Who We Are"
              title="Development Consulting, Not General Contracting"
              description="Akers Development provides developer-level knowledge, planning, and access to construction resources. Clients benefit from strategic guidance and cost transparency while primarily paying a consulting fee — not a traditional general contractor markup."
            />
            <p className="body-md mt-6">
              Founded by Jon Tyler Akers, we help people who want to build or develop
              property bridge the gap between their vision and execution. Whether you&apos;re
              building your first home, developing land, or exploring investment opportunities,
              we provide the planning, cost strategy, and coordination to move your project forward.
            </p>
            <Link href="/about" className="btn-primary mt-8">
              Learn More About Us
            </Link>
        </div>
      </section>

      {/* ─── What We Do ─── */}
      <section className="section-padding bg-brand-cream">
        <div className="container-wide">
          <SectionHeading
            label="What We Do"
            title="From Planning to Completion"
            description="We provide comprehensive development consulting services that guide your project from initial concept through completion."
            align="center"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-4">
            {[
              {
                step: '01',
                title: 'Development Planning',
                desc: 'We evaluate your land, project idea, construction costs, and feasibility to build a clear roadmap.',
              },
              {
                step: '02',
                title: 'Cost Strategy',
                desc: 'Your project is structured to control costs and avoid unnecessary contractor markups.',
              },
              {
                step: '03',
                title: 'Resource Coordination',
                desc: 'Construction resources, crews, and industry relationships are coordinated through our development network.',
              },
              {
                step: '04',
                title: 'Project Completion',
                desc: 'You move through the building or development process with guidance, structure, and cost transparency.',
              },
            ].map((item) => (
              <div key={item.step} className="card group">
                <span className="text-4xl font-bold text-brand-sand group-hover:text-brand-stone transition-colors">
                  {item.step}
                </span>
                <h3 className="heading-sm mt-4 mb-3">{item.title}</h3>
                <p className="body-md text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Featured Projects ─── */}
      <section className="section-padding bg-white">
        <div className="container-wide">
          <SectionHeading
            label="Featured Projects"
            title="Development Projects We&rsquo;ve Guided"
            description="A sample of the residential and development projects we've helped plan, coordinate, and bring to completion."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Cypress Lake Development',
                type: 'Residential Development',
                desc: 'Multi-lot residential development project including land planning, cost strategy, and construction coordination.',
              },
              {
                title: 'Custom Residential Build',
                type: 'Build Consulting',
                desc: 'Full development consulting for a custom home build — from initial planning and budgeting through project completion.',
              },
              {
                title: 'Land Development Project',
                type: 'Land Planning',
                desc: 'Land evaluation, feasibility analysis, and development planning for a residential land development opportunity.',
              },
            ].map((project) => (
              <Link href="/projects" key={project.title} className="card group block">
                <span className="text-xs tracking-widest uppercase text-brand-stone font-medium">
                  {project.type}
                </span>
                <h3 className="heading-sm mt-2 mb-3 group-hover:text-brand-accent transition-colors">
                  {project.title}
                </h3>
                <p className="body-md text-sm">{project.desc}</p>
              </Link>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/projects" className="btn-secondary">
              View All Projects
            </Link>
          </div>
        </div>
      </section>

      {/* ─── How We Help ─── */}
      <section className="section-padding bg-brand-charcoal text-white">
        <div className="container-wide">
          <SectionHeading
            label="How We Help"
            title="Developer-Level Guidance Without the Markup"
            description="Most people who want to build or develop property lack the knowledge, connections, and cost insight to do it efficiently. We bridge that gap."
            align="center"
            light
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-4">
            {[
              {
                title: 'First-Time Builders',
                desc: 'Building your own home? We help you understand costs, avoid common mistakes, and navigate the process with confidence.',
              },
              {
                title: 'Land Owners & Investors',
                desc: 'Have land and a vision? We evaluate feasibility, plan the development, and structure the project for cost efficiency.',
              },
              {
                title: 'Aspiring Developers',
                desc: 'Want to develop property? We teach you the process — financing, permitting, construction coordination, and project structure.',
              },
            ].map((item) => (
              <div key={item.title} className="border border-white/10 p-8 hover:border-white/20 transition-colors">
                <h3 className="heading-sm text-white mb-4">{item.title}</h3>
                <p className="text-gray-300 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Upload Plans CTA ─── */}
      <section className="section-padding bg-brand-cream">
        <div className="container-narrow text-center">
          <SectionHeading
            label="Get Started"
            title="Upload Your Plans for a Preliminary Cost Review"
            description="Submit your building plans and project details. We'll review them and provide an early cost estimate and project insight."
            align="center"
          />
          <Link href="/upload-plans" className="btn-primary">
            Upload Plans Now
          </Link>
        </div>
      </section>

      {/* ─── Our Companies ─── */}
      <section className="section-padding bg-white">
        <div className="container-wide">
          <SectionHeading
            label="Our Ecosystem"
            title="Our Companies"
            description="Akers Development operates within a broader business ecosystem that supports projects from planning through construction and interior finishes."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                name: 'Akers Development',
                role: 'Development consulting, planning, and project management.',
                link: '/',
                linkLabel: 'You\'re Here',
              },
              {
                name: 'Vast Construction',
                role: 'An extensive network of crews, subcontractors, and construction resources supporting development projects.',
                link: 'https://vast.construction',
                linkLabel: 'vast.construction',
              },
              {
                name: 'Magnolia Granite',
                role: 'Countertop fabrication and stone surfaces supporting residential construction and development projects.',
                link: 'https://magnoliagranitems.com',
                linkLabel: 'magnoliagranitems.com',
              },
              {
                name: 'Akers Property Care',
                role: 'Residential cleaning, commercial cleaning, and post-construction cleanup services.',
                link: '/apc',
                linkLabel: 'Get a Quote',
              },
            ].map((co) => (
              <div key={co.name} className="card">
                <h3 className="heading-sm mb-3">{co.name}</h3>
                <p className="body-md text-sm mb-4">{co.role}</p>
                {co.link.startsWith('http') ? (
                  <a
                    href={co.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-brand-accent font-medium hover:underline"
                  >
                    {co.linkLabel} &rarr;
                  </a>
                ) : (
                  <Link
                    href={co.link}
                    className="text-sm text-brand-accent font-medium hover:underline"
                  >
                    {co.linkLabel === 'You\'re Here' ? co.linkLabel : `${co.linkLabel} \u2192`}
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Akers Property Care CTA ─── */}
      <section className="section-padding bg-brand-dark">
        <div className="container-narrow">
          <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
            <div className="flex-1">
              <span className="inline-block text-xs tracking-[0.25em] uppercase font-semibold text-brand-sand mb-4">
                Akers Property Care
              </span>
              <h2 className="heading-lg text-white mb-4">
                Building It Is Only Half the Job
              </h2>
              <p className="text-gray-300 leading-relaxed mb-2">
                From post-construction cleanup to ongoing residential and commercial cleaning,
                Akers Property Care keeps your investment looking its best. Professional service
                from the same team you trust to build it.
              </p>
              <ul className="text-gray-400 text-sm space-y-2 mt-4 mb-8">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-brand-sand rounded-full" />
                  Post-Construction Cleanup
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-brand-sand rounded-full" />
                  Residential Cleaning
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-brand-sand rounded-full" />
                  Commercial Cleaning
                </li>
              </ul>
              <Link href="/apc" className="btn-accent">
                Get a Quote from Akers Property Care
              </Link>
            </div>
            <div className="flex-shrink-0 hidden lg:flex items-center justify-center w-48 h-48 border-2 border-white/10 rounded-full">
              <div className="text-center">
                <span className="block font-serif text-white text-2xl tracking-[0.15em]">APC</span>
                <span className="block font-serif text-brand-sand text-[10px] tracking-[0.25em] mt-1">PROPERTY CARE</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
