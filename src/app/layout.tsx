import './globals.css';
import 'katex/dist/katex.min.css';
import type { Metadata } from 'next';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { bio } from '@/data/bio';

const SITE_URL = 'https://www.viiforwin.in';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Vibhanshu Sharma — AI Engineer & Founder',
    template: '%s — Vibhanshu Sharma',
  },
  description:
    'Vibhanshu Sharma is an AI engineer and founder in Bengaluru. He ships production AI — agents, RAG, and LLM products — and leads AI engineering at Powerplay, building software for the construction industry.',
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
    <html lang="en">
      <body>
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
