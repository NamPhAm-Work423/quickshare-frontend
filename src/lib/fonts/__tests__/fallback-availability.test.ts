/**
 * Property-based test for fallback font availability
 * **Feature: font-optimization, Property 2: Fallback font availability**
 * **Validates: Requirements 1.2**
 */

import * as fc from 'fast-check';
import { 
  findBestFallbacks, 
  calculateMetricSimilarity,
  detectPlatform,
  isSystemFontAvailable,
  SYSTEM_FONT_METRICS,
  fontLoadingStateManager,
  handleFontLoadingFailure
} from '../fallbacks';
import { FontConfig, FontMetrics } from '../config';

describe('Fallback font availability property tests', () => {
  beforeEach(() => {
    // Clear font loading state before each test
    fontLoadingStateManager.clear();
  });

  test('Property 2: Fallback font availability - system provides immediate fallbacks when external sources unavailable', () => {
    fc.assert(
      fc.property(
        fc.record({
          family: fc.string({ minLength: 1, maxLength: 20 }).filter(s => /^[a-zA-Z][a-zA-Z0-9\s-]*$/.test(s.trim())),
          weights: fc.array(fc.integer({ min: 100, max: 900 }), { minLength: 1, maxLength: 4 }),
          styles: fc.array(fc.constantFrom('normal', 'italic'), { minLength: 1, maxLength: 2 }),
          metrics: fc.record({
            ascent: fc.integer({ min: 1000, max: 3000 }),
            descent: fc.integer({ min: -1000, max: -100 }),
            lineGap: fc.integer({ min: 0, max: 500 }),
            unitsPerEm: fc.constantFrom(1000, 2048, 2816),
            xHeight: fc.integer({ min: 800, max: 2000 }),
            capHeight: fc.integer({ min: 1200, max: 2500 })
          })
        }),
        (fontSpec) => {
          const config: FontConfig = {
            family: fontSpec.family,
            weights: fontSpec.weights,
            styles: fontSpec.styles as ('normal' | 'italic')[],
            display: 'swap',
            preload: true,
            fallbacks: [],
            subsets: ['latin'],
            metrics: fontSpec.metrics
          };

          const fallbackResult = findBestFallbacks(config, 3);
          
          // Property: Should always provide fallback fonts
          const hasFallbacks = fallbackResult.fallbacks.length > 0;
          
          // Property: Should include generic fallback (sans-serif)
          const hasGenericFallback = fallbackResult.fallbacks.includes('sans-serif');
          
          // Property: Should prioritize system fonts available on current platform
          const platform = detectPlatform();
          const systemFontsInFallbacks = fallbackResult.fallbacks.filter(font => 
            Object.values(SYSTEM_FONT_METRICS).some(systemFont => 
              systemFont.family === font && systemFont.availability[platform]
            )
          );
          const hasPlatformAppropriate = systemFontsInFallbacks.length > 0 || hasGenericFallback;
          
          // Property: Should not include the primary font in fallbacks
          const doesNotIncludePrimary = !fallbackResult.fallbacks.includes(fontSpec.family);
          
          // Property: Should have reasonable match score when metrics are provided
          const hasReasonableScore = fontSpec.metrics ? fallbackResult.matchScore >= 0 : true;

          return hasFallbacks && hasGenericFallback && hasPlatformAppropriate && 
                 doesNotIncludePrimary && hasReasonableScore;
        }
      ),
      { numRuns: 100 }
    );
  });

  test('Property 2: Fallback font availability - metric similarity calculation is symmetric and bounded', () => {
    fc.assert(
      fc.property(
        fc.record({
          ascent: fc.integer({ min: 1000, max: 3000 }),
          descent: fc.integer({ min: -1000, max: -100 }),
          lineGap: fc.integer({ min: 0, max: 500 }),
          unitsPerEm: fc.constantFrom(1000, 2048, 2816),
          xHeight: fc.integer({ min: 800, max: 2000 }),
          capHeight: fc.integer({ min: 1200, max: 2500 })
        }),
        fc.record({
          ascent: fc.integer({ min: 1000, max: 3000 }),
          descent: fc.integer({ min: -1000, max: -100 }),
          lineGap: fc.integer({ min: 0, max: 500 }),
          unitsPerEm: fc.constantFrom(1000, 2048, 2816),
          xHeight: fc.integer({ min: 800, max: 2000 }),
          capHeight: fc.integer({ min: 1200, max: 2500 })
        }),
        (metrics1, metrics2) => {
          const similarity1to2 = calculateMetricSimilarity(metrics1, metrics2);
          const similarity2to1 = calculateMetricSimilarity(metrics2, metrics1);
          
          // Property: Similarity calculation should be symmetric
          const isSymmetric = Math.abs(similarity1to2 - similarity2to1) < 0.001;
          
          // Property: Similarity should be bounded between 0 and 1
          const isBounded = similarity1to2 >= 0 && similarity1to2 <= 1 &&
                           similarity2to1 >= 0 && similarity2to1 <= 1;
          
          // Property: Identical metrics should have similarity of 1
          const identicalSimilarity = calculateMetricSimilarity(metrics1, metrics1);
          const identicalIsOne = Math.abs(identicalSimilarity - 1) < 0.001;

          return isSymmetric && isBounded && identicalIsOne;
        }
      ),
      { numRuns: 100 }
    );
  });

  test('Property 2: Fallback font availability - graceful degradation handles all error types', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 20 }).filter(s => /^[a-zA-Z][a-zA-Z0-9\s-]*$/.test(s.trim())),
        fc.constantFrom(
          new Error('Network error'),
          new Error('CORS policy violation'),
          new Error('Font file not found'),
          new Error('Invalid font format'),
          new Error('Timeout')
        ),
        (fontFamily, error) => {
          const fallbackConfig: FontConfig = {
            family: 'Arial',
            weights: [400],
            styles: ['normal'],
            display: 'swap',
            preload: false,
            fallbacks: ['sans-serif'],
            subsets: ['latin']
          };

          // Property: Should handle font loading failure without throwing
          let handledGracefully = true;
          try {
            handleFontLoadingFailure(fontFamily, error, fallbackConfig);
          } catch (e) {
            handledGracefully = false;
          }
          
          // Property: Should update font loading state to error
          const state = fontLoadingStateManager.getState(fontFamily);
          const stateUpdated = state?.status === 'error' && state?.error === error;
          
          return handledGracefully && stateUpdated;
        }
      ),
      { numRuns: 100 }
    );
  });

  test('Property 2: Fallback font availability - platform detection returns valid platform', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('test'),
        () => {
          const platform = detectPlatform();
          const validPlatforms = ['windows', 'macos', 'linux', 'android', 'ios'];
          
          // Property: Should return a valid platform identifier
          const isValidPlatform = validPlatforms.includes(platform);
          
          // Property: Should be consistent across calls
          const secondCall = detectPlatform();
          const isConsistent = platform === secondCall;
          
          return isValidPlatform && isConsistent;
        }
      ),
      { numRuns: 100 }
    );
  });

  test('Property 2: Fallback font availability - system font availability check is deterministic', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('Arial', 'Helvetica', 'Times', 'Courier', 'sans-serif', 'serif', 'monospace'),
        (fontFamily) => {
          // Skip actual DOM manipulation in test environment
          if (typeof document === 'undefined') {
            return true;
          }

          // Property: System font availability should be deterministic
          const firstCheck = isSystemFontAvailable(fontFamily);
          const secondCheck = isSystemFontAvailable(fontFamily);
          const isConsistent = firstCheck === secondCheck;
          
          // Property: Result should be boolean
          const isBoolean = typeof firstCheck === 'boolean';
          
          return isConsistent && isBoolean;
        }
      ),
      { numRuns: 100 }
    );
  });

  test('Property 2: Fallback font availability - fallback chain never empty for valid config', () => {
    fc.assert(
      fc.property(
        fc.record({
          family: fc.string({ minLength: 1, maxLength: 20 }).filter(s => /^[a-zA-Z][a-zA-Z0-9\s-]*$/.test(s.trim())),
          weights: fc.array(fc.integer({ min: 100, max: 900 }), { minLength: 1, maxLength: 4 }),
          styles: fc.array(fc.constantFrom('normal', 'italic'), { minLength: 1, maxLength: 2 }),
          hasMetrics: fc.boolean()
        }),
        (fontSpec) => {
          const config: FontConfig = {
            family: fontSpec.family,
            weights: fontSpec.weights,
            styles: fontSpec.styles as ('normal' | 'italic')[],
            display: 'swap',
            preload: true,
            fallbacks: [],
            subsets: ['latin'],
            metrics: fontSpec.hasMetrics ? {
              ascent: 2000,
              descent: -500,
              lineGap: 0,
              unitsPerEm: 2048,
              xHeight: 1400,
              capHeight: 1800
            } : undefined
          };

          const fallbackResult = findBestFallbacks(config);
          
          // Property: Should never return empty fallback array
          const hasNonEmptyFallbacks = fallbackResult.fallbacks.length > 0;
          
          // Property: Should always end with generic fallback
          const endsWithGeneric = fallbackResult.fallbacks[fallbackResult.fallbacks.length - 1] === 'sans-serif';
          
          // Property: Primary font should be preserved
          const primaryPreserved = fallbackResult.primary === config.family;
          
          return hasNonEmptyFallbacks && endsWithGeneric && primaryPreserved;
        }
      ),
      { numRuns: 100 }
    );
  });
});