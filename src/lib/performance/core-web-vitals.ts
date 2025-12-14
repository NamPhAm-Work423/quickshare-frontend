// Core Web Vitals Configuration and Optimization
export interface CWVConfig {
  lcp: {
    target: number;  // seconds
    heroImagePriority: boolean;
    preloadCriticalImages: string[];
  };
  cls: {
    target: number;
    reserveSpaceForDynamic: boolean;
    fontDisplay: 'auto' | 'block' | 'swap' | 'fallback' | 'optional';
  };
  fid: {
    target: number;  // milliseconds
    deferNonCriticalJS: boolean;
    prefetchStrategy: 'viewport' | 'intent' | 'none';
  };
}

export const coreWebVitalsConfig: CWVConfig = {
  lcp: {
    target: 2.5,  // Google's "Good" threshold
    heroImagePriority: true,
    preloadCriticalImages: [
      '/hero-image.webp',
      '/logo.svg',
    ],
  },
  cls: {
    target: 0.1,  // Google's "Good" threshold
    reserveSpaceForDynamic: true,
    fontDisplay: 'swap',
  },
  fid: {
    target: 100,  // Google's "Good" threshold (milliseconds)
    deferNonCriticalJS: true,
    prefetchStrategy: 'viewport',
  },
};

// Performance optimization utilities
export function generatePreloadLinks(images: string[]): string[] {
  return images.map(src => 
    `<link rel="preload" href="${src}" as="image" fetchpriority="high" />`
  );
}

export function generateFontPreloadLinks(fonts: string[]): string[] {
  return fonts.map(href => 
    `<link rel="preload" href="${href}" as="font" type="font/woff2" crossorigin="anonymous" />`
  );
}

export interface PerformanceMetrics {
  lcp?: number;
  cls?: number;
  fid?: number;
  ttfb?: number;
}

export function validateCoreWebVitals(metrics: PerformanceMetrics): {
  lcp: 'good' | 'needs-improvement' | 'poor';
  cls: 'good' | 'needs-improvement' | 'poor';
  fid: 'good' | 'needs-improvement' | 'poor';
} {
  return {
    lcp: metrics.lcp ? 
      (metrics.lcp <= 2.5 ? 'good' : metrics.lcp <= 4.0 ? 'needs-improvement' : 'poor') : 'good',
    cls: metrics.cls ? 
      (metrics.cls <= 0.1 ? 'good' : metrics.cls <= 0.25 ? 'needs-improvement' : 'poor') : 'good',
    fid: metrics.fid ? 
      (metrics.fid <= 100 ? 'good' : metrics.fid <= 300 ? 'needs-improvement' : 'poor') : 'good',
  };
}