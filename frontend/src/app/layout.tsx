import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from '@/providers';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Lumina — Digital Asset Licensing on Stellar',
  description:
    'AI-powered digital asset licensing platform built on Stellar blockchain. Register, license, and monetize your creative work with smart contracts and automated royalties.',
  keywords: [
    'digital assets',
    'licensing',
    'blockchain',
    'Stellar',
    'Soroban',
    'NFT',
    'royalties',
    'smart contracts',
  ],
  authors: [{ name: 'Lumina' }],
  openGraph: {
    title: 'Lumina — Digital Asset Licensing on Stellar',
    description:
      'AI-powered digital asset licensing platform built on Stellar blockchain.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
