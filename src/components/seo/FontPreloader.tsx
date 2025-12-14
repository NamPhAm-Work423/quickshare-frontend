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
  const generateFontPreloadLinks = (fontConfig: FontConfig): ReactElement[] => {
    const links: ReactElement[] = [];
    
    fontConfig.weights.forEach((weight) => {
      fontConfig.styles.forEach((style) => {
        const shouldPreload = fontConfig.preload || criticalFonts.includes(fontConfig.family);
        
        if (shouldPreload) {
          // Generate Google Fonts URL for preloading
          const fontUrl = generateGoogleFontUrl(fontConfig.family, weight, style);
          
          links.push(
            <link
              key={`${fontConfig.family}-${weight}-${style}`}
              rel="preload"
              href={fontUrl}
              as="font"
              type="font/woff2"
              crossOrigin="anonymous"
            />
          );
        }
      });
    });
    
    return links;
  };

  const generateFontFaceCSS = (fontConfig: FontConfig): string => {
    return fontConfig.weights.map((weight) => 
      fontConfig.styles.map((style) => {
        const fontUrl = generateGoogleFontUrl(fontConfig.family, weight, style);
        return `
          @font-face {
            font-family: '${fontConfig.family}';
            font-style: ${style};
            font-weight: ${weight};
            font-display: ${fontConfig.display};
            src: url('${fontUrl}') format('woff2');
          }
        `;
      }).join('')
    ).join('');
  };

  const allPreloadLinks = fonts.flatMap(generateFontPreloadLinks);
  const fontFaceCSS = fonts.map(generateFontFaceCSS).join('');

  return (
    <>
      {/* Preload critical fonts */}
      {allPreloadLinks}
      
      {/* Font face declarations */}
      {fontFaceCSS && (
        <style
          dangerouslySetInnerHTML={{
            __html: fontFaceCSS,
          }}
        />
      )}
      
      {/* DNS prefetch for Google Fonts */}
      <link rel="dns-prefetch" href="//fonts.googleapis.com" />
      <link rel="dns-prefetch" href="//fonts.gstatic.com" />
      
      {/* Preconnect for faster font loading */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
    </>
  );
}

// Utility function to generate Google Fonts URL
function generateGoogleFontUrl(family: string, weight: number, style: string): string {
  const familyParam = family.replace(/\s+/g, '+');
  const styleParam = style === 'italic' ? 'ital,' : '';
  const weightParam = `${styleParam}wght@${style === 'italic' ? '1,' : '0,'}${weight}`;
  
  return `https://fonts.googleapis.com/css2?family=${familyParam}:${weightParam}&display=swap`;
}

// Hook for managing font loading performance
export function useFontPreloading(fonts: FontConfig[]) {
  const preloadCriticalFonts = (criticalFamilies: string[]) => {
    if (typeof window === 'undefined') return;
    
    fonts
      .filter(font => criticalFamilies.includes(font.family))
      .forEach(font => {
        font.weights.forEach(weight => {
          font.styles.forEach(style => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.href = generateGoogleFontUrl(font.family, weight, style);
            link.as = 'font';
            link.type = 'font/woff2';
            link.crossOrigin = 'anonymous';
            document.head.appendChild(link);
          });
        });
      });
  };

  const loadFontAsync = async (fontConfig: FontConfig): Promise<void> => {
    if (typeof window === 'undefined' || !('FontFace' in window)) return;
    
    const promises = fontConfig.weights.flatMap(weight =>
      fontConfig.styles.map(async (style) => {
        const fontUrl = generateGoogleFontUrl(fontConfig.family, weight, style);
        const fontFace = new FontFace(
          fontConfig.family,
          `url(${fontUrl})`,
          {
            weight: weight.toString(),
            style,
            display: fontConfig.display,
          }
        );
        
        try {
          const loadedFont = await fontFace.load();
          document.fonts.add(loadedFont);
        } catch (error) {
          console.warn(`Failed to load font: ${fontConfig.family} ${weight} ${style}`, error);
        }
      })
    );
    
    await Promise.all(promises);
  };

  return {
    preloadCriticalFonts,
    loadFontAsync,
  };
}

export default FontPreloader;