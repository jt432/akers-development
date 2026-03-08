interface SectionHeadingProps {
  label?: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
  light?: boolean;
}

export default function SectionHeading({
  label,
  title,
  description,
  align = 'left',
  light = false,
}: SectionHeadingProps) {
  return (
    <div className={`mb-12 md:mb-16 ${align === 'center' ? 'text-center' : ''}`}>
      {label && (
        <span
          className={`inline-block text-xs tracking-[0.2em] uppercase font-semibold mb-4
            ${light ? 'text-brand-sand' : 'text-brand-stone'}`}
        >
          {label}
        </span>
      )}
      <h2 className={`heading-lg ${light ? 'text-white' : 'text-brand-charcoal'}`}>
        {title}
      </h2>
      {description && (
        <p className={`body-lg mt-4 max-w-3xl ${align === 'center' ? 'mx-auto' : ''}
          ${light ? 'text-gray-300' : 'text-brand-slate'}`}>
          {description}
        </p>
      )}
    </div>
  );
}
