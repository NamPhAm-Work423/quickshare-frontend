'use client';

import { useEffect, useCallback, useRef } from 'react';
import { getCLS, getFID, getFCP, getLCP, getTTFB } from '../../lib/web-vitals-mock';
import { 
  fontLoadingStateManager, 
  monitorFontLoading as monitorFontLoadingState, 
  getFontLoadingMetrics,
  FontLoadingState 
} from '../../lib/fonts/fallbacks';
import { 
  generatePreloadLinks, 
  preloadFont,
  waitForFontsReady 
} from '../../lib/fonts/loader';
import { CRITICAL_FONT_PRELOADS } from '../../lib/fonts/config';

export interface CoreWebVitalsProps {
  lcpElement?: string;        // LCP optimization target selector
  preloadImages?: string[];   // Critical images to preload
  prefetchRoutes?: string[];  // Routes to prefetch
  reportWebVitals?: boolean;  // Whether to report metrics
  onMetric?: (metric: any) => void; // Callback for metric reporting
  // Font optimization props
  preloadFonts?: boolean;     // Whether to preload critical fonts
  monitorFontLoading?: boolean; // Whether to monitor font loading performance
  fontLoadingTimeout?: number; // Timeout for font loading (ms)
  onFontMetric?: (metric: FontLoadingMetric) => void; // Callback for font metrics
}

export interface FontLoadingMetric {
  type: 'font-loading' | 'font-error' | 'font-timeout' | 'font-cls';
  family: string;
  loadTime?: number;
  error?: string;
  clsValue?: number;
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
  preloadFonts = true,
  monitorFontLoading = true,
  fontLoadingTimeout = 3000,
  onFontMetric,
}: CoreWebVitalsProps) {
  const clsObserverRef = useRef<PerformanceObserver | null>(null);
  const fontLoadingStartTime = useRef<number>(performance.now());
  // Font loading error reporting callback
  const reportFontMetric = useCallback((metric: FontLoadingMetric) => {
    if (onFontMetric) {
      onFontMetric(metric);
    }
    
    // Send to analytics in production
    if (process.env.NODE_ENV === 'production' && typeof window !== 'undefined') {
      if ('gtag' in window) {
        (window as any).gtag('event', 'font_loading', {
          event_category: 'Font Performance',
          event_label: metric.family,
          custom_parameter_1: metric.type,
          value: metric.loadTime || 0,
          non_interaction: true,
        });
      }
    }
  }, [onFontMetric]);

  useEffect(() => {
    if (!reportWebVitals) return;

    // Report Core Web Vitals metrics
    const reportMetric = (metric: any) => {
      if (onMetric) {
        onMetric(metric);
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

    // Enhanced CLS measurement that accounts for font swapping
    const enhancedCLSReporting = (metric: any) => {
      reportMetric(metric);
      
      // Report font-related CLS if value is significant
      if (metric.name === 'CLS' && metric.value > 0.05) {
        reportFontMetric({
          type: 'font-cls',
          family: 'unknown',
          clsValue: metric.value
        });
      }
    };

    // Measure all Core Web Vitals with enhanced CLS tracking
    getCLS(enhancedCLSReporting);
    getFID(reportMetric);
    getFCP(reportMetric);
    getLCP(reportMetric);
    getTTFB(reportMetric);
  }, [reportWebVitals, onMetric, reportFontMetric]);

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

  // Font preloading support
  useEffect(() => {
    if (!preloadFonts || typeof window === 'undefined') return;

    const preloadCriticalFonts = async () => {
      try {
        const preloadLinks = generatePreloadLinks(CRITICAL_FONT_PRELOADS);
        
        // Add preload links to document head
        preloadLinks.forEach((linkAttrs) => {
          const existingLink = document.querySelector(`link[href="${linkAttrs.href}"]`);
          if (!existingLink) {
            const link = document.createElement('link');
            Object.entries(linkAttrs).forEach(([key, value]) => {
              if (key === 'crossOrigin') {
                link.crossOrigin = value as string;
              } else {
                link.setAttribute(key, value as string);
              }
            });
            document.head.appendChild(link);
          }
        });

        // Preload fonts programmatically for better error handling
        const preloadPromises = CRITICAL_FONT_PRELOADS.map(async (rule) => {
          const href = `/fonts/${rule.family.toLowerCase()}/${rule.format}/${rule.family}-${rule.weight}-${rule.style}.${rule.format}`;
          
          try {
            await preloadFont(href, rule.format);
            reportFontMetric({
              type: 'font-loading',
              family: rule.family,
              loadTime: performance.now() - fontLoadingStartTime.current
            });
          } catch (error) {
            reportFontMetric({
              type: 'font-error',
              family: rule.family,
              error: error instanceof Error ? error.message : 'Unknown error'
            });
          }
        });

        await Promise.allSettled(preloadPromises);
      } catch (error) {
        console.error('Error preloading fonts:', error);
      }
    };

    preloadCriticalFonts();
  }, [preloadFonts, reportFontMetric]);

  // Font loading performance monitoring
  useEffect(() => {
    if (!monitorFontLoading || typeof window === 'undefined') return;

    const monitorFonts = async () => {
      // Monitor critical fonts
      const fontFamilies = [...new Set(CRITICAL_FONT_PRELOADS.map(rule => rule.family))];
      
      const monitoringPromises = fontFamilies.map(async (family) => {
        try {
          const state = await monitorFontLoadingState(family, fontLoadingTimeout);
          
          if (state.status === 'loaded' && state.endTime) {
            reportFontMetric({
              type: 'font-loading',
              family,
              loadTime: state.endTime - state.startTime
            });
          } else if (state.status === 'error') {
            reportFontMetric({
              type: 'font-error',
              family,
              error: state.error?.message || 'Font loading failed'
            });
          } else if (state.status === 'timeout') {
            reportFontMetric({
              type: 'font-timeout',
              family,
              loadTime: fontLoadingTimeout
            });
          }
        } catch (error) {
          reportFontMetric({
            type: 'font-error',
            family,
            error: error instanceof Error ? error.message : 'Monitoring failed'
          });
        }
      });

      await Promise.allSettled(monitoringPromises);
    };

    // Start monitoring after a brief delay to allow initial font loading
    const timeoutId = setTimeout(monitorFonts, 100);
    
    return () => clearTimeout(timeoutId);
  }, [monitorFontLoading, fontLoadingTimeout, reportFontMetric]);

  // CLS measurement during font swapping
  useEffect(() => {
    if (typeof window === 'undefined' || !window.PerformanceObserver) return;

    try {
      // Create observer for layout shifts
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'layout-shift' && !(entry as any).hadRecentInput) {
            const layoutShift = entry as PerformanceEntry & { value: number };
            
            // Check if this shift might be font-related by timing
            const timeSinceStart = entry.startTime;
            const isLikelyFontShift = timeSinceStart < 5000; // First 5 seconds
            
            if (isLikelyFontShift && layoutShift.value > 0.01) {
              reportFontMetric({
                type: 'font-cls',
                family: 'detected-shift',
                clsValue: layoutShift.value
              });
            }
          }
        }
      });

      observer.observe({ entryTypes: ['layout-shift'] });
      clsObserverRef.current = observer;

      return () => {
        observer.disconnect();
        clsObserverRef.current = null;
      };
    } catch (error) {
      console.warn('Layout shift observation not supported:', error);
    }
  }, [reportFontMetric]);

  // Font loading state change listener
  useEffect(() => {
    const handleFontStateChange = (state: FontLoadingState) => {
      if (state.status === 'error' && state.error) {
        reportFontMetric({
          type: 'font-error',
          family: state.family,
          error: state.error.message
        });
      } else if (state.status === 'timeout') {
        reportFontMetric({
          type: 'font-timeout',
          family: state.family,
          loadTime: fontLoadingTimeout
        });
      }
    };

    fontLoadingStateManager.addListener(handleFontStateChange);

    return () => {
      fontLoadingStateManager.removeListener(handleFontStateChange);
    };
  }, [reportFontMetric, fontLoadingTimeout]);

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

// Utility function to get font loading performance summary
export function getFontPerformanceSummary(): {
  totalFonts: number;
  loadedFonts: number;
  failedFonts: number;
  averageLoadTime: number;
  slowestFont: FontLoadingState | null;
  fontLoadingScore: 'good' | 'needs-improvement' | 'poor';
} {
  const metrics = getFontLoadingMetrics();
  
  // Calculate font loading performance score
  let fontLoadingScore: 'good' | 'needs-improvement' | 'poor' = 'good';
  
  if (metrics.failedFonts > 0 || metrics.averageLoadTime > 2000) {
    fontLoadingScore = 'poor';
  } else if (metrics.averageLoadTime > 1000) {
    fontLoadingScore = 'needs-improvement';
  }
  
  return {
    ...metrics,
    fontLoadingScore
  };
}

// Utility function to wait for critical fonts with timeout
export async function waitForCriticalFonts(timeout: number = 3000): Promise<boolean> {
  try {
    await waitForFontsReady(timeout);
    return true;
  } catch (error) {
    console.warn('Critical fonts did not load within timeout:', error);
    return false;
  }
}

export default CoreWebVitals;