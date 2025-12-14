/**
 * Property-Based Tests for SEO Metadata Consistency
 * Feature: seo-folder-restructure, Property 1: SEO metadata consistency
 * Validates: Requirements 2.4
 */

import * as fc from 'fast-check';
import { seoConfig, PageSEO } from '../metadata';
import { searchIntentMap } from '../search-intent';

describe('SEO Metadata Consistency', () => {
  /**
   * Property 1: SEO metadata consistency
   * For any page in the application, all pages should have consistent metadata structure 
   * with required fields (title, description) populated
   */
  test('all pages have consistent metadata structure with required fields', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...Object.keys(seoConfig.pages)),
        (pageKey) => {
          const pageMetadata = seoConfig.pages[pageKey];
          
          // Required fields must be present and non-empty
          expect(pageMetadata.title).toBeDefined();
          expect(pageMetadata.title).not.toBe('');
          expect(typeof pageMetadata.title).toBe('string');
          
          expect(pageMetadata.description).toBeDefined();
          expect(pageMetadata.description).not.toBe('');
          expect(typeof pageMetadata.description).toBe('string');
          
          expect(pageMetadata.primaryKeyword).toBeDefined();
          expect(pageMetadata.primaryKeyword).not.toBe('');
          expect(typeof pageMetadata.primaryKeyword).toBe('string');
          
          expect(pageMetadata.searchIntent).toBeDefined();
          expect(['informational', 'navigational', 'transactional', 'commercial'])
            .toContain(pageMetadata.searchIntent);
          
          // Secondary keywords should be an array if present
          if (pageMetadata.secondaryKeywords) {
            expect(Array.isArray(pageMetadata.secondaryKeywords)).toBe(true);
            pageMetadata.secondaryKeywords.forEach(keyword => {
              expect(typeof keyword).toBe('string');
              expect(keyword).not.toBe('');
            });
          }
          
          // Title should be SEO-optimized length (under 60 characters)
          expect(pageMetadata.title.length).toBeLessThanOrEqual(60);
          
          // Description should be SEO-optimized length (under 160 characters)
          expect(pageMetadata.description.length).toBeLessThanOrEqual(160);
          
          // Core Web Vitals config should have valid targets if present
          if (pageMetadata.coreWebVitals) {
            expect(pageMetadata.coreWebVitals.lcpTarget).toBeGreaterThan(0);
            expect(pageMetadata.coreWebVitals.clsTarget).toBeGreaterThanOrEqual(0);
            expect(pageMetadata.coreWebVitals.fidTarget).toBeGreaterThan(0);
          }
        }
      ),
      { numRuns: 100 } // Run 100 iterations as specified in design
    );
  });

  test('all pages have unique titles and descriptions', () => {
    const pages = Object.values(seoConfig.pages);
    const titles = pages.map(page => page.title);
    const descriptions = pages.map(page => page.description);
    
    // All titles should be unique
    const uniqueTitles = new Set(titles);
    expect(uniqueTitles.size).toBe(titles.length);
    
    // All descriptions should be unique
    const uniqueDescriptions = new Set(descriptions);
    expect(uniqueDescriptions.size).toBe(descriptions.length);
  });

  test('primary keywords are consistent with search intent mapping', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...Object.keys(seoConfig.pages)),
        (pageKey) => {
          const pageMetadata = seoConfig.pages[pageKey];
          const primaryKeyword = pageMetadata.primaryKeyword;
          
          // Check if primary keyword exists in search intent map
          const searchIntent = searchIntentMap[primaryKeyword];
          if (searchIntent) {
            // If it exists, the search intent should match
            expect(pageMetadata.searchIntent).toBe(searchIntent.intent);
          }
          
          // Primary keyword should be lowercase and contain relevant terms
          expect(primaryKeyword).toBe(primaryKeyword.toLowerCase());
          
          // Should contain file-sharing related terms
          const relevantTerms = ['file', 'share', 'transfer', 'p2p', 'send', 'secure'];
          const containsRelevantTerm = relevantTerms.some(term => 
            primaryKeyword.includes(term)
          );
          expect(containsRelevantTerm).toBe(true);
        }
      ),
      { numRuns: 100 }
    );
  });

  test('site configuration has all required fields', () => {
    expect(seoConfig.site.name).toBeDefined();
    expect(seoConfig.site.name).not.toBe('');
    expect(typeof seoConfig.site.name).toBe('string');
    
    expect(seoConfig.site.description).toBeDefined();
    expect(seoConfig.site.description).not.toBe('');
    expect(typeof seoConfig.site.description).toBe('string');
    
    expect(seoConfig.site.url).toBeDefined();
    expect(seoConfig.site.url).toMatch(/^https?:\/\/.+/);
    
    expect(seoConfig.site.logo).toBeDefined();
    expect(typeof seoConfig.site.logo).toBe('string');
  });

  test('default metadata has all required fields', () => {
    expect(seoConfig.defaults.title).toBeDefined();
    expect(seoConfig.defaults.title).not.toBe('');
    expect(typeof seoConfig.defaults.title).toBe('string');
    
    expect(seoConfig.defaults.description).toBeDefined();
    expect(seoConfig.defaults.description).not.toBe('');
    expect(typeof seoConfig.defaults.description).toBe('string');
    
    expect(seoConfig.defaults.ogImage).toBeDefined();
    expect(typeof seoConfig.defaults.ogImage).toBe('string');
  });

  test('programmatic SEO templates have valid structure', () => {
    const templates = seoConfig.programmatic.templates;
    
    Object.keys(templates).forEach(templateKey => {
      const template = templates[templateKey];
      
      expect(template.titleTemplate).toBeDefined();
      expect(template.titleTemplate).toMatch(/\{.+\}/); // Should contain variables
      
      expect(template.descriptionTemplate).toBeDefined();
      expect(template.descriptionTemplate).toMatch(/\{.+\}/); // Should contain variables
      
      expect(template.variables).toBeDefined();
      expect(typeof template.variables).toBe('object');
      
      // Each variable should be an array of strings
      Object.values(template.variables).forEach(variableArray => {
        expect(Array.isArray(variableArray)).toBe(true);
        variableArray.forEach(value => {
          expect(typeof value).toBe('string');
          expect(value).not.toBe('');
        });
      });
    });
  });
});