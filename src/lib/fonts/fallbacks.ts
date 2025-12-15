/**
 * Font fallback system with system font matching
 * Provides metric-based fallback font selection and graceful degradation
 */

import { FontConfig, FontMetrics, SYSTEM_FONT_FALLBACKS } from './config';

export interface SystemFontMetrics {
  family: string;
  metrics: FontMetrics;
  availability: {
    windows: boolean;
    macos: boolean;
    linux: boolean;
    android: boolean;
    ios: boolean;
  };
}

export interface FontLoadingState {
  family: string;
  status: 'loading' | 'loaded' | 'error' | 'timeout';
  startTime: number;
  endTime?: number;
  error?: Error;
}

export interface FallbackMatchResult {
  primary: string;
  fallbacks: string[];
  matchScore: number;
  systemFonts: string[];
}

// System font metrics database for accurate fallback matching
export const SYSTEM_FONT_METRICS: Record<string, SystemFontMetrics> = {
  'system-ui': {
    family: 'system-ui',
    metrics: {
      ascent: 2728,
      descent: -680,
      lineGap: 0,
      unitsPerEm: 2816,
      xHeight: 1536,
      capHeight: 2048
    },
    availability: {
      windows: true,
      macos: true,
      linux: true,
      android: true,
      ios: true
    }
  },
  '-apple-system': {
    family: '-apple-system',
    metrics: {
      ascent: 2728,
      descent: -680,
      lineGap: 0,
      unitsPerEm: 2816,
      xHeight: 1536,
      capHeight: 2048
    },
    availability: {
      windows: false,
      macos: true,
      linux: false,
      android: false,
      ios: true
    }
  },
  'BlinkMacSystemFont': {
    family: 'BlinkMacSystemFont',
    metrics: {
      ascent: 2728,
      descent: -680,
      lineGap: 0,
      unitsPerEm: 2816,
      xHeight: 1536,
      capHeight: 2048
    },
    availability: {
      windows: false,
      macos: true,
      linux: false,
      android: false,
      ios: false
    }
  },
  'Segoe UI': {
    family: 'Segoe UI',
    metrics: {
      ascent: 2210,
      descent: -514,
      lineGap: 0,
      unitsPerEm: 2048,
      xHeight: 1434,
      capHeight: 1825
    },
    availability: {
      windows: true,
      macos: false,
      linux: false,
      android: false,
      ios: false
    }
  },
  'Roboto': {
    family: 'Roboto',
    metrics: {
      ascent: 1900,
      descent: -500,
      lineGap: 0,
      unitsPerEm: 2048,
      xHeight: 1456,
      capHeight: 1456
    },
    availability: {
      windows: false,
      macos: false,
      linux: true,
      android: true,
      ios: false
    }
  },
  'Helvetica Neue': {
    family: 'Helvetica Neue',
    metrics: {
      ascent: 1577,
      descent: -471,
      lineGap: 0,
      unitsPerEm: 1000,
      xHeight: 1062,
      capHeight: 1443
    },
    availability: {
      windows: false,
      macos: true,
      linux: false,
      android: false,
      ios: true
    }
  },
  'Arial': {
    family: 'Arial',
    metrics: {
      ascent: 1854,
      descent: -434,
      lineGap: 67,
      unitsPerEm: 2048,
      xHeight: 1062,
      capHeight: 1467
    },
    availability: {
      windows: true,
      macos: true,
      linux: true,
      android: true,
      ios: true
    }
  }
};

// Font loading state management
class FontLoadingStateManager {
  private states = new Map<string, FontLoadingState>();
  private listeners = new Set<(state: FontLoadingState) => void>();

  /**
   * Start tracking font loading
   */
  startLoading(family: string): void {
    const state: FontLoadingState = {
      family,
      status: 'loading',
      startTime: performance.now()
    };
    
    this.states.set(family, state);
    this.notifyListeners(state);
  }

  /**
   * Mark font as loaded
   */
  markLoaded(family: string): void {
    const state = this.states.get(family);
    if (state) {
      state.status = 'loaded';
      state.endTime = performance.now();
      this.notifyListeners(state);
    }
  }

  /**
   * Mark font as failed
   */
  markError(family: string, error: Error): void {
    let state = this.states.get(family);
    if (!state) {
      // Create a new state if one doesn't exist
      state = {
        family,
        status: 'error',
        startTime: performance.now(),
        endTime: performance.now(),
        error
      };
      this.states.set(family, state);
    } else {
      state.status = 'error';
      state.endTime = performance.now();
      state.error = error;
    }
    this.notifyListeners(state);
  }

  /**
   * Mark font as timed out
   */
  markTimeout(family: string): void {
    const state = this.states.get(family);
    if (state) {
      state.status = 'timeout';
      state.endTime = performance.now();
      this.notifyListeners(state);
    }
  }

  /**
   * Get current state for a font
   */
  getState(family: string): FontLoadingState | undefined {
    return this.states.get(family);
  }

  /**
   * Get all font loading states
   */
  getAllStates(): FontLoadingState[] {
    return Array.from(this.states.values());
  }

  /**
   * Add listener for state changes
   */
  addListener(listener: (state: FontLoadingState) => void): void {
    this.listeners.add(listener);
  }

  /**
   * Remove listener
   */
  removeListener(listener: (state: FontLoadingState) => void): void {
    this.listeners.delete(listener);
  }

  /**
   * Clear all states
   */
  clear(): void {
    this.states.clear();
  }

  private notifyListeners(state: FontLoadingState): void {
    this.listeners.forEach(listener => {
      try {
        listener(state);
      } catch (error) {
        console.error('Error in font loading state listener:', error);
      }
    });
  }
}

// Global font loading state manager
export const fontLoadingStateManager = new FontLoadingStateManager();

/**
 * Calculate metric similarity score between two fonts
 */
export function calculateMetricSimilarity(
  primaryMetrics: FontMetrics,
  fallbackMetrics: FontMetrics
): number {
  // Normalize metrics to compare relative proportions
  const primaryRatio = {
    ascentRatio: primaryMetrics.ascent / primaryMetrics.unitsPerEm,
    descentRatio: Math.abs(primaryMetrics.descent) / primaryMetrics.unitsPerEm,
    xHeightRatio: primaryMetrics.xHeight / primaryMetrics.unitsPerEm,
    capHeightRatio: primaryMetrics.capHeight / primaryMetrics.unitsPerEm
  };

  const fallbackRatio = {
    ascentRatio: fallbackMetrics.ascent / fallbackMetrics.unitsPerEm,
    descentRatio: Math.abs(fallbackMetrics.descent) / fallbackMetrics.unitsPerEm,
    xHeightRatio: fallbackMetrics.xHeight / fallbackMetrics.unitsPerEm,
    capHeightRatio: fallbackMetrics.capHeight / fallbackMetrics.unitsPerEm
  };

  // Calculate differences in key metrics
  const ascentDiff = Math.abs(primaryRatio.ascentRatio - fallbackRatio.ascentRatio);
  const descentDiff = Math.abs(primaryRatio.descentRatio - fallbackRatio.descentRatio);
  const xHeightDiff = Math.abs(primaryRatio.xHeightRatio - fallbackRatio.xHeightRatio);
  const capHeightDiff = Math.abs(primaryRatio.capHeightRatio - fallbackRatio.capHeightRatio);

  // Weight the metrics by importance for layout stability
  const weightedDiff = (
    xHeightDiff * 0.4 +      // x-height is most important for readability
    capHeightDiff * 0.3 +    // cap height affects heading appearance
    ascentDiff * 0.2 +       // ascent affects line spacing
    descentDiff * 0.1        // descent is least critical
  );

  // Convert to similarity score (0-1, where 1 is perfect match)
  return Math.max(0, 1 - weightedDiff);
}

/**
 * Detect current platform for font availability
 */
export function detectPlatform(): keyof SystemFontMetrics['availability'] {
  if (typeof navigator === 'undefined') {
    return 'linux'; // Default for server-side
  }

  const userAgent = navigator.userAgent.toLowerCase();
  
  if (userAgent.includes('iphone') || userAgent.includes('ipad')) {
    return 'ios';
  }
  
  if (userAgent.includes('android')) {
    return 'android';
  }
  
  if (userAgent.includes('mac')) {
    return 'macos';
  }
  
  if (userAgent.includes('win')) {
    return 'windows';
  }
  
  return 'linux';
}

/**
 * Find best fallback fonts based on metrics and platform availability
 */
export function findBestFallbacks(
  primaryFont: FontConfig,
  maxFallbacks: number = 3
): FallbackMatchResult {
  const platform = detectPlatform();
  const primaryMetrics = primaryFont.metrics;
  
  if (!primaryMetrics) {
    // If no metrics available, use default system fonts
    // Ensure we always include sans-serif as the final fallback
    const fallbacks = SYSTEM_FONT_FALLBACKS.slice(0, maxFallbacks);
    if (!fallbacks.includes('sans-serif')) {
      fallbacks.push('sans-serif');
    }
    
    return {
      primary: primaryFont.family,
      fallbacks,
      matchScore: 0,
      systemFonts: SYSTEM_FONT_FALLBACKS
    };
  }

  // Score all available system fonts
  const scoredFonts = Object.values(SYSTEM_FONT_METRICS)
    .filter(systemFont => systemFont.availability[platform])
    .map(systemFont => ({
      family: systemFont.family,
      score: calculateMetricSimilarity(primaryMetrics, systemFont.metrics),
      metrics: systemFont.metrics
    }))
    .sort((a, b) => b.score - a.score);

  // Select top fallbacks
  const bestFallbacks = scoredFonts
    .slice(0, maxFallbacks)
    .map(font => font.family);

  // Add generic fallback
  if (!bestFallbacks.includes('sans-serif')) {
    bestFallbacks.push('sans-serif');
  }

  const averageScore = scoredFonts.length > 0 
    ? scoredFonts.slice(0, maxFallbacks).reduce((sum, font) => sum + font.score, 0) / Math.min(maxFallbacks, scoredFonts.length)
    : 0;

  return {
    primary: primaryFont.family,
    fallbacks: bestFallbacks,
    matchScore: averageScore,
    systemFonts: scoredFonts.map(font => font.family)
  };
}

/**
 * Generate CSS with optimized fallback chain
 */
export function generateFallbackCSS(
  primaryFont: FontConfig,
  fallbackResult?: FallbackMatchResult
): string {
  const result = fallbackResult || findBestFallbacks(primaryFont);
  const fontChain = [result.primary, ...result.fallbacks].join(', ');
  
  return `font-family: ${fontChain};`;
}

/**
 * Handle graceful degradation when font loading fails
 */
export function handleFontLoadingFailure(
  family: string,
  error: Error,
  fallbackConfig: FontConfig
): void {
  // Log the error for debugging
  console.warn(`Font loading failed for ${family}:`, error.message);
  
  // Update font loading state
  fontLoadingStateManager.markError(family, error);
  
  // Apply fallback styles immediately
  if (typeof document !== 'undefined') {
    // Sanitize family name for CSS class
    const sanitizedFamily = family
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Remove invalid CSS characters
      .replace(/\s+/g, '-')
      .replace(/^-+|-+$/g, ''); // Remove leading/trailing dashes
    
    // Only create CSS if we have a valid class name
    if (sanitizedFamily.length > 0) {
      const style = document.createElement('style');
      style.textContent = `
        .font-${sanitizedFamily} {
          ${generateFallbackCSS(fallbackConfig)}
        }
      `;
      document.head.appendChild(style);
    }
  }
}

/**
 * Monitor font loading with timeout and fallback
 */
export function monitorFontLoading(
  family: string,
  timeout: number = 3000
): Promise<FontLoadingState> {
  return new Promise((resolve) => {
    fontLoadingStateManager.startLoading(family);
    
    const timeoutId = setTimeout(() => {
      fontLoadingStateManager.markTimeout(family);
      const state = fontLoadingStateManager.getState(family);
      if (state) {
        resolve(state);
      }
    }, timeout);

    // Check if font is already loaded
    if (typeof document !== 'undefined' && document.fonts) {
      const checkFont = () => {
        if (document.fonts.check(`12px "${family}"`)) {
          clearTimeout(timeoutId);
          fontLoadingStateManager.markLoaded(family);
          const state = fontLoadingStateManager.getState(family);
          if (state) {
            resolve(state);
          }
        } else {
          // Check again in next frame
          requestAnimationFrame(checkFont);
        }
      };
      
      checkFont();
    } else {
      // Fallback for environments without Font Loading API
      clearTimeout(timeoutId);
      fontLoadingStateManager.markLoaded(family);
      const state = fontLoadingStateManager.getState(family);
      if (state) {
        resolve(state);
      }
    }
  });
}

/**
 * Get font loading performance metrics
 */
export function getFontLoadingMetrics(): {
  totalFonts: number;
  loadedFonts: number;
  failedFonts: number;
  averageLoadTime: number;
  slowestFont: FontLoadingState | null;
} {
  const states = fontLoadingStateManager.getAllStates();
  const loadedStates = states.filter(state => state.status === 'loaded' && state.endTime);
  const failedStates = states.filter(state => state.status === 'error' || state.status === 'timeout');
  
  const loadTimes = loadedStates.map(state => 
    state.endTime! - state.startTime
  );
  
  const averageLoadTime = loadTimes.length > 0 
    ? loadTimes.reduce((sum, time) => sum + time, 0) / loadTimes.length 
    : 0;
  
  const slowestFont = loadedStates.reduce((slowest, current) => {
    const currentTime = current.endTime! - current.startTime;
    const slowestTime = slowest ? slowest.endTime! - slowest.startTime : 0;
    return currentTime > slowestTime ? current : slowest;
  }, null as FontLoadingState | null);

  return {
    totalFonts: states.length,
    loadedFonts: loadedStates.length,
    failedFonts: failedStates.length,
    averageLoadTime,
    slowestFont
  };
}

/**
 * Check if system font is available
 */
export function isSystemFontAvailable(family: string): boolean {
  if (typeof document === 'undefined') {
    return false;
  }

  // Create a test element to check font availability
  const testElement = document.createElement('div');
  testElement.style.fontFamily = family;
  testElement.style.fontSize = '12px';
  testElement.style.position = 'absolute';
  testElement.style.visibility = 'hidden';
  testElement.textContent = 'Test';
  
  document.body.appendChild(testElement);
  
  // Get computed style to check if font was applied
  const computedStyle = window.getComputedStyle(testElement);
  const appliedFont = computedStyle.fontFamily;
  
  document.body.removeChild(testElement);
  
  // Check if the requested font is in the computed font family
  return appliedFont.toLowerCase().includes(family.toLowerCase());
}

/**
 * Preload critical fallback fonts
 */
export function preloadFallbackFonts(fallbacks: string[]): Promise<void[]> {
  const promises = fallbacks
    .filter(font => !font.includes('sans-serif') && !font.includes('serif'))
    .map(font => {
      return new Promise<void>((resolve) => {
        if (typeof document !== 'undefined' && document.fonts) {
          // Use Font Loading API if available
          const fontFace = new FontFace(font, 'local(' + font + ')');
          fontFace.load()
            .then(() => resolve())
            .catch(() => resolve()); // Don't fail if system font can't be loaded
        } else {
          resolve();
        }
      });
    });

  return Promise.all(promises);
}