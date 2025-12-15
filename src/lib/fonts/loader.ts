/**
 * Font loading utilities
 * Provides functions for font preloading, CSS generation, and fallback management
 */

import { FontConfig, FontAsset, PreloadRule, getFallbackFontChain } from './config';

export interface PreloadLinkAttributes {
  rel: 'preload';
  as: 'font';
  type: string;
  href: string;
  crossOrigin?: 'anonymous';
}

export interface FontFaceRule {
  fontFamily: string;
  src: string;
  fontWeight: number;
  fontStyle: string;
  fontDisplay: string;
  unicodeRange?: string;
}

export interface FontLoadingOptions {
  baseUrl?: string;
  crossOrigin?: boolean;
  timeout?: number;
}

/**
 * Generate preload link attributes for critical fonts
 */
export function generatePreloadLinks(
  preloadRules: PreloadRule[],
  options: FontLoadingOptions = {}
): PreloadLinkAttributes[] {
  const { baseUrl = '/fonts', crossOrigin = false } = options;

  return preloadRules.map(rule => {
    const formatMimeTypes = {
      woff2: 'font/woff2',
      woff: 'font/woff',
      ttf: 'font/ttf'
    };

    const href = `${baseUrl}/${rule.family.toLowerCase()}/${rule.format}/${rule.family}-${rule.weight}-${rule.style}.${rule.format}`;

    const attributes: PreloadLinkAttributes = {
      rel: 'preload',
      as: 'font',
      type: formatMimeTypes[rule.format],
      href
    };

    if (crossOrigin) {
      attributes.crossOrigin = 'anonymous';
    }

    return attributes;
  });
}

/**
 * Generate @font-face CSS rules for a font configuration
 */
export function generateFontFaceCSS(
  config: FontConfig,
  assets: FontAsset[],
  options: FontLoadingOptions = {}
): string {
  const { baseUrl = '/fonts' } = options;
  const rules: string[] = [];

  // Group assets by weight and style
  const assetGroups = new Map<string, FontAsset[]>();
  
  assets.forEach(asset => {
    const key = `${asset.weight}-${asset.style}`;
    if (!assetGroups.has(key)) {
      assetGroups.set(key, []);
    }
    assetGroups.get(key)!.push(asset);
  });

  // Generate @font-face rule for each weight/style combination
  assetGroups.forEach((groupAssets, key) => {
    const [weight, style] = key.split('-');
    
    // Sort formats by preference (woff2 > woff > ttf)
    const sortedAssets = groupAssets.sort((a, b) => {
      const formatPriority = { woff2: 3, woff: 2, ttf: 1 };
      return formatPriority[b.format] - formatPriority[a.format];
    });

    // Build src declaration with format hints
    const srcDeclarations = sortedAssets.map(asset => {
      const url = asset.url || `${baseUrl}/${asset.family.toLowerCase()}/${asset.format}/${asset.family}-${asset.weight}-${asset.style}.${asset.format}`;
      return `url('${url}') format('${asset.format}')`;
    });

    const rule = `@font-face {
  font-family: '${config.family}';
  src: ${srcDeclarations.join(',\n       ')};
  font-weight: ${weight};
  font-style: ${style};
  font-display: ${config.display};${config.subsets.length > 0 ? `\n  unicode-range: ${getUnicodeRange(config.subsets)};` : ''}
}`;

    rules.push(rule);
  });

  return rules.join('\n\n');
}

/**
 * Generate CSS font-family declaration with fallbacks
 */
export function generateFontFamilyCSS(config: FontConfig): string {
  return `font-family: ${getFallbackFontChain(config)};`;
}

/**
 * Generate complete CSS for a font configuration
 */
export function generateCompleteCSS(
  config: FontConfig,
  assets: FontAsset[],
  options: FontLoadingOptions = {}
): string {
  const fontFaceCSS = generateFontFaceCSS(config, assets, options);
  const fontFamilyCSS = generateFontFamilyCSS(config);
  
  return `${fontFaceCSS}

/* Font family utility class */
.font-${config.family.toLowerCase()} {
  ${fontFamilyCSS}
}`;
}

/**
 * Build fallback font chain with metric matching
 */
export function buildFallbackChain(
  primaryFont: string,
  fallbacks: string[],
  metrics?: { ascent: number; descent: number; lineGap: number }
): string[] {
  const chain = [primaryFont];
  
  // Add system fonts that closely match the primary font metrics
  if (metrics) {
    // For Inter-like fonts, prioritize system fonts with similar characteristics
    const matchedFallbacks = fallbacks.filter(font => {
      // System fonts that work well with Inter metrics
      const interCompatible = [
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial'
      ];
      return interCompatible.includes(font);
    });
    
    chain.push(...matchedFallbacks);
  } else {
    chain.push(...fallbacks);
  }
  
  // Always end with generic fallback
  if (!chain.includes('sans-serif') && !chain.includes('serif') && !chain.includes('monospace')) {
    chain.push('sans-serif');
  }
  
  return chain;
}

/**
 * Create font assets from manifest data
 */
export function createFontAssetsFromManifest(
  manifestData: any,
  baseUrl: string = '/fonts'
): FontAsset[] {
  const assets: FontAsset[] = [];
  
  if (!manifestData.fonts || !Array.isArray(manifestData.fonts)) {
    throw new Error('Invalid manifest format: missing fonts array');
  }
  
  manifestData.fonts.forEach((font: any) => {
    if (!font.files || typeof font.files !== 'object') {
      return;
    }
    
    Object.entries(font.files).forEach(([format, filePath]) => {
      if (typeof filePath === 'string') {
        assets.push({
          family: manifestData.family,
          weight: font.weight,
          style: font.style,
          format: format as 'woff2' | 'woff' | 'ttf',
          url: `${baseUrl}/${manifestData.family.toLowerCase()}/${filePath}`
        });
      }
    });
  });
  
  return assets;
}

/**
 * Get unicode range for font subsets
 */
function getUnicodeRange(subsets: string[]): string {
  const unicodeRanges: Record<string, string> = {
    'latin': 'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD',
    'latin-ext': 'U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF',
    'cyrillic': 'U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116',
    'cyrillic-ext': 'U+0460-052F, U+1C80-1C88, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F',
    'greek': 'U+0370-03FF',
    'greek-ext': 'U+1F00-1FFF'
  };
  
  return subsets
    .map(subset => unicodeRanges[subset])
    .filter(Boolean)
    .join(', ');
}

/**
 * Preload fonts programmatically
 */
export function preloadFont(
  href: string,
  format: 'woff2' | 'woff' | 'ttf',
  crossOrigin: boolean = false
): Promise<void> {
  return new Promise((resolve, reject) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'font';
    link.type = `font/${format}`;
    link.href = href;
    
    if (crossOrigin) {
      link.crossOrigin = 'anonymous';
    }
    
    link.onload = () => resolve();
    link.onerror = () => reject(new Error(`Failed to preload font: ${href}`));
    
    document.head.appendChild(link);
  });
}

/**
 * Load font using CSS Font Loading API
 */
export function loadFontFace(
  family: string,
  src: string,
  descriptors: {
    weight?: string;
    style?: string;
    display?: 'auto' | 'block' | 'swap' | 'fallback' | 'optional';
  } = {}
): Promise<FontFace> {
  if (typeof FontFace === 'undefined') {
    return Promise.reject(new Error('FontFace API not supported'));
  }
  
  const fontFace = new FontFace(family, src, descriptors);
  
  return fontFace.load().then(() => {
    document.fonts.add(fontFace);
    return fontFace;
  });
}

/**
 * Check if a font is loaded and available
 */
export function isFontLoaded(family: string, weight: string = '400', style: string = 'normal'): boolean {
  if (typeof document === 'undefined' || !document.fonts) {
    return false;
  }
  
  return document.fonts.check(`${weight} ${style} 12px "${family}"`);
}

/**
 * Wait for fonts to load with timeout
 */
export function waitForFontsReady(timeout: number = 3000): Promise<FontFaceSet> {
  if (typeof document === 'undefined' || !document.fonts) {
    return Promise.resolve({} as FontFaceSet);
  }
  
  return Promise.race([
    document.fonts.ready,
    new Promise<FontFaceSet>((_, reject) => 
      setTimeout(() => reject(new Error('Font loading timeout')), timeout)
    )
  ]);
}