/**
 * Font CSS generation system
 * Generates @font-face rules, CSS with proper font-display and unicode-range
 * Implements font format detection and cache headers configuration
 */

import { FontConfig, FontAsset, FontMetrics } from './config';

export interface CSSGenerationOptions {
  baseUrl?: string;
  includeUnicodeRange?: boolean;
  includeFallbacks?: boolean;
  minifyCSS?: boolean;
}

export interface CacheHeaderConfig {
  maxAge: number;
  immutable: boolean;
  staleWhileRevalidate?: number;
}

export interface FontFormatInfo {
  format: 'woff2' | 'woff' | 'ttf';
  mimeType: string;
  extension: string;
  priority: number;
  browserSupport: string[];
}

// Font format information with browser support and priority
export const FONT_FORMATS: Record<string, FontFormatInfo> = {
  woff2: {
    format: 'woff2',
    mimeType: 'font/woff2',
    extension: 'woff2',
    priority: 3,
    browserSupport: ['Chrome 36+', 'Firefox 39+', 'Safari 12+', 'Edge 14+']
  },
  woff: {
    format: 'woff',
    mimeType: 'font/woff',
    extension: 'woff',
    priority: 2,
    browserSupport: ['Chrome 6+', 'Firefox 3.6+', 'Safari 5.1+', 'IE 9+']
  },
  ttf: {
    format: 'ttf',
    mimeType: 'font/ttf',
    extension: 'ttf',
    priority: 1,
    browserSupport: ['All browsers (fallback)']
  }
};

// Unicode ranges for different character sets
export const UNICODE_RANGES: Record<string, string> = {
  'latin': 'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD',
  'latin-ext': 'U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF',
  'cyrillic': 'U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116',
  'cyrillic-ext': 'U+0460-052F, U+1C80-1C88, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F',
  'greek': 'U+0370-03FF',
  'greek-ext': 'U+1F00-1FFF',
  'vietnamese': 'U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+1EA0-1EF9, U+20AB'
};

/**
 * Generate @font-face CSS rules for a font configuration
 */
export function generateFontFaceRules(
  config: FontConfig,
  assets: FontAsset[],
  options: CSSGenerationOptions = {}
): string {
  const {
    baseUrl = '/fonts',
    includeUnicodeRange = true,
    minifyCSS = false
  } = options;

  const rules: string[] = [];
  
  // Group assets by weight and style
  const assetGroups = groupAssetsByVariant(assets);
  
  // Generate @font-face rule for each weight/style combination
  assetGroups.forEach((groupAssets, variant) => {
    const [weight, style] = variant.split('-');
    
    // Sort assets by format priority (woff2 > woff > ttf)
    const sortedAssets = sortAssetsByFormatPriority(groupAssets);
    
    // Build src declaration with proper format hints
    const srcDeclarations = sortedAssets.map(asset => {
      const url = buildAssetUrl(asset, baseUrl);
      return `url('${url}') format('${asset.format}')`;
    });
    
    // Build unicode range if requested and subsets are defined
    const unicodeRange = includeUnicodeRange && config.subsets.length > 0
      ? buildUnicodeRange(config.subsets)
      : null;
    
    const rule = buildFontFaceRule({
      fontFamily: config.family,
      src: srcDeclarations,
      fontWeight: weight,
      fontStyle: style,
      fontDisplay: config.display,
      unicodeRange,
      minify: minifyCSS
    });
    
    rules.push(rule);
  });
  
  return rules.join(minifyCSS ? '' : '\n\n');
}

/**
 * Generate CSS utility classes for font families
 */
export function generateFontUtilityClasses(
  configs: FontConfig[],
  options: CSSGenerationOptions = {}
): string {
  const { includeFallbacks = true, minifyCSS = false } = options;
  const classes: string[] = [];
  
  configs.forEach(config => {
    const className = `.font-${config.family.toLowerCase().replace(/\s+/g, '-')}`;
    const fontFamily = includeFallbacks 
      ? [config.family, ...config.fallbacks].join(', ')
      : config.family;
    
    const rule = minifyCSS
      ? `${className}{font-family:${fontFamily};}`
      : `${className} {\n  font-family: ${fontFamily};\n}`;
    
    classes.push(rule);
  });
  
  return classes.join(minifyCSS ? '' : '\n\n');
}

/**
 * Generate complete CSS bundle for font system
 */
export function generateCompleteFontCSS(
  configs: FontConfig[],
  allAssets: FontAsset[],
  options: CSSGenerationOptions = {}
): string {
  const sections: string[] = [];
  
  // Add font-face rules for each configuration
  configs.forEach(config => {
    const configAssets = allAssets.filter(asset => asset.family === config.family);
    if (configAssets.length > 0) {
      const fontFaceCSS = generateFontFaceRules(config, configAssets, options);
      sections.push(fontFaceCSS);
    }
  });
  
  // Add utility classes
  const utilityCSS = generateFontUtilityClasses(configs, options);
  sections.push(utilityCSS);
  
  return sections.join(options.minifyCSS ? '' : '\n\n');
}

/**
 * Detect optimal font format for user agent
 */
export function detectOptimalFontFormat(userAgent?: string): 'woff2' | 'woff' | 'ttf' {
  if (typeof window === 'undefined' && !userAgent) {
    return 'woff2'; // Default to best format for SSR
  }
  
  const ua = userAgent || (typeof navigator !== 'undefined' ? navigator.userAgent : '');
  
  // Check for WOFF2 support (modern browsers)
  if (supportsWOFF2(ua)) {
    return 'woff2';
  }
  
  // Check for WOFF support (older browsers)
  if (supportsWOFF(ua)) {
    return 'woff';
  }
  
  // Fallback to TTF for very old browsers
  return 'ttf';
}

/**
 * Generate cache headers configuration for font files
 */
export function generateCacheHeaders(format: 'woff2' | 'woff' | 'ttf'): CacheHeaderConfig {
  // Font files are immutable once deployed, so we can cache aggressively
  const baseConfig: CacheHeaderConfig = {
    maxAge: 31536000, // 1 year
    immutable: true
  };
  
  // WOFF2 files are smaller and more efficient, cache longer
  if (format === 'woff2') {
    return {
      ...baseConfig,
      maxAge: 31536000 * 2, // 2 years
      staleWhileRevalidate: 86400 // 1 day
    };
  }
  
  return baseConfig;
}

/**
 * Generate Next.js font configuration for local fonts
 */
export function generateNextJSLocalFontConfig(
  config: FontConfig,
  assets: FontAsset[]
): {
  src: Array<{ path: string; weight: string; style: string }>;
  display: string;
  preload: boolean;
  fallback: string[];
  variable?: string;
} {
  const src = assets.map(asset => ({
    path: buildAssetUrl(asset, './public/fonts'),
    weight: asset.weight.toString(),
    style: asset.style
  }));
  
  return {
    src,
    display: config.display,
    preload: config.preload,
    fallback: config.fallbacks,
    variable: `--font-${config.family.toLowerCase().replace(/\s+/g, '-')}`
  };
}

// Helper functions

function groupAssetsByVariant(assets: FontAsset[]): Map<string, FontAsset[]> {
  const groups = new Map<string, FontAsset[]>();
  
  assets.forEach(asset => {
    const variant = `${asset.weight}-${asset.style}`;
    if (!groups.has(variant)) {
      groups.set(variant, []);
    }
    groups.get(variant)!.push(asset);
  });
  
  return groups;
}

function sortAssetsByFormatPriority(assets: FontAsset[]): FontAsset[] {
  return [...assets].sort((a, b) => {
    const aPriority = FONT_FORMATS[a.format]?.priority || 0;
    const bPriority = FONT_FORMATS[b.format]?.priority || 0;
    return bPriority - aPriority;
  });
}

function buildAssetUrl(asset: FontAsset, baseUrl: string): string {
  if (asset.url) {
    return asset.url;
  }
  
  const familyPath = asset.family.toLowerCase().replace(/\s+/g, '-');
  return `${baseUrl}/${familyPath}/${asset.format}/${asset.family}-${asset.weight}-${asset.style}.${asset.format}`;
}

function buildUnicodeRange(subsets: string[]): string {
  return subsets
    .map(subset => UNICODE_RANGES[subset])
    .filter(Boolean)
    .join(', ');
}

function buildFontFaceRule(params: {
  fontFamily: string;
  src: string[];
  fontWeight: string;
  fontStyle: string;
  fontDisplay: string;
  unicodeRange: string | null;
  minify: boolean;
}): string {
  const { fontFamily, src, fontWeight, fontStyle, fontDisplay, unicodeRange, minify } = params;
  
  if (minify) {
    const unicodePart = unicodeRange ? `unicode-range:${unicodeRange};` : '';
    return `@font-face{font-family:'${fontFamily}';src:${src.join(',')};font-weight:${fontWeight};font-style:${fontStyle};font-display:${fontDisplay};${unicodePart}}`;
  }
  
  const unicodePart = unicodeRange ? `\n  unicode-range: ${unicodeRange};` : '';
  return `@font-face {
  font-family: '${fontFamily}';
  src: ${src.join(',\n       ')};
  font-weight: ${fontWeight};
  font-style: ${fontStyle};
  font-display: ${fontDisplay};${unicodePart}
}`;
}

function supportsWOFF2(userAgent: string): boolean {
  // WOFF2 support detection
  return /Chrome\/([3-9]\d|[1-9]\d{2,})/.test(userAgent) ||
         /Firefox\/([3-9]\d|[1-9]\d{2,})/.test(userAgent) ||
         /Safari\/([6-9]\d{2,}|[1-9]\d{3,})/.test(userAgent) ||
         /Edge\/([1-9]\d|[1-9]\d{2,})/.test(userAgent);
}

function supportsWOFF(userAgent: string): boolean {
  // WOFF support detection (broader support)
  return !/MSIE [1-8]\./.test(userAgent) && 
         !/Android [1-3]\./.test(userAgent);
}

/**
 * Generate preload link tags for critical fonts
 */
export function generatePreloadLinks(
  assets: FontAsset[],
  criticalWeights: number[] = [400, 600],
  baseUrl: string = '/fonts'
): string[] {
  return assets
    .filter(asset => 
      criticalWeights.includes(asset.weight) && 
      asset.style === 'normal' &&
      asset.format === 'woff2' // Prefer WOFF2 for preloading
    )
    .map(asset => {
      const href = buildAssetUrl(asset, baseUrl);
      return `<link rel="preload" as="font" type="font/woff2" href="${href}" crossorigin="anonymous">`;
    });
}

/**
 * Validate font assets for completeness
 */
export function validateFontAssets(
  config: FontConfig,
  assets: FontAsset[]
): { isValid: boolean; errors: string[]; warnings: string[] } {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Check if all required weight/style combinations have assets
  config.weights.forEach(weight => {
    config.styles.forEach(style => {
      const hasAsset = assets.some(asset => 
        asset.family === config.family &&
        asset.weight === weight &&
        asset.style === style
      );
      
      if (!hasAsset) {
        errors.push(`Missing font asset for ${config.family} ${weight} ${style}`);
      }
    });
  });
  
  // Check for WOFF2 format availability
  const hasWOFF2 = assets.some(asset => asset.format === 'woff2');
  if (!hasWOFF2) {
    warnings.push('No WOFF2 format available - consider adding for better performance');
  }
  
  // Check for proper fallback formats
  const formats = new Set(assets.map(asset => asset.format));
  if (!formats.has('woff') && !formats.has('ttf')) {
    warnings.push('No fallback format (WOFF or TTF) available for older browsers');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}