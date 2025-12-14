'use client';

import { useEffect, useState } from 'react';
import { getCLS, getFID, getFCP, getLCP, getTTFB } from '../lib/web-vitals-mock';

export interface PerformanceMetrics {
  lcp?: number;
  cls?: number;
  fid?: number;
  fcp?: number;
  ttfb?: number;
}

export interface PerformanceOptimizationConfig {
  reportWebVitals: boolean;
  preloadCriticalImages: string[];
  preloadCriticalFonts: string[];
  prefetchRoutes: string[];
  lcpTarget?: string; // CSS selector for LCP element
  onMetric?: (metric: any) => void;
}

export function usePerformanceOptimization(config: PerformanceOptimizationConfig) {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({});
  const [isOptimized, setIsOptimized] = useState(false);

  // Report Core Web Vitals
  useEffect(() => {
    if (!config.reportWebVitals) return;

    const reportMetric = (metric: any) => {
      setMetrics(prev => ({
        ...prev,
        [metric.name.toLowerCase()]: metric.value,
      }));

      if (config.onMetric) {
        config.onMetric(metric);
      }

      // Log in development
      if (process.env.NODE_ENV === 'development') {
        console.log(`[Performance] ${metric.name}:`, metric.value);
      }
    };

    getCLS(reportMetric);
    getFID(reportMetric);
    getFCP(reportMetric);
    getLCP(reportMetric);
    getTTFB(reportMetric);
  }, [config.reportWebVitals, config.onMetric]);

  // Preload critical resources
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const preloadResource = (href: string, as: string, type?: string) => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = href;
      link.as = as;
      if (type) link.type = type;
      if (as === 'image') link.setAttribute('fetchpriority', 'high');
      if (as === 'font') link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    };

    // Preload critical images
    config.preloadCriticalImages.forEach(src => {
      preloadResource(src, 'image');
    });

    // Preload critical fonts
    config.preloadCriticalFonts.forEach(href => {
      preloadResource(href, 'font', 'font/woff2');
    });

    setIsOptimized(true);
  }, [config.preloadCriticalImages, config.preloadCriticalFonts]);

  // Prefetch routes on interaction
  useEffect(() => {
    if (typeof window === 'undefined' || config.prefetchRoutes.length === 0) return;

    const prefetchedRoutes = new Set<string>();

    const prefetchRoute = (href: string) => {
      if (prefetchedRoutes.has(href)) return;
      
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = href;
      document.head.appendChild(link);
      prefetchedRoutes.add(href);
    };

    const handleMouseEnter = (event: MouseEvent) => {
      const target = event.target as HTMLAnchorElement;
      if (target.tagName === 'A' && target.href) {
        const pathname = new URL(target.href).pathname;
        if (config.prefetchRoutes.includes(pathname)) {
          prefetchRoute(target.href);
        }
      }
    };

    document.addEventListener('mouseenter', handleMouseEnter, true);
    
    return () => {
      document.removeEventListener('mouseenter', handleMouseEnter, true);
    };
  }, [config.prefetchRoutes]);

  // Optimize LCP element
  useEffect(() => {
    if (!config.lcpTarget || typeof window === 'undefined') return;

    const element = document.querySelector(config.lcpTarget);
    if (element && element instanceof HTMLImageElement) {
      element.fetchPriority = 'high';
      element.loading = 'eager';
    }
  }, [config.lcpTarget]);

  // Calculate performance score
  const getPerformanceScore = (): number => {
    const { lcp, cls, fid } = metrics;
    let score = 0;
    let count = 0;

    if (lcp !== undefined) {
      score += lcp <= 2.5 ? 100 : lcp <= 4.0 ? 50 : 0;
      count++;
    }

    if (cls !== undefined) {
      score += cls <= 0.1 ? 100 : cls <= 0.25 ? 50 : 0;
      count++;
    }

    if (fid !== undefined) {
      score += fid <= 100 ? 100 : fid <= 300 ? 50 : 0;
      count++;
    }

    return count > 0 ? Math.round(score / count) : 0;
  };

  // Check if Core Web Vitals pass Google's thresholds
  const passesWebVitals = (): boolean => {
    const { lcp, cls, fid } = metrics;
    return (
      (lcp === undefined || lcp <= 2.5) &&
      (cls === undefined || cls <= 0.1) &&
      (fid === undefined || fid <= 100)
    );
  };

  return {
    metrics,
    isOptimized,
    performanceScore: getPerformanceScore(),
    passesWebVitals: passesWebVitals(),
    preloadImage: (src: string) => {
      if (typeof window !== 'undefined') {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = src;
        link.as = 'image';
        link.setAttribute('fetchpriority', 'high');
        document.head.appendChild(link);
      }
    },
    prefetchRoute: (href: string) => {
      if (typeof window !== 'undefined') {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = href;
        document.head.appendChild(link);
      }
    },
  };
}

export default usePerformanceOptimization;