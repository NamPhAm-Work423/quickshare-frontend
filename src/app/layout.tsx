import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { WormholeBackground } from '@/components/wormhole-background';

const inter = Inter({ subsets: ['latin'] });

const faviconSvg =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="48" fill="%230f172a"/><path d="M70 30 C70 35.5 65.5 40 60 40 C58 40 56 39.5 54.5 38.5 L 42 46 C 42.5 47.2 43 48.6 43 50 C 43 51.4 42.5 52.8 42 54 L 54.5 61.5 C 56 60.5 58 60 60 60 C 65.5 60 70 64.5 70 70 C 70 75.5 65.5 80 60 80 C 54.5 80 50 75.5 50 70 C 50 68.6 50.5 67.2 51 66 L 38.5 58.5 C 37 59.5 35 60 33 60 C 27.5 60 23 55.5 23 50 C 23 44.5 27.5 40 33 40 C 35 40 37 40.5 38.5 41.5 L 51 34 C 50.5 32.8 50 31.4 50 30 C 50 24.5 54.5 20 60 20 C 65.5 20 70 24.5 70 30 Z" fill="%2338bdf8"/><path d="M52 42 L 58 42 L 55 50 L 62 50 L 48 64 L 51 54 L 44 54 Z" fill="%23fbbf24" stroke="%230f172a" stroke-width="2"/></svg>';
const faviconDataUrl = `data:image/svg+xml,${faviconSvg}`;

export const metadata: Metadata = {
  title: 'Quickshare',
  description: 'Transfer files and notes using 6-digit codes',
  icons: {
    icon: faviconDataUrl,
    shortcut: faviconDataUrl,
    apple: faviconDataUrl,
  },
  other: {
    'cache-control': 'no-cache, no-store, must-revalidate',
  },
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params?: Promise<Record<string, string | string[]>>;
}>) {
  if (params) {
    await params;
  }
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <meta name="format-detection" content="telephone=no" />
        <meta httpEquiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
        <meta httpEquiv="Pragma" content="no-cache" />
        <meta httpEquiv="Expires" content="0" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                // Force fresh page load on mobile by clearing any cached state
                if ('serviceWorker' in navigator) {
                  navigator.serviceWorker.getRegistrations().then(function(registrations) {
                    for(let registration of registrations) {
                      registration.unregister();
                    }
                  });
                }

                const storageKey = 'file-transfer-theme';
                const stored = localStorage.getItem(storageKey);
                const defaultTheme = 'system';
                const theme = stored || defaultTheme;

                function getSystemTheme() {
                  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                }

                function applyTheme(themeToApply) {
                  const root = document.documentElement;
                  root.classList.remove('light', 'dark');

                  if (themeToApply === 'system') {
                    root.classList.add(getSystemTheme());
                  } else {
                    root.classList.add(themeToApply);
                  }
                }

                applyTheme(theme);
              })();
            `,
          }}
        />
      </head>
      <body className={inter.className}>
        <ThemeProvider defaultTheme="system" storageKey="file-transfer-theme">
          <div className="relative min-h-screen overflow-hidden">
            <WormholeBackground />
            <div className="relative z-10">
              {children}
              <Toaster />
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}

