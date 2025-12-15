/**
 * Centralized font configuration system
 * Provides type-safe font definitions, display strategies, and fallback chains
 */

export interface FontMetrics {
  ascent: number;
  descent: number;
  lineGap: number;
  unitsPerEm: number;
  xHeight: number;
  capHeight: number;
}

export interface FontAsset {
  family: string;
  weight: number;
  style: 'normal' | 'italic';
  format: 'woff2' | 'woff' | 'ttf';
  url: string;
  checksum?: string;
}

export interface FontConfig {
  family: string;
  weights: number[];
  styles: ('normal' | 'italic')[];
  display: 'auto' | 'block' | 'swap' | 'fallback' | 'optional';
  preload: boolean;
  fallbacks: string[];
  subsets: string[];
  metrics?: FontMetrics;
}

export interface FontDisplayStrategy {
  strategy: 'auto' | 'block' | 'swap' | 'fallback' | 'optional';
  description: string;
  useCase: string;
}

export interface PreloadRule {
  family: string;
  weight: number;
  style: 'normal' | 'italic';
  format: 'woff2' | 'woff' | 'ttf';
  priority: 'high' | 'low';
}

// Font display strategies with their characteristics
export const FONT_DISPLAY_STRATEGIES: Record<string, FontDisplayStrategy> = {
  auto: {
    strategy: 'auto',
    description: 'Browser default behavior',
    useCase: 'Default fallback when no specific strategy is needed'
  },
  block: {
    strategy: 'block',
    description: 'Block text rendering until font loads (up to 3s)',
    useCase: 'Critical fonts where text must not be visible without proper font'
  },
  swap: {
    strategy: 'swap',
    description: 'Show fallback immediately, swap when font loads',
    useCase: 'Most web fonts - prevents invisible text'
  },
  fallback: {
    strategy: 'fallback',
    description: 'Brief block period (100ms), then fallback, swap if font loads quickly',
    useCase: 'Performance-critical fonts with acceptable fallbacks'
  },
  optional: {
    strategy: 'optional',
    description: 'Brief block period, use font only if already cached',
    useCase: 'Non-critical fonts that should not delay rendering'
  }
};

// Inter font metrics for accurate fallback matching
export const INTER_FONT_METRICS: FontMetrics = {
  ascent: 2728,
  descent: -680,
  lineGap: 0,
  unitsPerEm: 2816,
  xHeight: 1536,
  capHeight: 2048
};

// System font fallbacks with similar metrics to Inter
export const SYSTEM_FONT_FALLBACKS = [
  '-apple-system',
  'BlinkMacSystemFont',
  '"Segoe UI"',
  'Roboto',
  '"Helvetica Neue"',
  'Arial',
  'sans-serif'
];

// Inter font family configuration
export const INTER_FONT_CONFIG: FontConfig = {
  family: 'Inter',
  weights: [400, 500, 600, 700],
  styles: ['normal', 'italic'],
  display: 'swap',
  preload: true,
  fallbacks: SYSTEM_FONT_FALLBACKS,
  subsets: ['latin', 'latin-ext'],
  metrics: INTER_FONT_METRICS
};

// Default font configurations for the application
export const DEFAULT_FONT_CONFIGS: Record<string, FontConfig> = {
  primary: INTER_FONT_CONFIG,
  heading: {
    ...INTER_FONT_CONFIG,
    weights: [600, 700],
    display: 'swap',
    preload: true
  },
  body: {
    ...INTER_FONT_CONFIG,
    weights: [400, 500],
    display: 'swap',
    preload: true
  },
  ui: {
    ...INTER_FONT_CONFIG,
    weights: [400, 500, 600],
    display: 'fallback',
    preload: false
  }
};

// Preload rules for critical fonts
export const CRITICAL_FONT_PRELOADS: PreloadRule[] = [
  {
    family: 'Inter',
    weight: 400,
    style: 'normal',
    format: 'woff2',
    priority: 'high'
  },
  {
    family: 'Inter',
    weight: 600,
    style: 'normal',
    format: 'woff2',
    priority: 'high'
  },
  {
    family: 'Inter',
    weight: 500,
    style: 'normal',
    format: 'woff2',
    priority: 'low'
  }
];

/**
 * Get font configuration by name
 */
export function getFontConfig(name: keyof typeof DEFAULT_FONT_CONFIGS): FontConfig {
  const config = DEFAULT_FONT_CONFIGS[name];
  if (!config) {
    throw new Error(`Font configuration '${name}' not found`);
  }
  return config;
}

/**
 * Get all available font weights for a configuration
 */
export function getAvailableWeights(config: FontConfig): number[] {
  return [...config.weights].sort((a, b) => a - b);
}

/**
 * Get all available font styles for a configuration
 */
export function getAvailableStyles(config: FontConfig): ('normal' | 'italic')[] {
  return [...config.styles];
}

/**
 * Check if a specific weight and style combination is available
 */
export function isFontVariantAvailable(
  config: FontConfig,
  weight: number,
  style: 'normal' | 'italic'
): boolean {
  return config.weights.includes(weight) && config.styles.includes(style);
}

/**
 * Get the fallback font chain as a CSS font-family string
 */
export function getFallbackFontChain(config: FontConfig): string {
  return [config.family, ...config.fallbacks].join(', ');
}

/**
 * Validate font configuration
 */
export function validateFontConfig(config: FontConfig): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!config.family || config.family.trim().length === 0) {
    errors.push('Font family name cannot be empty');
  }

  if (!config.weights || config.weights.length === 0) {
    errors.push('At least one font weight must be specified');
  }

  if (config.weights.some(weight => !Number.isInteger(weight) || weight < 100 || weight > 900)) {
    errors.push('Font weights must be integers between 100 and 900');
  }

  if (!config.styles || config.styles.length === 0) {
    errors.push('At least one font style must be specified');
  }

  if (!['auto', 'block', 'swap', 'fallback', 'optional'].includes(config.display)) {
    errors.push('Invalid font display strategy');
  }

  if (!Array.isArray(config.fallbacks)) {
    errors.push('Fallbacks must be an array of font names');
  }

  if (!Array.isArray(config.subsets)) {
    errors.push('Subsets must be an array of subset names');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}