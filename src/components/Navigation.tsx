'use client';

import Link from 'next/link';
import { useState } from 'react';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/services', label: 'Services' },
  { href: '/projects', label: 'Projects' },
  { href: '/become-a-developer', label: 'Become a Developer' },
  { href: '/our-companies', label: 'Our Companies' },
  { href: '/upload-plans', label: 'Upload Plans' },
  { href: '/contact', label: 'Contact' },
];

export default function Navigation() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <svg viewBox="0 0 56 68" width="32" height="40" xmlns="http://www.w3.org/2000/svg">
              <rect x="2" y="4" width="48" height="3" fill="#1A1A1A" rx="0.5"/>
              <rect x="6" y="7" width="6" height="44" fill="#1A1A1A"/>
              <rect x="22" y="7" width="6" height="44" fill="#B8976A"/>
              <rect x="38" y="7" width="6" height="44" fill="#1A1A1A"/>
              <rect x="2" y="51" width="48" height="3" fill="#1A1A1A" rx="0.5"/>
              <rect x="6" y="54" width="38" height="1.5" fill="#B8976A"/>
            </svg>
            <div className="leading-tight">
              <span className="block font-serif text-brand-charcoal text-lg tracking-[0.15em]">
                AKERS
              </span>
              <span className="block font-serif text-brand-stone text-[10px] tracking-[0.25em]">
                DEVELOPMENT
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-brand-slate hover:text-brand-charcoal transition-colors
                           tracking-wide uppercase font-medium"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden flex flex-col space-y-1.5 p-2"
            aria-label="Toggle menu"
          >
            <span className={`block w-6 h-0.5 bg-brand-charcoal transition-transform duration-300
              ${mobileOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block w-6 h-0.5 bg-brand-charcoal transition-opacity duration-300
              ${mobileOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-6 h-0.5 bg-brand-charcoal transition-transform duration-300
              ${mobileOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`lg:hidden overflow-hidden transition-all duration-300
        ${mobileOpen ? 'max-h-[500px] border-t border-gray-100' : 'max-h-0'}`}>
        <div className="px-6 py-4 bg-white space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="block py-3 text-sm text-brand-slate hover:text-brand-charcoal
                         tracking-wide uppercase font-medium border-b border-gray-50"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
