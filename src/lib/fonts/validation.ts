import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

export interface FontFile {
  family: string;
  weight: number;
  style: 'normal' | 'italic';
  format: 'woff2' | 'woff' | 'ttf';
  path: string;
  checksum?: string;
}

export interface FontValidationResult {
  isValid: boolean;
  errors: string[];
  file: FontFile;
}

/**
 * Validates a font file by checking its existence, format, and integrity
 */
export function validateFontFile(fontFile: FontFile): FontValidationResult {
  const errors: string[] = [];
  
  // Check if file exists
  if (!fs.existsSync(fontFile.path)) {
    errors.push(`Font file does not exist: ${fontFile.path}`);
    return { isValid: false, errors, file: fontFile };
  }
  
  // Check file extension matches format
  const fileExtension = path.extname(fontFile.path).toLowerCase().slice(1);
  if (fileExtension !== fontFile.format) {
    errors.push(`File extension '${fileExtension}' does not match declared format '${fontFile.format}'`);
  }
  
  // Validate font family name
  if (!fontFile.family || fontFile.family.trim().length === 0) {
    errors.push('Font family name cannot be empty');
  }
  
  // Validate font weight
  if (!Number.isInteger(fontFile.weight) || fontFile.weight < 100 || fontFile.weight > 900) {
    errors.push(`Invalid font weight: ${fontFile.weight}. Must be an integer between 100 and 900`);
  }
  
  // Validate font style
  if (!['normal', 'italic'].includes(fontFile.style)) {
    errors.push(`Invalid font style: ${fontFile.style}. Must be 'normal' or 'italic'`);
  }
  
  // Validate font format
  if (!['woff2', 'woff', 'ttf'].includes(fontFile.format)) {
    errors.push(`Invalid font format: ${fontFile.format}. Must be 'woff2', 'woff', or 'ttf'`);
  }
  
  // Check file size (fonts should not be empty)
  try {
    const stats = fs.statSync(fontFile.path);
    if (stats.size === 0) {
      errors.push('Font file is empty');
    }
  } catch (error) {
    errors.push(`Cannot read font file stats: ${error}`);
  }
  
  // Validate checksum if provided
  if (fontFile.checksum) {
    try {
      const fileBuffer = fs.readFileSync(fontFile.path);
      const calculatedChecksum = crypto.createHash('sha256').update(fileBuffer).digest('hex').toUpperCase();
      if (calculatedChecksum !== fontFile.checksum.toUpperCase()) {
        errors.push(`Checksum mismatch. Expected: ${fontFile.checksum}, Calculated: ${calculatedChecksum}`);
      }
    } catch (error) {
      errors.push(`Cannot calculate checksum: ${error}`);
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    file: fontFile
  };
}

/**
 * Generates a checksum for a font file
 */
export function generateFontChecksum(filePath: string): string {
  const fileBuffer = fs.readFileSync(filePath);
  return crypto.createHash('sha256').update(fileBuffer).digest('hex').toUpperCase();
}

/**
 * Validates multiple font files
 */
export function validateFontFiles(fontFiles: FontFile[]): FontValidationResult[] {
  return fontFiles.map(validateFontFile);
}