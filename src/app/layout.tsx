import '@mantine/core/styles.css';
import './globals.css';

import { ColorSchemeScript, MantineProvider, mantineHtmlProps } from '@mantine/core';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Vibhanshu Sharma — Tech Generalist, 2x Founder',
  description:
    'IIT Roorkee Gold Medalist. Built Powerplay Android to 500k+ users as founding engineer. Founded Vignam ($1M valuation, 20+ team). Currently leading AI engineering at Powerplay.',
  keywords: ['Vibhanshu Sharma', 'founder', 'engineer', 'IIT Roorkee', 'Powerplay', 'Vignam', 'full-stack'],
  authors: [{ name: 'Vibhanshu Sharma' }],
  openGraph: {
    title: 'Vibhanshu Sharma — Tech Generalist, 2x Founder',
    description:
      'IIT Roorkee Gold Medalist. Founding engineer at Powerplay (500k+ users). Solo founder of Vignam ($1M valuation). Building at the intersection of AI and product.',
    type: 'website',
    locale: 'en_IN',
    url: 'https://vibhanshu.dev',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vibhanshu Sharma — Tech Generalist, 2x Founder',
    description: 'IIT Roorkee Gold Medalist. 2x founder. Currently leading AI engineering at Powerplay.',
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript />
        <link
          href="https://api.fontshare.com/v2/css?f[]=switzer@400,500,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <MantineProvider>{children}</MantineProvider>
      </body>
    </html>
  );
}
