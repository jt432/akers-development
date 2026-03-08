import type { Metadata } from 'next';
import Link from 'next/link';
import PageHero from '@/components/PageHero';
import SectionHeading from '@/components/SectionHeading';

export const metadata: Metadata = {
  title: 'About',
  description:
    'Akers Development is led by Jon Tyler Akers, a developer and consultant helping people plan and execute residential and small development projects in Mississippi.',
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        label="About Us"
        title="Development Consulting & Project Leadership"
        description="We help people who want to build or develop property bridge the gap between their vision and execution."
      />

      {/* Founder */}
      <section className="section-padding bg-white">
        <div className="container-wide grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <div>
            <SectionHeading
              label="Our Founder"
              title="Jon Tyler Akers"
              description="Developer, consultant, and project leader with deep experience in residential construction and development."
            />
            <div className="space-y-6 body-md">
              <p>
                Jon Tyler Akers founded Akers Development to help people navigate the complex
                world of residential building and real estate development. With years of hands-on
                experience in construction, development planning, and cost management, he
                recognized a fundamental problem: most people who want to build or develop
                property lack the knowledge, connections, and cost insight to do it efficiently.
              </p>
              <p>
                Traditional general contracting models charge significant markups that inflate
                project costs. Akers Development offers a different approach — providing
                developer-level guidance, construction resource access, and project coordination
                through a consulting fee structure rather than a traditional contractor markup.
              </p>
              <p>
                Whether you&apos;re a first-time homebuilder, a landowner exploring development,
                or an investor looking to enter the residential market, Jon and the Akers
                Development team provide the strategic planning and cost transparency you
                need to move forward with confidence.
              </p>
            </div>
          </div>
          <div className="relative">
            <div
              className="aspect-[3/4] bg-cover bg-center bg-gray-200"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600&q=80')",
              }}
            />
          </div>
        </div>
      </section>

      {/* What We Focus On */}
      <section className="section-padding bg-brand-cream">
        <div className="container-wide">
          <SectionHeading
            label="Our Focus"
            title="What Drives Our Work"
            align="center"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: 'Development Consulting',
                desc: 'Strategic guidance for residential and small-scale development projects, from feasibility through completion.',
              },
              {
                title: 'Construction Cost Planning',
                desc: 'Detailed cost analysis and budgeting that helps clients understand true project costs and avoid unnecessary markups.',
              },
              {
                title: 'Project Feasibility',
                desc: 'Before breaking ground, we evaluate land, market conditions, costs, and timelines to determine if a project makes financial sense.',
              },
              {
                title: 'Residential Development',
                desc: 'Planning and coordinating single-family homes, duplexes, and small residential developments.',
              },
              {
                title: 'First-Time Developer Guidance',
                desc: 'Helping people who have never developed property understand the process, financing, permitting, and execution.',
              },
              {
                title: 'Landowner & Investor Support',
                desc: 'Helping landowners and investors evaluate development opportunities and move forward with clear, structured plans.',
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

      {/* Why We Exist */}
      <section className="section-padding bg-white">
        <div className="container-narrow">
          <SectionHeading
            label="Why We Exist"
            title="Bridging the Knowledge Gap"
          />
          <div className="space-y-6 body-md">
            <p>
              Many people want to build a home or develop property but don&apos;t know where
              to start. They face a construction industry where costs are opaque, contractor
              markups are significant, and the development process feels inaccessible to
              anyone outside the industry.
            </p>
            <p>
              Akers Development exists to change that. We provide the same level of knowledge,
              planning, and resource access that experienced developers use — but we make it
              available to landowners, investors, and first-time builders who want to take
              control of their projects.
            </p>
            <p>
              Our clients pay a development consulting fee for our guidance and coordination
              rather than absorbing a traditional general contractor&apos;s markup on every
              aspect of the build. The result is greater cost transparency, more informed
              decision-making, and better project outcomes.
            </p>
          </div>
          <Link href="/services" className="btn-primary mt-8">
            See Our Services
          </Link>
        </div>
      </section>
    </>
  );
}
