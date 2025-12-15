/**
 * Property-based test for CORS-free font serving
 * **Feature: font-optimization, Property 1: CORS-free font serving**
 * **Validates: Requirements 1.1**
 */

import * as fc from 'fast-check';
import { getCriticalFontPreloads } from '../local-font';
import { generateFontFaceRules } from '../css-generator';
import { FontAsset, FontConfig } from '../config';

describe('CORS-free font serving property tests', () => {
  test('Property 1: CORS-free font serving - all font requests should originate from same domain', () => {
    fc.assert(
      fc.property(
        fc.record({
          family: fc.constantFrom('Inter', 'Roboto', 'Open Sans'),
          weight: fc.integer({ min: 100, max: 900 }),
          style: fc.constantFrom('normal', 'italic'),
          format: fc.constantFrom('woff2', 'woff', 'ttf'),
        }),
        (fontRequest) => {
          // Generate font asset from request
          const asset: FontAsset = {
            family: fontRequest.family,
            weight: fontRequest.weight,
            style: fontRequest.style as 'normal' | 'italic',
            format: fontRequest.format as 'woff2' | 'woff' | 'ttf',
            url: '', // Will be generated
          };

          const config: FontConfig = {
            family: fontRequest.family,
            weights: [fontRequest.weight],
            styles: [fontRequest.style as 'normal' | 'italic'],
            display: 'swap',
            preload: true,
            fallbacks: ['Arial', 'sans-serif'],
            subsets: ['latin'],
          };

          // Generate CSS for the font
          const css = generateFontFaceRules(config, [asset], { baseUrl: '/fonts' });
          
          // Property: All font URLs should be relative paths (same domain)
          // No external domains like fonts.googleapis.com or fonts.gstatic.com
          const hasExternalDomain = css.includes('googleapis.com') || 
                                   css.includes('gstatic.com') ||
                                   css.includes('http://') ||
                                   css.includes('https://');
          
          // Property: All URLs should start with /fonts (self-hosted)
          const urlMatches = css.match(/url\(['"]([^'"]+)['"]\)/g);
          const allUrlsSelfHosted = urlMatches ? urlMatches.every(match => {
            const url = match.match(/url\(['"]([^'"]+)['"]\)/)?.[1];
            return url && url.startsWith('/fonts');
          }) : true;

          return !hasExternalDomain && allUrlsSelfHosted;
        }
      ),
      { numRuns: 100 }
    );
  });

  test('Property 1: CORS-free font serving - preload links should use same domain', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('same-origin', 'cross-origin'),
        (scenario) => {
          const preloads = getCriticalFontPreloads();
          
          // Property: All preload hrefs should be relative paths (same domain)
          const allPreloadsSameDomain = preloads.every(preload => {
            const href = preload.href;
            // Should not contain external domains
            const isExternal = href.includes('googleapis.com') || 
                              href.includes('gstatic.com') ||
                              href.startsWith('http://') ||
                              href.startsWith('https://');
            
            // Should start with /fonts for self-hosted
            const isSelfHosted = href.startsWith('/fonts');
            
            return !isExternal && isSelfHosted;
          });

          // Property: crossOrigin should be 'anonymous' for font files (standard practice)
          const correctCrossOrigin = preloads.every(preload => 
            preload.crossOrigin === 'anonymous'
          );

          return allPreloadsSameDomain && correctCrossOrigin;
        }
      ),
      { numRuns: 100 }
    );
  });

  test('Property 1: CORS-free font serving - font URLs should not trigger CORS', () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.record({
            family: fc.constantFrom('Inter'),
            weight: fc.constantFrom(400, 500, 600, 700),
            style: fc.constantFrom('normal', 'italic'),
            format: fc.constantFrom('woff2', 'woff', 'ttf'),
          }),
          { minLength: 1, maxLength: 8 }
        ),
        (fontAssets) => {
          const assets: FontAsset[] = fontAssets.map(asset => ({
            family: asset.family,
            weight: asset.weight,
            style: asset.style as 'normal' | 'italic',
            format: asset.format as 'woff2' | 'woff' | 'ttf',
            url: '', // Will be auto-generated
          }));

          const config: FontConfig = {
            family: 'Inter',
            weights: [...new Set(fontAssets.map(a => a.weight))],
            styles: [...new Set(fontAssets.map(a => a.style))] as ('normal' | 'italic')[],
            display: 'swap',
            preload: true,
            fallbacks: ['Arial', 'sans-serif'],
            subsets: ['latin'],
          };

          const css = generateFontFaceRules(config, assets);
          
          // Property: Generated CSS should not reference external domains
          const corsProblematicPatterns = [
            /https?:\/\/fonts\.googleapis\.com/,
            /https?:\/\/fonts\.gstatic\.com/,
            /https?:\/\/[^/]+\//  // Any absolute URL with domain
          ];

          const hasCORSIssues = corsProblematicPatterns.some(pattern => 
            pattern.test(css)
          );

          // Property: All font URLs should be relative to current domain
          const urlMatches = css.match(/url\(['"]([^'"]+)['"]\)/g) || [];
          const allRelativeUrls = urlMatches.every(match => {
            const url = match.match(/url\(['"]([^'"]+)['"]\)/)?.[1];
            return url && (url.startsWith('/') || url.startsWith('./') || !url.includes('://'));
          });

          return !hasCORSIssues && allRelativeUrls;
        }
      ),
      { numRuns: 100 }
    );
  });
});