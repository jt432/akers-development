interface PageHeroProps {
  label?: string;
  title: string;
  description?: string;
}

export default function PageHero({ label, title, description }: PageHeroProps) {
  return (
    <section className="bg-brand-cream pt-32 pb-20 section-padding">
      <div className="container-wide">
        {label && (
          <span className="inline-block text-xs tracking-[0.2em] uppercase font-semibold text-brand-stone mb-4">
            {label}
          </span>
        )}
        <h1 className="heading-xl text-brand-charcoal max-w-4xl">{title}</h1>
        {description && (
          <p className="body-lg mt-6 max-w-2xl">{description}</p>
        )}
      </div>
    </section>
  );
}
