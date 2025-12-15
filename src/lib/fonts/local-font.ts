/**
 * Local font loader for Next.js
 * Replaces Google Fonts with self-hosted font files
 */

import localFont from 'next/font/local';
import { INTER_FONT_CONFIG, SYSTEM_FONT_FALLBACKS } from './config';
import { generatePreloadLinks } from './css-generator';

// Create Inter font configuration using local files
export const inter = localFont({
  src: [
    {
      path: '../../../public/fonts/inter/woff2/Inter-400-normal.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../../public/fonts/inter/woff2/Inter-400-italic.woff2',
      weight: '400',
      style: 'italic',
    },
    {
      path: '../../../public/fonts/inter/woff2/Inter-500-normal.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../../public/fonts/inter/woff2/Inter-500-italic.woff2',
      weight: '500',
      style: 'italic',
    },
    {
      path: '../../../public/fonts/inter/woff2/Inter-600-normal.woff2',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../../../public/fonts/inter/woff2/Inter-600-italic.woff2',
      weight: '600',
      style: 'italic',
    },
    {
      path: '../../../public/fonts/inter/woff2/Inter-700-normal.woff2',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../../../public/fonts/inter/woff2/Inter-700-italic.woff2',
      weight: '700',
      style: 'italic',
    },
  ],
  display: 'swap', // Prevent invisible text during font loading
  preload: true,   // Preload critical font weights
  fallback: [
    '-apple-system',
    'BlinkMacSystemFont',
    '"Segoe UI"',
    'Roboto',
    '"Helvetica Neue"',
    'Arial',
    'sans-serif'
  ],
  variable: '--font-inter',
});

/**
 * Generate preload link elements for critical fonts
 */
export function getCriticalFontPreloads(): Array<{
  rel: 'preload';
  as: 'font';
  type: string;
  href: string;
  crossOrigin: 'anonymous' | 'use-credentials' | '';
}> {
  return [
    {
      rel: 'preload',
      as: 'font',
      type: 'font/woff2',
      href: '/fonts/inter/woff2/Inter-400-normal.woff2',
      crossOrigin: 'anonymous',
    },
    {
      rel: 'preload',
      as: 'font',
      type: 'font/woff2',
      href: '/fonts/inter/woff2/Inter-600-normal.woff2',
      crossOrigin: 'anonymous',
    },
  ];
}

/**
 * Get font CSS variables for use in Tailwind or custom CSS
 */
export function getFontCSSVariables(): Record<string, string> {
  return {
    '--font-inter': inter.style.fontFamily,
    '--font-fallback': SYSTEM_FONT_FALLBACKS.join(', '),
  };
}

/**
 * Get complete font family string with fallbacks
 */
export function getInterFontFamily(): string {
  return [inter.style.fontFamily, ...SYSTEM_FONT_FALLBACKS].join(', ');
}