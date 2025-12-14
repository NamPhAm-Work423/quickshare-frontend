/**
 * Property-Based Tests for Structured Data Validity
 * Feature: seo-folder-restructure, Property 3: Structured data validity
 * Validates: Requirements 3.2
 */

import * as fc from 'fast-check';
import { render } from '@testing-library/react';
import SendFileFromIPhoneToPCGuide from '../send-file-from-iphone-to-pc/page';
import SendFileFromMacToWindowsGuide from '../send-file-from-mac-to-windows/page';
import SendFileOverWiFiWithoutInternetGuide from '../send-file-over-wifi-without-internet/page';

// Mock Next.js metadata exports to avoid issues in tests
jest.mock('../send-file-from-iphone-to-pc/metadata', () => ({
  metadata: { title: 'Test', description: 'Test' }
}));
jest.mock('../send-file-from-mac-to-windows/metadata', () => ({
  metadata: { title: 'Test', description: 'Test' }
}));
jest.mock('../send-file-over-wifi-without-internet/metadata', () => ({
  metadata: { title: 'Test', description: 'Test' }
}));

describe('Structured Data Validity', () => {
  const blogComponents = [
    { name: 'SendFileFromIPhoneToPCGuide', component: SendFileFromIPhoneToPCGuide },
    { name: 'SendFileFromMacToWindowsGuide', component: SendFileFromMacToWindowsGuide },
    { name: 'SendFileOverWiFiWithoutInternetGuide', component: SendFileOverWiFiWithoutInternetGuide }
  ];

  /**
   * Property 3: Structured data validity
   * For any page that includes structured data, the JSON-LD markup should be valid 
   * according to schema.org specifications and properly formatted
   */
  test('all blog pages have valid JSON-LD structured data', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...blogComponents),
        (blogComponent) => {
          const { container } = render(<blogComponent.component />);
          
          // Find all JSON-LD script tags
          const jsonLdScripts = container.querySelectorAll('script[type="application/ld+json"]');
          
          // Should have at least one structured data script
          expect(jsonLdScripts.length).toBeGreaterThan(0);
          
          jsonLdScripts.forEach(script => {
            const jsonContent = script.textContent;
            expect(jsonContent).toBeTruthy();
            
            // Should be valid JSON
            let structuredData;
            expect(() => {
              structuredData = JSON.parse(jsonContent!);
            }).not.toThrow();
            
            // Should have required schema.org properties
            expect(structuredData).toHaveProperty('@context');
            expect(structuredData).toHaveProperty('@type');
            
            // @context should be schema.org
            expect(structuredData['@context']).toBe('https://schema.org');
            
            // @type should be a valid schema.org type for how-to content
            const validTypes = ['HowTo', 'Article', 'WebPage', 'BlogPosting'];
            expect(validTypes).toContain(structuredData['@type']);
            
            // For HowTo type, should have required properties
            if (structuredData['@type'] === 'HowTo') {
              expect(structuredData).toHaveProperty('name');
              expect(structuredData).toHaveProperty('description');
              expect(structuredData).toHaveProperty('step');
              
              // Name and description should be non-empty strings
              expect(typeof structuredData.name).toBe('string');
              expect(structuredData.name.trim()).not.toBe('');
              expect(typeof structuredData.description).toBe('string');
              expect(structuredData.description.trim()).not.toBe('');
              
              // Steps should be an array with at least one step
              expect(Array.isArray(structuredData.step)).toBe(true);
              expect(structuredData.step.length).toBeGreaterThan(0);
              
              // Each step should have required properties
              structuredData.step.forEach((step: any, index: number) => {
                expect(step).toHaveProperty('@type');
                expect(step['@type']).toBe('HowToStep');
                expect(step).toHaveProperty('name');
                expect(step).toHaveProperty('text');
                
                // Step name and text should be non-empty strings
                expect(typeof step.name).toBe('string');
                expect(step.name.trim()).not.toBe('');
                expect(typeof step.text).toBe('string');
                expect(step.text.trim()).not.toBe('');
              });
              
              // Should have totalTime if present
              if (structuredData.totalTime) {
                expect(typeof structuredData.totalTime).toBe('string');
                // Should follow ISO 8601 duration format (PT...)
                expect(structuredData.totalTime).toMatch(/^PT\d+[HMS]?$/);
              }
              
              // Should have estimatedCost if present
              if (structuredData.estimatedCost) {
                expect(structuredData.estimatedCost).toHaveProperty('@type');
                expect(structuredData.estimatedCost['@type']).toBe('MonetaryAmount');
                expect(structuredData.estimatedCost).toHaveProperty('currency');
                expect(structuredData.estimatedCost).toHaveProperty('value');
              }
              
              // Should have supply array if present
              if (structuredData.supply) {
                expect(Array.isArray(structuredData.supply)).toBe(true);
                structuredData.supply.forEach((supply: any) => {
                  expect(supply).toHaveProperty('@type');
                  expect(supply['@type']).toBe('HowToSupply');
                  expect(supply).toHaveProperty('name');
                  expect(typeof supply.name).toBe('string');
                  expect(supply.name.trim()).not.toBe('');
                });
              }
              
              // Should have tool array if present
              if (structuredData.tool) {
                expect(Array.isArray(structuredData.tool)).toBe(true);
                structuredData.tool.forEach((tool: any) => {
                  expect(tool).toHaveProperty('@type');
                  expect(tool['@type']).toBe('HowToTool');
                  expect(tool).toHaveProperty('name');
                  expect(typeof tool.name).toBe('string');
                  expect(tool.name.trim()).not.toBe('');
                });
              }
            }
            
            // For Article type, should have required properties
            if (structuredData['@type'] === 'Article' || structuredData['@type'] === 'BlogPosting') {
              expect(structuredData).toHaveProperty('headline');
              expect(structuredData).toHaveProperty('description');
              
              expect(typeof structuredData.headline).toBe('string');
              expect(structuredData.headline.trim()).not.toBe('');
              expect(typeof structuredData.description).toBe('string');
              expect(structuredData.description.trim()).not.toBe('');
            }
            
            // Should not have any undefined or null required values
            const checkForUndefinedValues = (obj: any, path = '') => {
              Object.keys(obj).forEach(key => {
                const value = obj[key];
                const currentPath = path ? `${path}.${key}` : key;
                
                if (value === undefined || value === null) {
                  throw new Error(`Undefined or null value found at ${currentPath}`);
                }
                
                if (typeof value === 'object' && !Array.isArray(value)) {
                  checkForUndefinedValues(value, currentPath);
                } else if (Array.isArray(value)) {
                  value.forEach((item, index) => {
                    if (typeof item === 'object') {
                      checkForUndefinedValues(item, `${currentPath}[${index}]`);
                    }
                  });
                }
              });
            };
            
            expect(() => checkForUndefinedValues(structuredData)).not.toThrow();
          });
        }
      ),
      { numRuns: 100 } // Run 100 iterations as specified in design
    );
  });

  test('structured data contains valid URLs and references', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...blogComponents),
        (blogComponent) => {
          const { container } = render(<blogComponent.component />);
          
          const jsonLdScripts = container.querySelectorAll('script[type="application/ld+json"]');
          
          jsonLdScripts.forEach(script => {
            const structuredData = JSON.parse(script.textContent!);
            
            // Check for URL fields and validate they are properly formatted
            const checkUrls = (obj: any) => {
              Object.keys(obj).forEach(key => {
                const value = obj[key];
                
                // Check if this looks like a URL field
                if (key === 'url' || key === 'image' || key.endsWith('Url')) {
                  if (typeof value === 'string' && value.trim() !== '') {
                    // Should be a valid URL format
                    expect(value).toMatch(/^https?:\/\/.+/);
                  }
                }
                
                // Recursively check nested objects
                if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
                  checkUrls(value);
                } else if (Array.isArray(value)) {
                  value.forEach(item => {
                    if (typeof item === 'object' && item !== null) {
                      checkUrls(item);
                    }
                  });
                }
              });
            };
            
            checkUrls(structuredData);
          });
        }
      ),
      { numRuns: 100 }
    );
  });

  test('structured data follows schema.org HowTo specification', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...blogComponents),
        (blogComponent) => {
          const { container } = render(<blogComponent.component />);
          
          const jsonLdScripts = container.querySelectorAll('script[type="application/ld+json"]');
          
          jsonLdScripts.forEach(script => {
            const structuredData = JSON.parse(script.textContent!);
            
            if (structuredData['@type'] === 'HowTo') {
              // Validate step structure follows schema.org specification
              expect(structuredData.step).toBeDefined();
              expect(Array.isArray(structuredData.step)).toBe(true);
              
              // Should have at least 3 steps for a meaningful how-to guide
              expect(structuredData.step.length).toBeGreaterThanOrEqual(3);
              
              // Each step should follow proper schema
              structuredData.step.forEach((step: any, index: number) => {
                // Required properties for HowToStep
                expect(step['@type']).toBe('HowToStep');
                expect(step.name).toBeDefined();
                expect(step.text).toBeDefined();
                
                // Name should be descriptive (not just "Step 1")
                expect(step.name.length).toBeGreaterThan(5);
                
                // Text should be substantial (at least 20 characters)
                expect(step.text.length).toBeGreaterThan(20);
                
                // If image is provided, should be a valid URL
                if (step.image) {
                  expect(step.image).toMatch(/^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i);
                }
              });
              
              // Should have meaningful name and description
              expect(structuredData.name.length).toBeGreaterThan(10);
              expect(structuredData.description.length).toBeGreaterThan(30);
              
              // If totalTime is specified, should be reasonable (not too short or too long)
              if (structuredData.totalTime) {
                const timeMatch = structuredData.totalTime.match(/^PT(\d+)([HMS])$/);
                if (timeMatch) {
                  const value = parseInt(timeMatch[1]);
                  const unit = timeMatch[2];
                  
                  // Reasonable time bounds for how-to guides
                  if (unit === 'M') { // Minutes
                    expect(value).toBeGreaterThanOrEqual(1);
                    expect(value).toBeLessThanOrEqual(120); // Max 2 hours
                  } else if (unit === 'H') { // Hours
                    expect(value).toBeGreaterThanOrEqual(1);
                    expect(value).toBeLessThanOrEqual(8); // Max 8 hours
                  } else if (unit === 'S') { // Seconds
                    expect(value).toBeGreaterThanOrEqual(30);
                    expect(value).toBeLessThanOrEqual(7200); // Max 2 hours in seconds
                  }
                }
              }
            }
          });
        }
      ),
      { numRuns: 100 }
    );
  });

  test('structured data is properly escaped and formatted', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...blogComponents),
        (blogComponent) => {
          const { container } = render(<blogComponent.component />);
          
          const jsonLdScripts = container.querySelectorAll('script[type="application/ld+json"]');
          
          jsonLdScripts.forEach(script => {
            const jsonContent = script.textContent!;
            
            // Should not contain unescaped HTML entities
            expect(jsonContent).not.toMatch(/&lt;|&gt;|&amp;(?!quot;|#39;|#x27;)/);
            
            // Should not contain script tags or other dangerous content
            expect(jsonContent.toLowerCase()).not.toContain('<script');
            expect(jsonContent.toLowerCase()).not.toContain('javascript:');
            expect(jsonContent.toLowerCase()).not.toContain('onclick');
            
            // Should be properly formatted JSON (no trailing commas, etc.)
            const structuredData = JSON.parse(jsonContent);
            
            // Re-stringify and compare to ensure it's properly formatted
            const reStringified = JSON.stringify(structuredData);
            expect(() => JSON.parse(reStringified)).not.toThrow();
            
            // Should not have empty string values for required fields
            const checkForEmptyStrings = (obj: any, path = '') => {
              Object.keys(obj).forEach(key => {
                const value = obj[key];
                const currentPath = path ? `${path}.${key}` : key;
                
                if (typeof value === 'string' && value.trim() === '') {
                  // Allow empty strings for optional fields, but not for required ones
                  const requiredFields = ['@context', '@type', 'name', 'description', 'text'];
                  if (requiredFields.includes(key)) {
                    throw new Error(`Empty string found in required field: ${currentPath}`);
                  }
                }
                
                if (typeof value === 'object' && !Array.isArray(value) && value !== null) {
                  checkForEmptyStrings(value, currentPath);
                } else if (Array.isArray(value)) {
                  value.forEach((item, index) => {
                    if (typeof item === 'object' && item !== null) {
                      checkForEmptyStrings(item, `${currentPath}[${index}]`);
                    }
                  });
                }
              });
            };
            
            expect(() => checkForEmptyStrings(structuredData)).not.toThrow();
          });
        }
      ),
      { numRuns: 100 }
    );
  });

  test('structured data contains consistent information with page content', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...blogComponents),
        (blogComponent) => {
          const { container } = render(<blogComponent.component />);
          
          const jsonLdScripts = container.querySelectorAll('script[type="application/ld+json"]');
          const h1Element = container.querySelector('h1');
          
          jsonLdScripts.forEach(script => {
            const structuredData = JSON.parse(script.textContent!);
            
            if (h1Element && structuredData.name) {
              // The structured data name should be related to the page title
              const pageTitle = h1Element.textContent?.trim() || '';
              const structuredName = structuredData.name.trim();
              
              // Should have some common words (basic consistency check)
              const pageTitleWords = pageTitle.toLowerCase().split(/\s+/).filter(word => word.length > 3);
              const structuredNameWords = structuredName.toLowerCase().split(/\s+/).filter(word => word.length > 3);
              
              // Should have at least one word in common
              const commonWords = pageTitleWords.filter(word => 
                structuredNameWords.some(structuredWord => 
                  structuredWord.includes(word) || word.includes(structuredWord)
                )
              );
              
              expect(commonWords.length).toBeGreaterThan(0);
            }
            
            // If it's a HowTo, the steps should be reasonable in number and content
            if (structuredData['@type'] === 'HowTo' && structuredData.step) {
              // Should have a reasonable number of steps (not too few, not too many)
              expect(structuredData.step.length).toBeGreaterThanOrEqual(3);
              expect(structuredData.step.length).toBeLessThanOrEqual(20);
              
              // Steps should have progressive content (each step should be different)
              const stepTexts = structuredData.step.map((step: any) => step.text.toLowerCase());
              const uniqueStepTexts = new Set(stepTexts);
              expect(uniqueStepTexts.size).toBe(stepTexts.length); // All steps should be unique
            }
          });
        }
      ),
      { numRuns: 100 }
    );
  });
});