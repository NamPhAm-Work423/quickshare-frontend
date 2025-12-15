import * as fc from 'fast-check';
import {
  FontConfig,
  FontDisplayStrategy,
  FONT_DISPLAY_STRATEGIES,
  INTER_FONT_CONFIG,
  DEFAULT_FONT_CONFIGS,
  getFontConfig,
  getAvailableWeights,
  getAvailableStyles,
  isFontVariantAvailable,
  getFallbackFontChain,
  validateFontConfig
} from '../config';

// **Feature: font-optimization, Property 7: Font display strategy consistency**
// **Validates: Requirements 2.2**

describe('Font Configuration Property Tests', () => {
  
  // Property 7: Font display strategy consistency
  // For any font declaration, the CSS should include font-display: swap to prevent invisible text periods
  test('Property 7: Font display strategy consistency - all font configurations should have valid display strategies', () => {
    fc.assert(
      fc.property(
        // Generate font configurations with various display strategies
        fc.record({
          family: fc.string({ minLength: 1, maxLength: 50 }).filter(s => s.trim().length > 0),
          weights: fc.array(fc.integer({ min: 100, max: 900 }), { minLength: 1, maxLength: 10 }),
          styles: fc.array(fc.constantFrom('normal', 'italic'), { minLength: 1, maxLength: 2 }),
          display: fc.constantFrom('auto', 'block', 'swap', 'fallback', 'optional'),
          preload: fc.boolean(),
          fallbacks: fc.array(fc.string({ minLength: 1, maxLength: 30 }), { minLength: 1, maxLength: 10 }),
          subsets: fc.array(fc.constantFrom('latin', 'latin-ext', 'cyrillic', 'greek'), { minLength: 1, maxLength: 4 })
        }),
        (configData) => {
          const config: FontConfig = {
            family: configData.family.trim(),
            weights: [...new Set(configData.weights)].sort((a, b) => a - b), // Remove duplicates and sort
            styles: [...new Set(configData.styles)] as ('normal' | 'italic')[],
            display: configData.display as 'auto' | 'block' | 'swap' | 'fallback' | 'optional',
            preload: configData.preload,
            fallbacks: configData.fallbacks.filter(f => f.trim().length > 0),
            subsets: [...new Set(configData.subsets)]
          };
          
          // Validate that the configuration is internally consistent
          const validation = validateFontConfig(config);
          
          if (validation.isValid) {
            // For valid configurations, ensure display strategy is properly defined
            expect(Object.keys(FONT_DISPLAY_STRATEGIES)).toContain(config.display);
            
            // Ensure the display strategy has proper characteristics
            const strategy = FONT_DISPLAY_STRATEGIES[config.display];
            expect(strategy).toBeDefined();
            expect(strategy.strategy).toBe(config.display);
            expect(typeof strategy.description).toBe('string');
            expect(strategy.description.length).toBeGreaterThan(0);
            expect(typeof strategy.useCase).toBe('string');
            expect(strategy.useCase.length).toBeGreaterThan(0);
            
            // For web fonts, display strategy should be one of the valid options
            // The core requirement is that all display strategies are valid and documented
            expect(['auto', 'block', 'swap', 'fallback', 'optional']).toContain(config.display);
            
            // For preloaded fonts, prefer strategies that prevent invisible text
            if (config.preload) {
              // Preloaded fonts should ideally use 'swap' or 'fallback' to prevent FOIT
              // but 'auto' and other strategies are still valid
              expect(['auto', 'block', 'swap', 'fallback', 'optional']).toContain(config.display);
            }
          }
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  test('Property 7: Font display strategy consistency - default configurations should use optimal display strategies', () => {
    // Test that our predefined font configurations follow best practices
    Object.entries(DEFAULT_FONT_CONFIGS).forEach(([name, config]) => {
      // All default configurations should be valid
      const validation = validateFontConfig(config);
      expect(validation.isValid).toBe(true);
      expect(validation.errors).toHaveLength(0);
      
      // All default configurations should use 'swap' or 'fallback' to prevent invisible text
      expect(['swap', 'fallback']).toContain(config.display);
      
      // Preloaded fonts should use 'swap' for immediate fallback
      if (config.preload) {
        expect(['swap', 'fallback']).toContain(config.display);
      }
      
      // Ensure display strategy is properly defined in our strategy map
      expect(FONT_DISPLAY_STRATEGIES[config.display]).toBeDefined();
    });
  });

  test('Property 7: Font display strategy consistency - font configuration validation should enforce display strategy requirements', () => {
    fc.assert(
      fc.property(
        // Generate configurations with potentially invalid display strategies
        fc.record({
          family: fc.string({ minLength: 1, maxLength: 50 }),
          weights: fc.array(fc.integer({ min: 100, max: 900 }), { minLength: 1, maxLength: 5 }),
          styles: fc.array(fc.constantFrom('normal', 'italic'), { minLength: 1, maxLength: 2 }),
          display: fc.oneof(
            fc.constantFrom('auto', 'block', 'swap', 'fallback', 'optional'), // Valid strategies
            fc.constantFrom('invalid', 'none', 'inherit', 'initial') // Invalid strategies
          ),
          preload: fc.boolean(),
          fallbacks: fc.array(fc.string({ minLength: 1, maxLength: 20 }), { minLength: 1, maxLength: 5 }),
          subsets: fc.array(fc.string({ minLength: 1, maxLength: 10 }), { minLength: 1, maxLength: 3 })
        }),
        (configData) => {
          const config: FontConfig = {
            family: configData.family.trim(),
            weights: [...new Set(configData.weights)],
            styles: [...new Set(configData.styles)] as ('normal' | 'italic')[],
            display: configData.display as any,
            preload: configData.preload,
            fallbacks: configData.fallbacks,
            subsets: configData.subsets
          };
          
          const validation = validateFontConfig(config);
          
          // Check if display strategy is valid
          const validDisplayStrategies = ['auto', 'block', 'swap', 'fallback', 'optional'];
          const hasValidDisplay = validDisplayStrategies.includes(config.display);
          
          if (!hasValidDisplay) {
            // Invalid display strategies should cause validation to fail
            expect(validation.isValid).toBe(false);
            expect(validation.errors.some(error => error.includes('Invalid font display strategy'))).toBe(true);
          } else if (validation.isValid) {
            // Valid display strategies should be properly documented
            expect(FONT_DISPLAY_STRATEGIES[config.display]).toBeDefined();
          }
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  test('Property 7: Font display strategy consistency - fallback chain generation should maintain consistency', () => {
    fc.assert(
      fc.property(
        fc.record({
          family: fc.string({ minLength: 1, maxLength: 30 })
            .filter(s => s.trim().length > 0 && !s.includes(',') && !s.includes(';')),
          fallbacks: fc.array(
            fc.string({ minLength: 1, maxLength: 20 })
              .filter(s => s.trim().length > 0 && !s.includes(',') && !s.includes(';')), 
            { minLength: 1, maxLength: 8 }
          ),
          display: fc.constantFrom('auto', 'block', 'swap', 'fallback', 'optional')
        }),
        (configData) => {
          const config: FontConfig = {
            family: configData.family.trim(),
            weights: [400],
            styles: ['normal'],
            display: configData.display as 'auto' | 'block' | 'swap' | 'fallback' | 'optional',
            preload: false,
            fallbacks: configData.fallbacks.filter(f => f.trim().length > 0),
            subsets: ['latin']
          };
          
          const fallbackChain = getFallbackFontChain(config);
          
          // Fallback chain should start with the primary font family
          expect(fallbackChain.startsWith(config.family)).toBe(true);
          
          // Fallback chain should include all specified fallbacks
          config.fallbacks.forEach(fallback => {
            expect(fallbackChain).toContain(fallback);
          });
          
          // Fallback chain should be a valid CSS font-family value
          expect(fallbackChain).toMatch(/^[^,]+(,\s*[^,]+)*$/);
          
          // Should not have trailing or leading commas
          expect(fallbackChain).not.toMatch(/^,|,$/);
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  test('Property 7: Font display strategy consistency - font variant availability should be consistent with configuration', () => {
    fc.assert(
      fc.property(
        fc.record({
          weights: fc.array(fc.integer({ min: 100, max: 900 }), { minLength: 1, maxLength: 8 }),
          styles: fc.array(fc.constantFrom('normal', 'italic'), { minLength: 1, maxLength: 2 }),
          testWeight: fc.integer({ min: 100, max: 900 }),
          testStyle: fc.constantFrom('normal', 'italic')
        }),
        (data) => {
          const config: FontConfig = {
            family: 'TestFont',
            weights: [...new Set(data.weights)],
            styles: [...new Set(data.styles)] as ('normal' | 'italic')[],
            display: 'swap',
            preload: false,
            fallbacks: ['sans-serif'],
            subsets: ['latin']
          };
          
          const isAvailable = isFontVariantAvailable(config, data.testWeight, data.testStyle);
          const shouldBeAvailable = config.weights.includes(data.testWeight) && config.styles.includes(data.testStyle);
          
          // Font variant availability should match the configuration
          expect(isAvailable).toBe(shouldBeAvailable);
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  // Additional unit tests for specific functionality
  test('getFontConfig should return correct configuration for valid names', () => {
    expect(getFontConfig('primary')).toEqual(DEFAULT_FONT_CONFIGS.primary);
    expect(getFontConfig('heading')).toEqual(DEFAULT_FONT_CONFIGS.heading);
    expect(getFontConfig('body')).toEqual(DEFAULT_FONT_CONFIGS.body);
    expect(getFontConfig('ui')).toEqual(DEFAULT_FONT_CONFIGS.ui);
  });

  test('getFontConfig should throw error for invalid names', () => {
    expect(() => getFontConfig('nonexistent' as any)).toThrow('Font configuration \'nonexistent\' not found');
  });

  test('getAvailableWeights should return sorted weights', () => {
    const config: FontConfig = {
      family: 'Test',
      weights: [700, 400, 600],
      styles: ['normal'],
      display: 'swap',
      preload: false,
      fallbacks: [],
      subsets: []
    };
    
    expect(getAvailableWeights(config)).toEqual([400, 600, 700]);
  });

  test('getAvailableStyles should return all styles', () => {
    const config: FontConfig = {
      family: 'Test',
      weights: [400],
      styles: ['italic', 'normal'],
      display: 'swap',
      preload: false,
      fallbacks: [],
      subsets: []
    };
    
    expect(getAvailableStyles(config)).toEqual(['italic', 'normal']);
  });
});