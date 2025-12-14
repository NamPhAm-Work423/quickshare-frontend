'use client';

import { useEffect } from 'react';
import { getCLS, getFID, getFCP, getLCP, getTTFB } from '../../lib/web-vitals-mock';

export interface CoreWebVitalsProps {
  lcpElement?: string;        // LCP optimization target selector
  preloadImages?: string[];   // Critical images to preload
  prefetchRoutes?: string[];  // Routes to prefetch
  reportWebVitals?: boolean;  // Whether to report metrics
  onMetric?: (metric: any) => void; // Callback for metric reporting
}

export interface PerformanceConfig {
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

const defaultConfig: PerformanceConfig = {
  lcp: {
    target: 2.5,  // Google's "Good" threshold
    heroImagePriority: true,
    preloadCriticalImages: [],
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

export function CoreWebVitals({
  lcpElement,
  preloadImages = [],
  prefetchRoutes = [],
  reportWebVitals = true,
  onMetric,
}: CoreWebVitalsProps) {
  useEffect(() => {
    if (!reportWebVitals) return;

    // Report Core Web Vitals metrics
    const reportMetric = (metric: any) => {
      if (onMetric) {
        onMetric(metric);
      }
      
      // Log metrics in development
      if (process.env.NODE_ENV === 'development') {
        console.log(`[Core Web Vitals] ${metric.name}:`, metric.value);
      }
      
      // Send to analytics in production
      if (process.env.NODE_ENV === 'production' && typeof window !== 'undefined') {
        // Example: Send to Google Analytics 4
        if ('gtag' in window) {
          (window as any).gtag('event', metric.name, {
            event_category: 'Web Vitals',
            value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
            event_label: metric.id,
            non_interaction: true,
          });
        }
      }
    };

    // Measure all Core Web Vitals
    getCLS(reportMetric);
    getFID(reportMetric);
    getFCP(reportMetric);
    getLCP(reportMetric);
    getTTFB(reportMetric);
  }, [reportWebVitals, onMetric]);

  useEffect(() => {
    // LCP optimization: Mark hero element with high priority
    if (lcpElement && typeof window !== 'undefined') {
      const element = document.querySelector(lcpElement);
      if (element && element instanceof HTMLImageElement) {
        element.fetchPriority = 'high';
        element.loading = 'eager';
      }
    }
  }, [lcpElement]);

  useEffect(() => {
    // Prefetch critical routes on interaction or viewport
    if (prefetchRoutes.length > 0 && typeof window !== 'undefined') {
      const prefetchRoute = (href: string) => {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = href;
        document.head.appendChild(link);
      };

      // Prefetch on mouse enter for better perceived performance
      const handleMouseEnter = (event: MouseEvent) => {
        const target = event.target as HTMLAnchorElement;
        if (target.tagName === 'A' && target.href) {
          const pathname = new URL(target.href).pathname;
          if (prefetchRoutes.includes(pathname)) {
            prefetchRoute(target.href);
          }
        }
      };

      document.addEventListener('mouseenter', handleMouseEnter, true);
      
      return () => {
        document.removeEventListener('mouseenter', handleMouseEnter, true);
      };
    }
  }, [prefetchRoutes]);

  useEffect(() => {
    // Preload critical images
    if (preloadImages.length > 0 && typeof window !== 'undefined') {
      preloadImages.forEach((src) => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = src;
        link.as = 'image';
        link.setAttribute('fetchpriority', 'high');
        document.head.appendChild(link);
      });
    }
  }, [preloadImages]);

  // This component doesn't render anything visible
  return null;
}

// Utility function to validate Core Web Vitals thresholds
export function validateCoreWebVitals(metrics: {
  lcp?: number;
  cls?: number;
  fid?: number;
  ttfb?: number;
}): {
  lcp: 'good' | 'needs-improvement' | 'poor';
  cls: 'good' | 'needs-improvement' | 'poor';
  fid: 'good' | 'needs-improvement' | 'poor';
  ttfb: 'good' | 'needs-improvement' | 'poor';
} {
  return {
    lcp: metrics.lcp ? 
      (metrics.lcp <= 2.5 ? 'good' : metrics.lcp <= 4.0 ? 'needs-improvement' : 'poor') : 'good',
    cls: metrics.cls ? 
      (metrics.cls <= 0.1 ? 'good' : metrics.cls <= 0.25 ? 'needs-improvement' : 'poor') : 'good',
    fid: metrics.fid ? 
      (metrics.fid <= 100 ? 'good' : metrics.fid <= 300 ? 'needs-improvement' : 'poor') : 'good',
    ttfb: metrics.ttfb ? 
      (metrics.ttfb <= 800 ? 'good' : metrics.ttfb <= 1800 ? 'needs-improvement' : 'poor') : 'good',
  };
}

export default CoreWebVitals;