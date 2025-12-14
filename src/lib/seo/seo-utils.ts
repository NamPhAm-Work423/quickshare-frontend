/**
 * SEO Utility Functions
 * Collection of helper functions for SEO optimization
 */

/**
 * Generate SEO-friendly slug from text
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

/**
 * Calculate reading time for content
 */
export function calculateReadingTime(content: string, wordsPerMinute: number = 200): {
  minutes: number;
  words: number;
  text: string;
} {
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  
  return {
    minutes,
    words,
    text: `${minutes} min read`,
  };
}

/**
 * Extract excerpt from content
 */
export function extractExcerpt(content: string, maxLength: number = 160): string {
  // Remove markdown and HTML tags
  const cleanContent = content
    .replace(/#{1,6}\s+/g, '') // Remove markdown headers
    .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold markdown
    .replace(/\*(.*?)\*/g, '$1') // Remove italic markdown
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/\n+/g, ' ') // Replace newlines with spaces
    .trim();

  if (cleanContent.length <= maxLength) {
    return cleanContent;
  }

  // Find the last complete sentence within the limit
  const truncated = cleanContent.substring(0, maxLength);
  const lastSentence = truncated.lastIndexOf('.');
  
  if (lastSentence > maxLength * 0.7) {
    return truncated.substring(0, lastSentence + 1);
  }

  // If no good sentence break, find last word boundary
  const lastSpace = truncated.lastIndexOf(' ');
  return truncated.substring(0, lastSpace) + '...';
}

/**
 * Validate and clean meta description
 */
export function optimizeMetaDescription(description: string): {
  optimized: string;
  length: number;
  isOptimal: boolean;
  suggestions: string[];
} {
  const cleaned = description.trim().replace(/\s+/g, ' ');
  const length = cleaned.length;
  const isOptimal = length >= 120 && length <= 160;
  const suggestions: string[] = [];

  if (length < 120) {
    suggestions.push('Description is too short. Aim for 120-160 characters.');
  }
  if (length > 160) {
    suggestions.push('Description is too long. Keep it under 160 characters.');
  }
  if (!cleaned.includes('.') && !cleaned.includes('!') && !cleaned.includes('?')) {
    suggestions.push('Consider ending with punctuation for better readability.');
  }
  if (!/[A-Z]/.test(cleaned.charAt(0))) {
    suggestions.push('Start with a capital letter.');
  }

  return {
    optimized: cleaned,
    length,
    isOptimal,
    suggestions,
  };
}

/**
 * Generate alt text for images based on context
 */
export function generateAltText(
  filename: string,
  context?: {
    pageTitle?: string;
    primaryKeyword?: string;
    imageType?: 'screenshot' | 'diagram' | 'photo' | 'icon' | 'logo';
  }
): string {
  // Clean filename
  const baseName = filename
    .replace(/\.[^/.]+$/, '') // Remove extension
    .replace(/[-_]/g, ' ') // Replace hyphens and underscores with spaces
    .replace(/\b\w/g, l => l.toUpperCase()); // Capitalize words

  if (!context) {
    return baseName;
  }

  const { pageTitle, primaryKeyword, imageType } = context;
  
  let altText = baseName;

  // Add context based on image type
  if (imageType) {
    switch (imageType) {
      case 'screenshot':
        altText = `Screenshot of ${baseName}`;
        break;
      case 'diagram':
        altText = `Diagram showing ${baseName}`;
        break;
      case 'icon':
        altText = `${baseName} icon`;
        break;
      case 'logo':
        altText = `${baseName} logo`;
        break;
    }
  }

  // Include primary keyword if relevant
  if (primaryKeyword && !altText.toLowerCase().includes(primaryKeyword.toLowerCase())) {
    altText = `${altText} - ${primaryKeyword}`;
  }

  return altText;
}

/**
 * Analyze content for SEO issues
 */
export function analyzeSEOContent(content: string, targetKeyword?: string): {
  wordCount: number;
  headingStructure: Array<{ level: number; text: string }>;
  keywordDensity: number;
  issues: string[];
  suggestions: string[];
  score: number;
} {
  const issues: string[] = [];
  const suggestions: string[] = [];
  let score = 100;

  // Word count analysis
  const words = content.trim().split(/\s+/);
  const wordCount = words.length;

  if (wordCount < 300) {
    issues.push('Content is too short (under 300 words)');
    score -= 20;
  } else if (wordCount > 2000) {
    suggestions.push('Consider breaking long content into multiple pages');
  }

  // Heading structure analysis
  const headingMatches = content.match(/#{1,6}\s+.+/g) || [];
  const headingStructure = headingMatches.map(heading => {
    const level = heading.match(/^#+/)?.[0].length || 1;
    const text = heading.replace(/^#+\s+/, '');
    return { level, text };
  });

  if (headingStructure.length === 0) {
    issues.push('No headings found');
    score -= 15;
  } else {
    // Check heading hierarchy
    let previousLevel = 0;
    for (const heading of headingStructure) {
      if (heading.level > previousLevel + 1) {
        issues.push(`Heading hierarchy skip detected (h${previousLevel} to h${heading.level})`);
        score -= 5;
      }
      previousLevel = heading.level;
    }
  }

  // Keyword density analysis
  let keywordDensity = 0;
  if (targetKeyword) {
    const keywordRegex = new RegExp(targetKeyword.replace(/\s+/g, '\\s+'), 'gi');
    const keywordMatches = content.match(keywordRegex) || [];
    keywordDensity = (keywordMatches.length / wordCount) * 100;

    if (keywordDensity < 0.5) {
      suggestions.push(`Consider including "${targetKeyword}" more frequently (current: ${keywordDensity.toFixed(1)}%)`);
    } else if (keywordDensity > 3) {
      issues.push(`Keyword density too high (${keywordDensity.toFixed(1)}%) - may be considered spam`);
      score -= 10;
    }

    // Check if keyword appears in first paragraph
    const firstParagraph = content.split('\n\n')[0] || '';
    if (!keywordRegex.test(firstParagraph)) {
      suggestions.push('Include target keyword in the first paragraph');
    }
  }

  // Internal linking analysis
  const internalLinks = content.match(/\[([^\]]+)\]\(\/[^)]+\)/g) || [];
  if (internalLinks.length === 0) {
    suggestions.push('Add internal links to related pages');
  }

  // Image analysis
  const images = content.match(/!\[([^\]]*)\]\([^)]+\)/g) || [];
  const imagesWithoutAlt = content.match(/!\[\]\([^)]+\)/g) || [];
  
  if (imagesWithoutAlt.length > 0) {
    issues.push(`${imagesWithoutAlt.length} images missing alt text`);
    score -= imagesWithoutAlt.length * 5;
  }

  return {
    wordCount,
    headingStructure,
    keywordDensity,
    issues,
    suggestions,
    score: Math.max(0, score),
  };
}

/**
 * Generate schema.org structured data for different content types
 */
export function generateStructuredData(type: string, data: any): object {
  const baseSchema = {
    '@context': 'https://schema.org',
  };

  switch (type) {
    case 'Article':
      return {
        ...baseSchema,
        '@type': 'Article',
        headline: data.title,
        description: data.description,
        author: {
          '@type': 'Person',
          name: data.author || 'QuickShare Team',
        },
        publisher: {
          '@type': 'Organization',
          name: 'QuickShare',
          logo: {
            '@type': 'ImageObject',
            url: '/logo.png',
          },
        },
        datePublished: data.publishedAt,
        dateModified: data.updatedAt || data.publishedAt,
        image: data.image,
        url: data.url,
      };

    case 'HowTo':
      return {
        ...baseSchema,
        '@type': 'HowTo',
        name: data.title,
        description: data.description,
        image: data.image,
        totalTime: data.totalTime || 'PT5M',
        supply: data.supplies || [],
        tool: data.tools || [],
        step: data.steps?.map((step: any, index: number) => ({
          '@type': 'HowToStep',
          position: index + 1,
          name: step.name,
          text: step.text,
          image: step.image,
        })) || [],
      };

    case 'SoftwareApplication':
      return {
        ...baseSchema,
        '@type': 'SoftwareApplication',
        name: data.name,
        description: data.description,
        applicationCategory: data.category || 'UtilitiesApplication',
        operatingSystem: data.operatingSystem || 'Web Browser',
        offers: {
          '@type': 'Offer',
          price: data.price || '0',
          priceCurrency: data.currency || 'USD',
        },
        aggregateRating: data.rating ? {
          '@type': 'AggregateRating',
          ratingValue: data.rating.value,
          ratingCount: data.rating.count,
        } : undefined,
      };

    case 'FAQ':
      return {
        ...baseSchema,
        '@type': 'FAQPage',
        mainEntity: data.questions?.map((q: any) => ({
          '@type': 'Question',
          name: q.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: q.answer,
          },
        })) || [],
      };

    default:
      return baseSchema;
  }
}

/**
 * Validate structured data
 */
export function validateStructuredData(data: object): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Basic validation
  if (!data || typeof data !== 'object') {
    errors.push('Structured data must be an object');
    return { isValid: false, errors, warnings };
  }

  const schema = data as any;

  if (!schema['@context']) {
    errors.push('Missing @context property');
  } else if (schema['@context'] !== 'https://schema.org') {
    warnings.push('@context should be "https://schema.org"');
  }

  if (!schema['@type']) {
    errors.push('Missing @type property');
  }

  // Type-specific validation
  switch (schema['@type']) {
    case 'Article':
      if (!schema.headline) errors.push('Article missing headline');
      if (!schema.author) warnings.push('Article missing author');
      if (!schema.datePublished) warnings.push('Article missing datePublished');
      break;

    case 'WebPage':
      if (!schema.name) errors.push('WebPage missing name');
      if (!schema.url) warnings.push('WebPage missing url');
      break;

    case 'Organization':
      if (!schema.name) errors.push('Organization missing name');
      if (!schema.url) warnings.push('Organization missing url');
      break;
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}