import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'File Transfer Service',
  description: 'Transfer files and notes using 6-digit codes',
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
  // Await params if provided to prevent Next.js 15 warning about params enumeration
  // Even though we don't use params, we need to await it to unwrap the Promise
  // and prevent React DevTools from enumerating it
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
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}

