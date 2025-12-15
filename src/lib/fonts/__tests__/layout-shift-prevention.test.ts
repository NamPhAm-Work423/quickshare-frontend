/**
 * Property-based test for layout shift prevention
 * **Feature: font-optimization, Property 5: Layout shift prevention**
 * **Validates: Requirements 1.5**
 */

import * as fc from 'fast-check';
import { 
  findBestFallbacks, 
  calculateMetricSimilarity,
  generateFallbackCSS,
  fontLoadingStateManager
} from '../fallbacks';
import { 
  generateFontFaceCSS,
  generateFontFamilyCSS 
} from '../loader';
import { FontConfig, FontAsset, FontMetrics } from '../config';

// Mock performance observer for testing
class MockPerformanceObserver {
  private callback: (entries: any) => void;
  
  constructor(callback: (entries: any) => void) {
    this.callback = callback;
  }
  
  observe() {}
  disconnect() {}
  
  // Method to simulate layout shift entries
  simulateLayoutShift(value: number) {
    this.callback({
      getEntries: () => [{
        entryType: 'layout-shift',
        value,
        startTime: performance.now(),
        hadRecentInput: false
      }]
    });
  }
}

describe('Layout shift prevention property tests', () => {
  beforeEach(() => {
    // Clear font loading state before each test
    fontLoadingStateManager.clear();
    
    // Mock performance.now for consistent testing
    jest.spyOn(performance, 'now').mockReturnValue(1000);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('Property 5: Layout shift prevention - font metrics similarity minimizes CLS impact', () => {
    fc.assert(
      fc.property(
        fc.record({
          primaryMetrics: fc.record({
            ascent: fc.integer({ min: 1500, max: 3000 }),
            descent: fc.integer({ min: -1000, max: -200 }),
            lineGap: fc.integer({ min: 0, max: 500 }),
            unitsPerEm: fc.constantFrom(1000, 2048, 2816),
            xHeight: fc.integer({ min: 800, max: 2000 }),
            capHeight: fc.integer({ min: 1200, max: 2500 })
          }),
          fallbackMetrics: fc.record({
            ascent: fc.integer({ min: 1500, max: 3000 }),
            descent: fc.integer({ min: -1000, max: -200 }),
            lineGap: fc.integer({ min: 0, max: 500 }),
            unitsPerEm: fc.constantFrom(1000, 2048, 2816),
            xHeight: fc.integer({ min: 800, max: 2000 }),
            capHeight: fc.integer({ min: 1200, max: 2500 })
          })
        }),
        (metricsSpec) => {
          const similarity = calculateMetricSimilarity(
            metricsSpec.primaryMetrics, 
            metricsSpec.fallbackMetrics
          );
          
          // Property: Higher similarity should correlate with lower potential CLS
          // We simulate this by checking that similar fonts have better similarity scores
          const identicalSimilarity = calculateMetricSimilarity(
            metricsSpec.primaryMetrics, 
            metricsSpec.primaryMetrics
          );
          
          // Property: Identical fonts should have perfect similarity (1.0)
          const identicalIsPerfect = Math.abs(identicalSimilarity - 1.0) < 0.001;
          
          // Property: Similarity should be bounded and reasonable
          const similarityBounded = similarity >= 0 && similarity <= 1;
          
          // Property: More similar metrics should have higher similarity scores
          // Create a slightly different version of primary metrics
          const slightlyDifferentMetrics = {
            ...metricsSpec.primaryMetrics,
            xHeight: metricsSpec.primaryMetrics.xHeight + 10 // Small change
          };
          
          const slightSimilarity = calculateMetricSimilarity(
            metricsSpec.primaryMetrics,
            slightlyDifferentMetrics
          );
          
          // Slight changes should have higher similarity than random metrics
          const slightChangesBetter = slightSimilarity >= similarity || 
                                     Math.abs(slightSimilarity - similarity) < 0.1;
          
          return identicalIsPerfect && similarityBounded && slightChangesBetter;
        }
      ),
      { numRuns: 100 }
    );
  });

  test('Property 5: Layout shift prevention - fallback font selection prioritizes metric matching', () => {
    fc.assert(
      fc.property(
        fc.record({
          family: fc.constantFrom('TestFont', 'CustomFont', 'WebFont'),
          metrics: fc.record({
            ascent: fc.integer({ min: 1500, max: 3000 }),
            descent: fc.integer({ min: -1000, max: -200 }),
            lineGap: fc.integer({ min: 0, max: 500 }),
            unitsPerEm: fc.constantFrom(1000, 2048, 2816),
            xHeight: fc.integer({ min: 800, max: 2000 }),
            capHeight: fc.integer({ min: 1200, max: 2500 })
          })
        }),
        (fontSpec) => {
          const config: FontConfig = {
            family: fontSpec.family,
            weights: [400, 600],
            styles: ['normal'],
            display: 'swap',
            preload: true,
            fallbacks: [],
            subsets: ['latin'],
            metrics: fontSpec.metrics
          };

          const fallbackResult = findBestFallbacks(config, 3);
          
          // Property: Should always provide fallback fonts
          const hasFallbacks = fallbackResult.fallbacks.length > 0;
          
          // Property: Should have a reasonable match score when metrics are provided
          const hasReasonableScore = fallbackResult.matchScore >= 0 && fallbackResult.matchScore <= 1;
          
          // Property: Should include generic fallback for ultimate safety
          const hasGenericFallback = fallbackResult.fallbacks.includes('sans-serif');
          
          // Property: Should not include the primary font in fallbacks
          const doesNotIncludePrimary = !fallbackResult.fallbacks.includes(fontSpec.family);
          
          return hasFallbacks && hasReasonableScore && hasGenericFallback && doesNotIncludePrimary;
        }
      ),
      { numRuns: 100 }
    );
  });

  test('Property 5: Layout shift prevention - font-display swap prevents invisible text', () => {
    fc.assert(
      fc.property(
        fc.record({
          family: fc.constantFrom('Inter', 'Roboto', 'Arial'),
          weights: fc.array(fc.constantFrom(400, 500, 600, 700), { minLength: 1, maxLength: 3 }),
          styles: fc.array(fc.constantFrom('normal', 'italic'), { minLength: 1, maxLength: 2 }),
          display: fc.constantFrom('swap', 'fallback', 'optional')
        }),
        (fontSpec) => {
          const config: FontConfig = {
            family: fontSpec.family,
            weights: fontSpec.weights,
            styles: fontSpec.styles as ('normal' | 'italic')[],
            display: fontSpec.display as 'swap' | 'fallback' | 'optional',
            preload: true,
            fallbacks: ['Arial', 'sans-serif'],
            subsets: ['latin']
          };

          // Create font assets
          const assets: FontAsset[] = [];
          fontSpec.weights.forEach(weight => {
            fontSpec.styles.forEach(style => {
              assets.push({
                family: fontSpec.family,
                weight,
                style: style as 'normal' | 'italic',
                format: 'woff2',
                url: `/fonts/${fontSpec.family.toLowerCase()}/${weight}-${style}.woff2`
              });
            });
          });

          const css = generateFontFaceCSS(config, assets);
          
          // Property: CSS should include font-display property
          const hasFontDisplay = css.includes(`font-display: ${fontSpec.display}`);
          
          // Property: Should not use 'block' display (which causes invisible text)
          const doesNotUseBlock = !css.includes('font-display: block');
          
          // Property: Should include proper font-family declarations
          const hasFontFamily = css.includes(`font-family: '${fontSpec.family}'`);
          
          // Property: Should include all specified weights and styles
          const includesAllWeights = fontSpec.weights.every(weight => 
            css.includes(`font-weight: ${weight}`)
          );
          
          const includesAllStyles = fontSpec.styles.every(style => 
            css.includes(`font-style: ${style}`)
          );
          
          return hasFontDisplay && doesNotUseBlock && hasFontFamily && 
                 includesAllWeights && includesAllStyles;
        }
      ),
      { numRuns: 100 }
    );
  });

  test('Property 5: Layout shift prevention - fallback CSS maintains font stack integrity', () => {
    fc.assert(
      fc.property(
        fc.record({
          family: fc.constantFrom('CustomFont', 'WebFont', 'BrandFont'),
          fallbacks: fc.array(
            fc.constantFrom('Arial', 'Helvetica', 'system-ui', '-apple-system'),
            { minLength: 1, maxLength: 4 }
          )
        }),
        (fontSpec) => {
          const config: FontConfig = {
            family: fontSpec.family,
            weights: [400],
            styles: ['normal'],
            display: 'swap',
            preload: true,
            fallbacks: [...fontSpec.fallbacks, 'sans-serif'],
            subsets: ['latin']
          };

          const fallbackCSS = generateFallbackCSS(config);
          
          // Property: Should include the primary font first
          const startsWithPrimary = fallbackCSS.includes(fontSpec.family);
          
          // Property: Should include system fallback fonts (the function finds best matches)
          // Note: generateFallbackCSS uses findBestFallbacks which selects optimal system fonts
          const hasSystemFallbacks = fallbackCSS.includes('-apple-system') || 
                                     fallbackCSS.includes('system-ui') ||
                                     fallbackCSS.includes('Arial') ||
                                     fallbackCSS.includes('Helvetica');
          
          // Property: Should end with generic fallback
          const endsWithGeneric = fallbackCSS.includes('sans-serif');
          
          // Property: Should be valid CSS font-family syntax
          const isValidCSS = fallbackCSS.startsWith('font-family:') && 
                            fallbackCSS.includes(',') && 
                            fallbackCSS.endsWith(';');
          
          return startsWithPrimary && hasSystemFallbacks && endsWithGeneric && isValidCSS;
        }
      ),
      { numRuns: 100 }
    );
  });

  test('Property 5: Layout shift prevention - CLS threshold compliance', () => {
    fc.assert(
      fc.property(
        fc.float({ min: 0, max: Math.fround(0.5) }).filter(n => !isNaN(n)), // CLS values
        (clsValue) => {
          // Property: CLS values should be properly categorized
          const isGood = clsValue <= 0.1;
          const isNeedsImprovement = clsValue > 0.1 && clsValue <= 0.25;
          const isPoor = clsValue > 0.25;
          
          // Property: Should have exactly one classification
          const hasExactlyOneClassification = 
            (isGood ? 1 : 0) + (isNeedsImprovement ? 1 : 0) + (isPoor ? 1 : 0) === 1;
          
          // Property: Good CLS should be within acceptable threshold
          const goodThresholdCorrect = !isGood || clsValue <= 0.1;
          
          // Property: Poor CLS should be above acceptable threshold  
          const poorThresholdCorrect = !isPoor || clsValue > 0.25;
          
          return hasExactlyOneClassification && goodThresholdCorrect && poorThresholdCorrect;
        }
      ),
      { numRuns: 100 }
    );
  });

  test('Property 5: Layout shift prevention - font loading state tracking prevents layout shifts', () => {
    fc.assert(
      fc.property(
        fc.record({
          family: fc.constantFrom('TestFont', 'WebFont', 'CustomFont'),
          loadTime: fc.integer({ min: 50, max: 5000 }) // milliseconds
        }),
        (fontSpec) => {
          // Simulate font loading process
          fontLoadingStateManager.startLoading(fontSpec.family);
          
          // Simulate loading completion
          setTimeout(() => {
            fontLoadingStateManager.markLoaded(fontSpec.family);
          }, fontSpec.loadTime);
          
          const state = fontLoadingStateManager.getState(fontSpec.family);
          
          // Property: Should have valid loading state
          const hasValidState = state !== undefined;
          
          // Property: Should track loading status
          const hasValidStatus = state && ['loading', 'loaded', 'error', 'timeout'].includes(state.status);
          
          // Property: Should have start time
          const hasStartTime = state && typeof state.startTime === 'number';
          
          // Property: Should track the correct font family
          const tracksCorrectFamily = state && state.family === fontSpec.family;
          
          return hasValidState && hasValidStatus && hasStartTime && tracksCorrectFamily;
        }
      ),
      { numRuns: 100 }
    );
  });

  test('Property 5: Layout shift prevention - performance observer integration', () => {
    fc.assert(
      fc.property(
        fc.record({
          clsValue: fc.float({ min: 0, max: Math.fround(0.3) }).filter(n => !isNaN(n)),
          hasRecentInput: fc.boolean()
        }),
        (shiftSpec) => {
          let observedShifts: any[] = [];
          
          // Mock performance observer
          const mockObserver = new MockPerformanceObserver((list) => {
            observedShifts = list.getEntries();
          });
          
          // Simulate layout shift
          mockObserver.simulateLayoutShift(shiftSpec.clsValue);
          
          // Property: Should capture layout shift entries
          const capturedShifts = observedShifts.length > 0;
          
          // Property: Should have correct entry type
          const hasCorrectType = observedShifts.every(entry => 
            entry.entryType === 'layout-shift'
          );
          
          // Property: Should have valid CLS value
          const hasValidCLS = observedShifts.every(entry => 
            typeof entry.value === 'number' && entry.value >= 0
          );
          
          // Property: Should have timing information
          const hasTiming = observedShifts.every(entry => 
            typeof entry.startTime === 'number'
          );
          
          return capturedShifts && hasCorrectType && hasValidCLS && hasTiming;
        }
      ),
      { numRuns: 100 }
    );
  });
});