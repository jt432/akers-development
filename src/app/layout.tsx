import type { Metadata } from 'next';
import './globals.css';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: {
    default: 'Akers Development — Development Consulting & Project Management',
    template: '%s | Akers Development',
  },
  description:
    'Akers Development helps landowners, investors, and builders plan and execute residential building and development projects with cost transparency and developer-level guidance. Based in Mississippi.',
  keywords: [
    'real estate development consultant',
    'build a house Mississippi',
    'residential development consulting',
    'construction cost consulting',
    'land development planning',
    'how to become a developer',
    'development consultant Mississippi',
    'house build cost estimate',
    'construction cost planning',
  ],
  openGraph: {
    title: 'Akers Development — Helping People Become Developers',
    description:
      'Development consulting and project management for residential building and development projects.',
    url: 'https://akers-development.com',
    siteName: 'Akers Development',
    locale: 'en_US',
    type: 'website',
  },
  robots: { index: true, follow: true },
  metadataBase: new URL('https://akers-development.com'),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Schema.org structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'ProfessionalService',
              name: 'Akers Development',
              description:
                'Development consulting and project management company helping people plan and execute residential building and development projects.',
              url: 'https://akers-development.com',
              email: 'jt@akers-development.com',
              founder: {
                '@type': 'Person',
                name: 'Jon Tyler Akers',
              },
              areaServed: {
                '@type': 'State',
                name: 'Mississippi',
              },
              serviceType: [
                'Development Consulting',
                'Construction Cost Planning',
                'Residential Development Planning',
                'Land Development Strategy',
                'Project Feasibility Analysis',
              ],
            }),
          }}
        />
      </head>
      <body className="font-sans">
        <Navigation />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
