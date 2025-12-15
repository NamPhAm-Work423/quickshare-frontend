import * as fc from 'fast-check';
import fs from 'fs';
import path from 'path';
import { validateFontFile, generateFontChecksum, FontFile } from '../validation';

// **Feature: font-optimization, Property 12: Font file validation**
// **Validates: Requirements 3.3**

describe('Font File Validation Property Tests', () => {
  const testFontDir = path.join(process.cwd(), 'public', 'fonts', 'inter');
  
  // Property 12: Font file validation
  // For any font file added to the system, validation should verify file integrity and generate appropriate CSS declarations
  test('Property 12: Font file validation - valid font files should pass validation', () => {
    fc.assert(
      fc.property(
        // Generate valid font configurations based on our actual font files
        fc.constantFrom(
          { weight: 400, style: 'normal' as const, format: 'woff2' as const },
          { weight: 400, style: 'italic' as const, format: 'woff2' as const },
          { weight: 500, style: 'normal' as const, format: 'woff2' as const },
          { weight: 500, style: 'italic' as const, format: 'woff2' as const },
          { weight: 600, style: 'normal' as const, format: 'woff2' as const },
          { weight: 600, style: 'italic' as const, format: 'woff2' as const },
          { weight: 700, style: 'normal' as const, format: 'woff2' as const },
          { weight: 700, style: 'italic' as const, format: 'woff2' as const },
          { weight: 400, style: 'normal' as const, format: 'ttf' as const },
          { weight: 400, style: 'italic' as const, format: 'ttf' as const },
          { weight: 500, style: 'normal' as const, format: 'ttf' as const },
          { weight: 500, style: 'italic' as const, format: 'ttf' as const },
          { weight: 600, style: 'normal' as const, format: 'ttf' as const },
          { weight: 600, style: 'italic' as const, format: 'ttf' as const },
          { weight: 700, style: 'normal' as const, format: 'ttf' as const },
          { weight: 700, style: 'italic' as const, format: 'ttf' as const }
        ),
        fc.string({ minLength: 1, maxLength: 50 }).filter(s => s.trim().length > 0),
        (fontConfig, family) => {
          // Construct the expected file path based on our naming convention
          const fileName = `Inter-${fontConfig.weight}-${fontConfig.style}.${fontConfig.format}`;
          const filePath = path.join(testFontDir, fontConfig.format, fileName);
          
          // Skip if the file doesn't exist (test environment might not have all files)
          if (!fs.existsSync(filePath)) {
            return true; // Skip this test case
          }
          
          const fontFile: FontFile = {
            family: family.trim(),
            weight: fontConfig.weight,
            style: fontConfig.style,
            format: fontConfig.format,
            path: filePath
          };
          
          const result = validateFontFile(fontFile);
          
          // For existing, properly formatted font files, validation should pass
          // (assuming the file exists and has correct extension)
          if (fs.existsSync(filePath)) {
            const fileExtension = path.extname(filePath).toLowerCase().slice(1);
            if (fileExtension === fontConfig.format) {
              expect(result.isValid).toBe(true);
              expect(result.errors).toHaveLength(0);
            }
          }
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  test('Property 12: Font file validation - invalid font configurations should fail validation', () => {
    fc.assert(
      fc.property(
        // Generate invalid font configurations
        fc.record({
          family: fc.oneof(
            fc.constant(''), // Empty family name
            fc.constant('   '), // Whitespace only
            fc.string({ minLength: 1, maxLength: 50 })
          ),
          weight: fc.oneof(
            fc.integer({ min: -100, max: 99 }), // Invalid low weight
            fc.integer({ min: 901, max: 2000 }), // Invalid high weight
            fc.integer({ min: 100, max: 900 }) // Valid weight
          ),
          style: fc.oneof(
            fc.constantFrom('normal', 'italic'), // Valid styles
            fc.constantFrom('oblique', 'bold', 'invalid') // Invalid styles
          ),
          format: fc.oneof(
            fc.constantFrom('woff2', 'woff', 'ttf'), // Valid formats
            fc.constantFrom('otf', 'eot', 'svg', 'invalid') // Invalid formats
          ),
          path: fc.oneof(
            fc.constant('/nonexistent/path/font.woff2'), // Non-existent path
            fc.string({ minLength: 1, maxLength: 100 })
          )
        }),
        (fontConfig) => {
          const fontFile: FontFile = {
            family: fontConfig.family,
            weight: fontConfig.weight,
            style: fontConfig.style as 'normal' | 'italic',
            format: fontConfig.format as 'woff2' | 'woff' | 'ttf',
            path: fontConfig.path
          };
          
          const result = validateFontFile(fontFile);
          
          // Check that invalid configurations produce appropriate errors
          const hasInvalidFamily = !fontConfig.family || fontConfig.family.trim().length === 0;
          const hasInvalidWeight = !Number.isInteger(fontConfig.weight) || fontConfig.weight < 100 || fontConfig.weight > 900;
          const hasInvalidStyle = !['normal', 'italic'].includes(fontConfig.style);
          const hasInvalidFormat = !['woff2', 'woff', 'ttf'].includes(fontConfig.format);
          const hasInvalidPath = !fs.existsSync(fontConfig.path);
          
          const shouldBeInvalid = hasInvalidFamily || hasInvalidWeight || hasInvalidStyle || hasInvalidFormat || hasInvalidPath;
          
          if (shouldBeInvalid) {
            expect(result.isValid).toBe(false);
            expect(result.errors.length).toBeGreaterThan(0);
          }
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  test('Property 12: Font file validation - checksum validation should detect file corruption', () => {
    fc.assert(
      fc.property(
        fc.array(fc.integer({ min: 0, max: 15 }), { minLength: 64, maxLength: 64 }).map(arr => 
          arr.map(n => n.toString(16)).join('').toUpperCase()
        ), // Generate random SHA256 checksums
        (randomChecksum) => {
          // Use an existing font file for this test
          const testFontPath = path.join(testFontDir, 'woff2', 'Inter-400-normal.woff2');
          
          // Skip if test font doesn't exist
          if (!fs.existsSync(testFontPath)) {
            return true;
          }
          
          const fontFile: FontFile = {
            family: 'Inter',
            weight: 400,
            style: 'normal',
            format: 'woff2',
            path: testFontPath,
            checksum: randomChecksum
          };
          
          const result = validateFontFile(fontFile);
          const actualChecksum = generateFontChecksum(testFontPath);
          
          // If the random checksum doesn't match the actual checksum, validation should fail
          if (randomChecksum.toUpperCase() !== actualChecksum.toUpperCase()) {
            expect(result.isValid).toBe(false);
            expect(result.errors.some(error => error.includes('Checksum mismatch'))).toBe(true);
          } else {
            // If by chance the random checksum matches, validation should pass
            expect(result.isValid).toBe(true);
          }
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  test('Property 12: Font file validation - correct checksums should validate successfully', () => {
    // Test with actual font files and their correct checksums
    const testCases = [
      { path: 'woff2/Inter-400-normal.woff2', weight: 400, style: 'normal' as const },
      { path: 'woff2/Inter-500-normal.woff2', weight: 500, style: 'normal' as const },
      { path: 'ttf/Inter-400-normal.ttf', weight: 400, style: 'normal' as const },
    ];
    
    testCases.forEach(testCase => {
      const fullPath = path.join(testFontDir, testCase.path);
      
      // Skip if file doesn't exist
      if (!fs.existsSync(fullPath)) {
        return;
      }
      
      const actualChecksum = generateFontChecksum(fullPath);
      const format = path.extname(fullPath).slice(1) as 'woff2' | 'woff' | 'ttf';
      
      const fontFile: FontFile = {
        family: 'Inter',
        weight: testCase.weight,
        style: testCase.style,
        format: format,
        path: fullPath,
        checksum: actualChecksum
      };
      
      const result = validateFontFile(fontFile);
      
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });
});