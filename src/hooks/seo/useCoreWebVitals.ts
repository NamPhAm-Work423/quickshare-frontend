import { useEffect, useState, useCallback } from 'react';

export interface CoreWebVitalsMetrics {
  lcp: number | null;
  fid: number | null;
  cls: number | null;
  fcp: number | null;
  ttfb: number | null;
}

export interface CoreWebVitalsConfig {
  lcpTarget: number;
  fidTarget: number;
  clsTarget: number;
  reportingEndpoint?: string;
  enableReporting?: boolean;
}

export interface UseCoreWebVitalsOptions {
  config?: CoreWebVitalsConfig;
  onMetric?: (metric: { name: string; value: number; rating: 'good' | 'needs-improvement' | 'poor' }) => void;
}

const DEFAULT_CONFIG: CoreWebVitalsConfig = {
  lcpTarget: 2500, // 2.5 seconds
  fidTarget: 100,  // 100 milliseconds
  clsTarget: 0.1,  // 0.1
  enableReporting: false,
};

/**
 * Hook for monitoring Core Web Vitals performance metrics
 * Provides real-time performance data and optimization suggestions
 */
export function useCoreWebVitals(options: UseCoreWebVitalsOptions = {}) {
  const { config = DEFAULT_CONFIG, onMetric } = options;
  const [metrics, setMetrics] = useState<CoreWebVitalsMetrics>({
    lcp: null,
    fid: null,
    cls: null,
    fcp: null,
    ttfb: null,
  });
  const [isSupported, setIsSupported] = useState(false);

  // Rate metric performance
  const rateMetric = useCallback((name: string, value: number): 'good' | 'needs-improvement' | 'poor' => {
    switch (name) {
      case 'LCP':
        return value <= 2500 ? 'good' : value <= 4000 ? 'needs-improvement' : 'poor';
      case 'FID':
        return value <= 100 ? 'good' : value <= 300 ? 'needs-improvement' : 'poor';
      case 'CLS':
        return value <= 0.1 ? 'good' : value <= 0.25 ? 'needs-improvement' : 'poor';
      case 'FCP':
        return value <= 1800 ? 'good' : value <= 3000 ? 'needs-improvement' : 'poor';
      case 'TTFB':
        return value <= 800 ? 'good' : value <= 1800 ? 'needs-improvement' : 'poor';
      default:
        return 'needs-improvement';
    }
  }, []);

  // Handle metric reporting
  const handleMetric = useCallback((metric: { name: string; value: number }) => {
    const rating = rateMetric(metric.name, metric.value);
    
    setMetrics(prev => ({
      ...prev,
      [metric.name.toLowerCase()]: metric.value,
    }));

    // Call user-provided callback
    if (onMetric) {
      onMetric({ ...metric, rating });
    }

    // Report to analytics endpoint if configured
    if (config.enableReporting && config.reportingEndpoint) {
      fetch(config.reportingEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          metric: metric.name,
          value: metric.value,
          rating,
          url: window.location.href,
          timestamp: Date.now(),
        }),
      }).catch(() => {
        // Silently fail - don't block user experience
      });
    }
  }, [config, onMetric, rateMetric]);

  useEffect(() => {
    // Check if Web Vitals API is supported
    if (typeof window === 'undefined') {
      return;
    }

    setIsSupported('PerformanceObserver' in window);

    // Use mock web-vitals for better compatibility
    import('@/lib/web-vitals-mock').then(({ getLCP, getFID, getCLS, getFCP, getTTFB }) => {
      // Largest Contentful Paint
      getLCP(handleMetric);
      
      // First Input Delay
      getFID(handleMetric);
      
      // Cumulative Layout Shift
      getCLS(handleMetric);
      
      // First Contentful Paint
      getFCP(handleMetric);
      
      // Time to First Byte
      getTTFB(handleMetric);
    }).catch(() => {
      // web-vitals library not available
      setIsSupported(false);
    });
  }, [handleMetric]);

  // Get optimization suggestions based on current metrics
  const getOptimizationSuggestions = useCallback(() => {
    const suggestions: Array<{
      metric: string;
      issue: string;
      suggestions: string[];
    }> = [];

    if (metrics.lcp && metrics.lcp > config.lcpTarget) {
      suggestions.push({
        metric: 'LCP',
        issue: `LCP is ${metrics.lcp}ms (target: ${config.lcpTarget}ms)`,
        suggestions: [
          'Optimize images with next/image',
          'Preload critical resources',
          'Reduce server response time',
          'Use CDN for static assets',
        ],
      });
    }

    if (metrics.fid && metrics.fid > config.fidTarget) {
      suggestions.push({
        metric: 'FID',
        issue: `FID is ${metrics.fid}ms (target: ${config.fidTarget}ms)`,
        suggestions: [
          'Reduce JavaScript execution time',
          'Code split large bundles',
          'Use web workers for heavy tasks',
          'Defer non-critical JavaScript',
        ],
      });
    }

    if (metrics.cls && metrics.cls > config.clsTarget) {
      suggestions.push({
        metric: 'CLS',
        issue: `CLS is ${metrics.cls} (target: ${config.clsTarget})`,
        suggestions: [
          'Set explicit dimensions for images',
          'Reserve space for dynamic content',
          'Use font-display: swap',
          'Avoid inserting content above existing content',
        ],
      });
    }

    return suggestions;
  }, [metrics, config]);

  // Calculate overall performance score
  const getPerformanceScore = useCallback(() => {
    const scores: number[] = [];
    
    if (metrics.lcp !== null) {
      const lcpScore = metrics.lcp <= 2500 ? 100 : metrics.lcp <= 4000 ? 50 : 0;
      scores.push(lcpScore);
    }
    
    if (metrics.fid !== null) {
      const fidScore = metrics.fid <= 100 ? 100 : metrics.fid <= 300 ? 50 : 0;
      scores.push(fidScore);
    }
    
    if (metrics.cls !== null) {
      const clsScore = metrics.cls <= 0.1 ? 100 : metrics.cls <= 0.25 ? 50 : 0;
      scores.push(clsScore);
    }

    return scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : null;
  }, [metrics]);

  return {
    metrics,
    isSupported,
    optimizationSuggestions: getOptimizationSuggestions(),
    performanceScore: getPerformanceScore(),
    config,
  };
}