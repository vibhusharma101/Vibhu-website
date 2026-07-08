import './globals.css';
import 'katex/dist/katex.min.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Vibhanshu Sharma — AI Engineer & Founder',
  description:
    'Vibhanshu Sharma is an AI engineer and founder in Bengaluru. He ships production AI — agents, RAG, and LLM products — including India\'s first AI workforce for construction at Powerplay.',
  keywords: ['Vibhanshu Sharma', 'AI engineer', 'AI agents', 'RAG', 'LLM', 'generative AI', 'founder', 'full-stack engineer', 'Powerplay', 'IIT Roorkee', 'Bengaluru'],
  authors: [{ name: 'Vibhanshu Sharma' }],
  openGraph: {
    title: 'Vibhanshu Sharma — AI Engineer & Founder',
    description:
      'I build AI-native products end-to-end — production agents, RAG pipelines, and the full stack that ships them. Currently building India\'s first AI workforce for construction at Powerplay.',
    type: 'website',
    locale: 'en_IN',
    url: 'https://www.viiforwin.in',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vibhanshu Sharma — AI Engineer & Founder',
    description: 'AI engineer and founder, shipping production AI — agents, RAG, and the products around them.',
  },
  robots: { index: true, follow: true },
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
