import { ReactElement } from 'react';

export interface FontPreloaderProps {
  fonts: FontConfig[];
  criticalFonts?: string[]; // Font families that should be preloaded immediately
}

export interface FontConfig {
  family: string;
  weights: number[];
  styles: ('normal' | 'italic')[];
  display: 'auto' | 'block' | 'swap' | 'fallback' | 'optional';
  preload?: boolean;
  fallback?: string;
}

// Common font configurations
export const commonFonts: Record<string, FontConfig> = {
  inter: {
    family: 'Inter',
    weights: [400, 500, 600, 700],
    styles: ['normal'],
    display: 'swap',
    preload: true,
    fallback: 'system-ui, -apple-system, sans-serif',
  },
  roboto: {
    family: 'Roboto',
    weights: [300, 400, 500, 700],
    styles: ['normal', 'italic'],
    display: 'swap',
    preload: false,
    fallback: 'Arial, sans-serif',
  },
  playfair: {
    family: 'Playfair Display',
    weights: [400, 700],
    styles: ['normal', 'italic'],
    display: 'swap',
    preload: false,
    fallback: 'Georgia, serif',
  },
};

export function FontPreloader({ fonts, criticalFonts = [] }: FontPreloaderProps): ReactElement {
  // Since we're using local fonts, this component now just returns null
  // Local fonts are handled by Next.js localFont()
  return (
    <>
      {/* Local fonts are handled by Next.js localFont() */}
      {/* No external font preloading needed */}
    </>
  );
}

// Utility function to generate local font URLs (for future use)
function generateLocalFontUrl(family: string, weight: number, style: string): string {
  const styleStr = style === 'italic' ? '-italic' : '-normal';
  return `/fonts/${family.toLowerCase()}/woff2/${family}-${weight}${styleStr}.woff2`;
}

// Hook for managing local font loading performance
export function useFontPreloading(fonts: FontConfig[]) {
  const preloadCriticalFonts = (criticalFamilies: string[]) => {
    // Local fonts are preloaded via Next.js localFont(), no additional preloading needed
  };

  const loadFontAsync = async (fontConfig: FontConfig): Promise<void> => {
    // Local fonts are handled by Next.js, no async loading needed
  };

  return {
    preloadCriticalFonts,
    loadFontAsync,
  };
}

export default FontPreloader;