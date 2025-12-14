import type { Metadata } from 'next';
import { AppHeader } from '@/components/app';

export const metadata: Metadata = {
  robots: {
    index: false, // noindex for app routes
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <AppHeader />
      <main className="min-h-screen">
        {children}
      </main>
    </div>
  );
}