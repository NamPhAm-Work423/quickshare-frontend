// Mock web-vitals for development when package is not available
export interface Metric {
  name: string;
  value: number;
  id: string;
  delta: number;
  entries: PerformanceEntry[];
}

type ReportHandler = (metric: Metric) => void;

// Mock implementations that work in browser environment
export function getCLS(onReport: ReportHandler): void {
  if (typeof window === 'undefined') return;
  
  // Simple CLS measurement using PerformanceObserver
  try {
    const observer = new PerformanceObserver((list) => {
      let clsValue = 0;
      const entries = list.getEntries();
      
      for (const entry of entries) {
        if (!(entry as any).hadRecentInput) {
          clsValue += (entry as any).value;
        }
      }
      
      if (clsValue > 0) {
        onReport({
          name: 'CLS',
          value: clsValue,
          id: 'cls-' + Date.now(),
          delta: clsValue,
          entries: entries,
        });
      }
    });
    
    observer.observe({ type: 'layout-shift', buffered: true });
  } catch (e) {
    // Fallback for browsers without PerformanceObserver
    console.warn('CLS measurement not supported');
  }
}

export function getFID(onReport: ReportHandler): void {
  if (typeof window === 'undefined') return;
  
  try {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      for (const entry of entries) {
        onReport({
          name: 'FID',
          value: (entry as any).processingStart - entry.startTime,
          id: 'fid-' + Date.now(),
          delta: (entry as any).processingStart - entry.startTime,
          entries: [entry],
        });
      }
    });
    
    observer.observe({ type: 'first-input', buffered: true });
  } catch (e) {
    console.warn('FID measurement not supported');
  }
}

export function getFCP(onReport: ReportHandler): void {
  if (typeof window === 'undefined') return;
  
  try {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      for (const entry of entries) {
        if (entry.name === 'first-contentful-paint') {
          onReport({
            name: 'FCP',
            value: entry.startTime,
            id: 'fcp-' + Date.now(),
            delta: entry.startTime,
            entries: [entry],
          });
        }
      }
    });
    
    observer.observe({ type: 'paint', buffered: true });
  } catch (e) {
    console.warn('FCP measurement not supported');
  }
}

export function getLCP(onReport: ReportHandler): void {
  if (typeof window === 'undefined') return;
  
  try {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      
      onReport({
        name: 'LCP',
        value: lastEntry.startTime,
        id: 'lcp-' + Date.now(),
        delta: lastEntry.startTime,
        entries: entries,
      });
    });
    
    observer.observe({ type: 'largest-contentful-paint', buffered: true });
  } catch (e) {
    console.warn('LCP measurement not supported');
  }
}

export function getTTFB(onReport: ReportHandler): void {
  if (typeof window === 'undefined') return;
  
  try {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      for (const entry of entries) {
        if (entry.entryType === 'navigation') {
          const navEntry = entry as PerformanceNavigationTiming;
          onReport({
            name: 'TTFB',
            value: navEntry.responseStart - navEntry.fetchStart,
            id: 'ttfb-' + Date.now(),
            delta: navEntry.responseStart - navEntry.fetchStart,
            entries: [entry],
          });
        }
      }
    });
    
    observer.observe({ type: 'navigation', buffered: true });
  } catch (e) {
    console.warn('TTFB measurement not supported');
  }
}