import type { Metadata } from 'next';
import './globals.css';
import { CoreWebVitals } from '@/components/seo';
import { ThemeProvider } from '@/components/shared';
import { inter, getCriticalFontPreloads } from '@/lib/fonts/local-font';
import { MobileOptimizer } from '@/components/shared/MobileOptimizer';

const faviconSvg =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="48" fill="%230f172a"/><path d="M70 30 C70 35.5 65.5 40 60 40 C58 40 56 39.5 54.5 38.5 L 42 46 C 42.5 47.2 43 48.6 43 50 C 43 51.4 42.5 52.8 42 54 L 54.5 61.5 C 56 60.5 58 60 60 60 C 65.5 60 70 64.5 70 70 C 70 75.5 65.5 80 60 80 C 54.5 80 50 75.5 50 70 C 50 68.6 50.5 67.2 51 66 L 38.5 58.5 C 37 59.5 35 60 33 60 C 27.5 60 23 55.5 23 50 C 23 44.5 27.5 40 33 40 C 35 40 37 40.5 38.5 41.5 L 51 34 C 50.5 32.8 50 31.4 50 30 C 50 24.5 54.5 20 60 20 C 65.5 20 70 24.5 70 30 Z" fill="%2338bdf8"/><path d="M52 42 L 58 42 L 55 50 L 62 50 L 48 64 L 51 54 L 44 54 Z" fill="%23fbbf24" stroke="%230f172a" stroke-width="2"/></svg>';
const faviconDataUrl = `data:image/svg+xml,${faviconSvg}`;

export const metadata: Metadata = {
  title: {
    default: 'QuickShare - Send Files Instantly Without Login',
    template: '%s | QuickShare',
  },
  description:
    'Share files using a 6-digit code. No login required. Files are transferred directly between browsers.',
  icons: {
    icon: faviconDataUrl,
    shortcut: faviconDataUrl,
    apple: faviconDataUrl,
  },
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
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
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
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* Core Web Vitals: Preload critical font resources */}
        {getCriticalFontPreloads().map((preload, index) => (
          <link
            key={index}
            rel={preload.rel}
            as={preload.as}
            type={preload.type}
            href={preload.href}
            crossOrigin={preload.crossOrigin}
          />
        ))}
        {/* Prevent theme flashing by setting theme immediately */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('quickshare-theme') || 'dark';
                  var root = document.documentElement;
                  root.classList.remove('light', 'dark');
                  if (theme === 'system') {
                    var systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                    root.classList.add(systemTheme);
                  } else {
                    root.classList.add(theme);
                  }
                } catch (e) {
                  document.documentElement.classList.add('dark');
                }
              })();
            `,
          }}
        />
      </head>
      <body className={inter.className}>
        <MobileOptimizer />
        <ThemeProvider defaultTheme="dark" storageKey="quickshare-theme">
          <CoreWebVitals
            preloadImages={['/hero-image.svg', '/logo.svg']}
            prefetchRoutes={['/use-cases/send-files-without-login', '/tools/file-size-calculator']}
            reportWebVitals={true}
          />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}

