import type { Metadata } from 'next';
import { inter } from '@/lib/fonts/local-font';
import { MarketingHeader, MarketingFooter } from '@/components/marketing';

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
    <div className={inter.className}>
      <MarketingHeader />
      <main className="min-h-screen">
        {children}
      </main>
      <MarketingFooter />
    </div>
  );
}