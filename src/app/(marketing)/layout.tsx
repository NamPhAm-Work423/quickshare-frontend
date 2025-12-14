import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { FontPreloader, commonFonts } from '@/components/seo';
import { MarketingHeader, MarketingFooter } from '@/components/marketing';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap', // Core Web Vitals optimization
  preload: true,
});

export const metadata: Metadata = {
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <FontPreloader 
        fonts={[commonFonts.inter]} 
        criticalFonts={['Inter']}
      />
      <div className={inter.className}>
        <MarketingHeader />
        <main className="min-h-screen">
          {children}
        </main>
        <MarketingFooter />
      </div>
    </>
  );
}