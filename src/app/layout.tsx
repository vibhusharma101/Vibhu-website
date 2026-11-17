import './globals.css';
import 'katex/dist/katex.min.css';
import type { Metadata } from 'next';
import { IBM_Plex_Mono, IBM_Plex_Serif } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { bio } from '@/data/bio';
import { PERSON_ID, SITE_DESCRIPTION, SITE_URL } from '@/lib/site';

/* Self-hosted at build time; exposed as CSS variables that the --font-* tokens in globals.css use */
const plexMono = IBM_Plex_Mono({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-plex-mono',
  // Glyphs outside the latin subset (→, ✓) must fall back to a monospace face, not next/font's Arial
  adjustFontFallback: false,
  fallback: ['ui-monospace', 'Menlo', 'Consolas', 'monospace'],
});

const plexSerif = IBM_Plex_Serif({
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-plex-serif',
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Vibhanshu Sharma — AI Engineer & Founder',
    template: '%s — Vibhanshu Sharma',
  },
  description: SITE_DESCRIPTION,
  keywords: ['Vibhanshu Sharma', 'AI engineer', 'AI agents', 'RAG', 'LLM', 'generative AI', 'founder', 'full-stack engineer', 'Powerplay', 'IIT Roorkee', 'Bengaluru'],
  authors: [{ name: 'Vibhanshu Sharma', url: SITE_URL }],
  creator: 'Vibhanshu Sharma',
  openGraph: {
    title: 'Vibhanshu Sharma — AI Engineer & Founder',
    description:
      'I build AI-native products end-to-end — production agents, RAG pipelines, and the full stack that ships them. Currently leading AI engineering at Powerplay, building software for the construction industry.',
    type: 'website',
    locale: 'en_IN',
    url: SITE_URL,
    siteName: 'Vibhanshu Sharma',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vibhanshu Sharma — AI Engineer & Founder',
    description: 'AI engineer and founder, shipping production AI — agents, RAG, and the products around them.',
    creator: '@viiforwinn',
  },
  robots: { index: true, follow: true },
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
};

const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  '@id': PERSON_ID,
  name: bio.name,
  url: SITE_URL,
  jobTitle: bio.currentRole,
  description: bio.tagline,
  image: `${SITE_URL}/logo.png`,
  sameAs: [bio.github, bio.linkedin, bio.twitter],
  alumniOf: {
    '@type': 'CollegeOrUniversity',
    name: 'IIT Roorkee',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${plexMono.variable} ${plexSerif.variable}`}>
      <body>
        <a href="#panel-area" className="skip-to-content">Skip to content</a>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
