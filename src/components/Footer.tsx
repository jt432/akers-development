import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-brand-dark text-white">
      {/* CTA Banner */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16 text-center">
          <h2 className="heading-lg text-white mb-4">Ready to Start Your Project?</h2>
          <p className="body-lg text-gray-400 max-w-2xl mx-auto mb-8">
            Whether you&apos;re building your first home or planning a development project,
            we&apos;ll guide you through every step.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/upload-plans" className="btn-accent">
              Upload Your Plans
            </Link>
            <Link href="/contact" className="btn-secondary border-white text-white hover:bg-white hover:text-brand-dark">
              Get in Touch
            </Link>
          </div>
        </div>
      </div>

      {/* Footer Content */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-white flex items-center justify-center">
                <span className="text-brand-dark font-bold text-lg">A</span>
              </div>
              <div className="leading-tight">
                <span className="block text-white font-bold text-lg tracking-tight">Akers</span>
                <span className="block text-gray-400 text-xs tracking-widest uppercase">Development</span>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Development consulting and project leadership. Helping people become developers.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-white font-semibold tracking-wide uppercase text-sm mb-6">Navigation</h4>
            <div className="space-y-3">
              {[
                { href: '/about', label: 'About' },
                { href: '/services', label: 'Services' },
                { href: '/projects', label: 'Projects' },
                { href: '/become-a-developer', label: 'Become a Developer' },
                { href: '/upload-plans', label: 'Upload Plans' },
                { href: '/contact', label: 'Contact' },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block text-gray-400 text-sm hover:text-white transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Our Companies */}
          <div>
            <h4 className="text-white font-semibold tracking-wide uppercase text-sm mb-6">Our Companies</h4>
            <div className="space-y-3">
              <Link href="/our-companies" className="block text-gray-400 text-sm hover:text-white transition-colors">
                Akers Development
              </Link>
              <a
                href="https://vast.construction"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-gray-400 text-sm hover:text-white transition-colors"
              >
                Vast Construction
              </a>
              <a
                href="https://magnoliagranitems.com"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-gray-400 text-sm hover:text-white transition-colors"
              >
                Magnolia Granite
              </a>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold tracking-wide uppercase text-sm mb-6">Contact</h4>
            <div className="space-y-3">
              <a href="mailto:jt@akers-development.com" className="block text-gray-400 text-sm hover:text-white transition-colors">
                jt@akers-development.com
              </a>
              <p className="text-gray-400 text-sm">Mississippi</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} Akers Development. All rights reserved.
          </p>
          <p className="text-gray-500 text-sm mt-2 md:mt-0">
            Development Consulting &middot; Project Leadership &middot; Cost Strategy
          </p>
        </div>
      </div>
    </footer>
  );
}
