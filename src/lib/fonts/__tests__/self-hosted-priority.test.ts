/**
 * Property-based test for self-hosted font priority
 * **Feature: font-optimization, Property 3: Self-hosted font priority**
 * **Validates: Requirements 1.3**
 */

import * as fc from 'fast-check';
import { generateFontFaceRules, generateNextJSLocalFontConfig } from '../css-generator';
import { inter, getCriticalFontPreloads } from '../local-font';
import { FontAsset, FontConfig } from '../config';

describe('Self-hosted font priority property tests', () => {
  test('Property 3: Self-hosted font priority - local files should be primary source', () => {
    fc.assert(
      fc.property(
        fc.record({
          family: fc.constantFrom('Inter', 'Roboto', 'Open Sans'),
          weights: fc.array(fc.constantFrom(400, 500, 600, 700), { minLength: 1, maxLength: 4 }),
          styles: fc.array(fc.constantFrom('normal', 'italic'), { minLength: 1, maxLength: 2 }),
        }),
        (fontSpec) => {
          // Create font assets for the specification
          const assets: FontAsset[] = [];
          fontSpec.weights.forEach(weight => {
            fontSpec.styles.forEach(style => {
              assets.push({
                family: fontSpec.family,
                weight,
                style: style as 'normal' | 'italic',
                format: 'woff2',
                url: '', // Will be auto-generated as local path
              });
            });
          });

          const config: FontConfig = {
            family: fontSpec.family,
            weights: fontSpec.weights,
            styles: fontSpec.styles as ('normal' | 'italic')[],
            display: 'swap',
            preload: true,
            fallbacks: ['Arial', 'sans-serif'],
            subsets: ['latin'],
          };

          const css = generateFontFaceRules(config, assets, { baseUrl: '/fonts' });
          
          // Property: All font URLs should be self-hosted (start with /fonts)
          const urlMatches = css.match(/url\(['"]([^'"]+)['"]\)/g) || [];
          const allSelfHosted = urlMatches.every((match: string) => {
            const urlMatch = match.match(/url\(['"]([^'"]+)['"]\)/);
            const url = urlMatch?.[1];
            return url && url.startsWith('/fonts');
          });

          // Property: No external CDN references should exist
          const hasExternalCDN = css.includes('googleapis.com') || 
                                css.includes('gstatic.com') ||
                                css.includes('fonts.com') ||
                                css.includes('typekit.net');

          // Property: Font family should be served from local domain
          const nextJSConfig = generateNextJSLocalFontConfig(config, assets);
          const allPathsLocal = nextJSConfig.src.every(src => 
            src.path.startsWith('./') || src.path.startsWith('/') || !src.path.includes('://')
          );

          return allSelfHosted && !hasExternalCDN && allPathsLocal;
        }
      ),
      { numRuns: 100 }
    );
  });

  test('Property 3: Self-hosted font priority - preload links prioritize local fonts', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('critical', 'non-critical'),
        (fontType) => {
          const preloads = getCriticalFontPreloads();
          
          // Property: All preload links should point to self-hosted fonts
          const allPreloadsSelfHosted = preloads.every(preload => {
            const href = preload.href;
            // Should start with /fonts for self-hosted
            const isSelfHosted = href.startsWith('/fonts');
            // Should not be external CDN
            const isNotExternal = !href.includes('googleapis.com') && 
                                 !href.includes('gstatic.com') &&
                                 !href.includes('://');
            
            return isSelfHosted && isNotExternal;
          });

          // Property: Preloads should prioritize WOFF2 format (most efficient)
          const prioritizesWOFF2 = preloads.every(preload => 
            preload.type === 'font/woff2'
          );

          return allPreloadsSelfHosted && prioritizesWOFF2;
        }
      ),
      { numRuns: 100 }
    );
  });

  test('Property 3: Self-hosted font priority - Next.js font config uses local files', () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.record({
            weight: fc.constantFrom(400, 500, 600, 700),
            style: fc.constantFrom('normal', 'italic'),
            format: fc.constantFrom('woff2', 'woff', 'ttf'),
          }),
          { minLength: 1, maxLength: 8 }
        ),
        (fontVariants) => {
          const assets: FontAsset[] = fontVariants.map(variant => ({
            family: 'Inter',
            weight: variant.weight,
            style: variant.style as 'normal' | 'italic',
            format: variant.format as 'woff2' | 'woff' | 'ttf',
            url: '', // Auto-generated
          }));

          const config: FontConfig = {
            family: 'Inter',
            weights: [...new Set(fontVariants.map(v => v.weight))],
            styles: [...new Set(fontVariants.map(v => v.style))] as ('normal' | 'italic')[],
            display: 'swap',
            preload: true,
            fallbacks: ['Arial', 'sans-serif'],
            subsets: ['latin'],
          };

          const nextJSConfig = generateNextJSLocalFontConfig(config, assets);
          
          // Property: All src paths should be local (not external URLs)
          const allPathsLocal = nextJSConfig.src.every(src => {
            const path = src.path;
            // Should be relative path or absolute local path
            const isLocal = path.startsWith('./') || 
                           path.startsWith('../') || 
                           (path.startsWith('/') && !path.includes('://'));
            
            // Should not contain external domains
            const isNotExternal = !path.includes('googleapis.com') && 
                                 !path.includes('gstatic.com') &&
                                 !path.includes('://');
            
            return isLocal && isNotExternal;
          });

          // Property: Should have proper fallback chain
          const hasFallbacks = Array.isArray(nextJSConfig.fallback) && 
                              nextJSConfig.fallback.length > 0;

          // Property: Should use swap display strategy
          const usesSwapDisplay = nextJSConfig.display === 'swap';

          return allPathsLocal && hasFallbacks && usesSwapDisplay;
        }
      ),
      { numRuns: 100 }
    );
  });

  test('Property 3: Self-hosted font priority - Inter font configuration is self-hosted', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('production', 'development'),
        (environment) => {
          // Property: Inter font should be configured to use local files
          const fontClassName = inter.className;
          
          // The font should have a class name (indicating it's properly configured)
          const hasClassName = typeof fontClassName === 'string' && fontClassName.length > 0;
          
          // Property: Font style should not reference external URLs
          const fontStyle = inter.style;
          const fontFamily = fontStyle.fontFamily;
          
          // Should not contain external CDN references in font-family
          const isNotExternalCDN = !fontFamily.includes('googleapis.com') && 
                                  !fontFamily.includes('gstatic.com');
          
          // Property: Should have CSS variable defined (in test env, it's mocked)
          const hasVariable = typeof inter.variable === 'string';

          return hasClassName && isNotExternalCDN && hasVariable;
        }
      ),
      { numRuns: 100 }
    );
  });
});