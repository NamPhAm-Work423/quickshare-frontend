import { type Metadata } from 'next';
import { seoConfig, type PageSEO } from './metadata';
import { getSearchIntent } from './search-intent';

export interface MetadataGeneratorOptions {
  pageKey?: string;
  customData?: Partial<PageSEO>;
  variables?: Record<string, string>;
  path?: string;
}

export interface GeneratedMetadata extends Metadata {
  structuredData?: object[];
  coreWebVitals?: {
    lcpTarget: number;
    clsTarget: number;
    fidTarget: number;
  };
}

/**
 * Generate complete Next.js metadata object with SEO optimization
 */
export function generateMetadata(options: MetadataGeneratorOptions = {}): GeneratedMetadata {
  const { pageKey, customData, variables, path } = options;

  // Get base metadata
  let baseMetadata: PageSEO;
  
  if (pageKey && seoConfig.pages[pageKey]) {
    const configPage = seoConfig.pages[pageKey];
    baseMetadata = {
      title: configPage.title,
      description: configPage.description,
      primaryKeyword: configPage.primaryKeyword,
      secondaryKeywords: configPage.secondaryKeywords || [],
      searchIntent: configPage.searchIntent,
      canonical: configPage.canonical,
      ogImage: configPage.ogImage || seoConfig.defaults.ogImage,
      keywords: [configPage.primaryKeyword, ...(configPage.secondaryKeywords || [])],
      noIndex: configPage.noIndex,
      coreWebVitals: configPage.coreWebVitals,
    };
  } else {
    baseMetadata = {
      title: seoConfig.defaults.title,
      description: seoConfig.defaults.description,
      primaryKeyword: 'file sharing',
      secondaryKeywords: ['p2p transfer', 'secure sharing'],
      searchIntent: 'transactional',
      ogImage: seoConfig.defaults.ogImage,
      keywords: ['file sharing', 'p2p transfer', 'secure sharing'],
    };
  }

  // Apply variable substitution
  let processedTitle = baseMetadata.title;
  let processedDescription = baseMetadata.description;

  if (variables) {
    Object.entries(variables).forEach(([key, value]) => {
      const placeholder = `{${key}}`;
      processedTitle = processedTitle.replace(new RegExp(placeholder, 'g'), value);
      processedDescription = processedDescription.replace(new RegExp(placeholder, 'g'), value);
    });
  }

  // Merge with custom data
  const finalMetadata: PageSEO = {
    ...baseMetadata,
    title: processedTitle,
    description: processedDescription,
    ...customData,
  };

  // Generate canonical URL
  const baseUrl = seoConfig.site.url;
  const canonicalUrl = finalMetadata.canonical || (path ? `${baseUrl}${path}` : baseUrl);

  // Generate structured data
  const structuredData: object[] = [];

  // Add WebPage structured data
  structuredData.push({
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: finalMetadata.title,
    description: finalMetadata.description,
    url: canonicalUrl,
    isPartOf: {
      '@type': 'WebSite',
      name: seoConfig.site.name,
      url: seoConfig.site.url,
    },
    primaryImageOfPage: {
      '@type': 'ImageObject',
      url: finalMetadata.ogImage,
    },
  });

  // Add breadcrumb structured data if path is provided
  if (path && path !== '/') {
    const pathSegments = path.split('/').filter(Boolean);
    const breadcrumbItems = [
      { name: 'Home', url: baseUrl },
      ...pathSegments.map((segment, index) => ({
        name: segment.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        url: `${baseUrl}/${pathSegments.slice(0, index + 1).join('/')}`,
      })),
    ];

    structuredData.push({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumbItems.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        item: item.url,
      })),
    });
  }

  // Build Next.js Metadata object
  const metadata: GeneratedMetadata = {
    title: finalMetadata.title,
    description: finalMetadata.description,
    keywords: finalMetadata.keywords,
    
    // Robots
    robots: {
      index: !finalMetadata.noIndex,
      follow: true,
      googleBot: {
        index: !finalMetadata.noIndex,
        follow: true,
      },
    },

    // Open Graph
    openGraph: {
      title: finalMetadata.title,
      description: finalMetadata.description,
      url: canonicalUrl,
      siteName: seoConfig.site.name,
      images: [
        {
          url: finalMetadata.ogImage || seoConfig.defaults.ogImage,
          width: 1200,
          height: 630,
          alt: finalMetadata.title,
        },
      ],
      type: 'website',
    },

    // Twitter
    twitter: {
      card: 'summary_large_image',
      title: finalMetadata.title,
      description: finalMetadata.description,
      images: [finalMetadata.ogImage || seoConfig.defaults.ogImage],
    },

    // Canonical
    alternates: {
      canonical: canonicalUrl,
    },

    // Additional metadata
    structuredData,
    coreWebVitals: finalMetadata.coreWebVitals,
  };

  return metadata;
}

/**
 * Generate metadata for programmatic SEO pages
 */
export function generateProgrammaticMetadata(
  templateKey: string,
  variables: Record<string, string>,
  path?: string
): GeneratedMetadata | null {
  const template = seoConfig.programmatic.templates[templateKey];
  if (!template) {
    return null;
  }

  // Validate variables
  const templateVariables = Object.keys(template.variables);
  const providedVariables = Object.keys(variables);
  const hasAllVariables = templateVariables.every(key => providedVariables.includes(key));

  if (!hasAllVariables) {
    return null;
  }

  // Validate variable values
  const isValidVariables = templateVariables.every(key => {
    const allowedValues = template.variables[key];
    const providedValue = variables[key];
    return allowedValues.includes(providedValue);
  });

  if (!isValidVariables) {
    return null;
  }

  // Generate metadata using template
  let title = template.titleTemplate;
  let description = template.descriptionTemplate;

  Object.entries(variables).forEach(([key, value]) => {
    const placeholder = `{${key}}`;
    title = title.replace(new RegExp(placeholder, 'g'), value);
    description = description.replace(new RegExp(placeholder, 'g'), value);
  });

  // Create custom metadata
  const customData: Partial<PageSEO> = {
    title,
    description,
    primaryKeyword: Object.values(variables).join(' ').toLowerCase(),
    secondaryKeywords: Object.values(variables),
    searchIntent: 'informational', // Most programmatic pages are informational
  };

  return generateMetadata({ customData, variables, path });
}

/**
 * Generate metadata based on search intent analysis
 */
export function generateMetadataFromIntent(
  keyword: string,
  path?: string
): GeneratedMetadata {
  const intentData = getSearchIntent(keyword);
  
  if (intentData) {
    // Use intent-specific optimization
    const customData: Partial<PageSEO> = {
      primaryKeyword: keyword,
      secondaryKeywords: intentData.keywords.filter(k => k !== keyword),
      searchIntent: intentData.intent,
    };

    // Optimize title and description based on intent
    switch (intentData.intent) {
      case 'transactional':
        customData.title = `${keyword} - Start Now | ${seoConfig.site.name}`;
        customData.description = `${keyword} instantly with ${seoConfig.site.name}. No signup required. Start sharing files securely in seconds.`;
        break;
      case 'commercial':
        customData.title = `Best ${keyword} - Compare Options | ${seoConfig.site.name}`;
        customData.description = `Compare ${keyword} options. See why ${seoConfig.site.name} is the top choice for secure, anonymous file sharing.`;
        break;
      case 'informational':
        customData.title = `${keyword} - Complete Guide | ${seoConfig.site.name}`;
        customData.description = `Learn everything about ${keyword}. Comprehensive guide with examples, best practices, and expert tips.`;
        break;
      case 'navigational':
        customData.title = `${keyword} | ${seoConfig.site.name}`;
        customData.description = `Official ${keyword} page. Access all features and information about ${seoConfig.site.name}.`;
        break;
    }

    return generateMetadata({ customData, path });
  }

  // Fallback to default metadata
  return generateMetadata({ path });
}

/**
 * Utility to extract keywords from content for SEO optimization
 */
export function extractKeywords(content: string, maxKeywords: number = 10): string[] {
  // Simple keyword extraction - in production, you might want to use a more sophisticated NLP library
  const words = content
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 3);

  // Count word frequency
  const wordCount = words.reduce((acc, word) => {
    acc[word] = (acc[word] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Sort by frequency and return top keywords
  return Object.entries(wordCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, maxKeywords)
    .map(([word]) => word);
}

/**
 * Generate meta tags for Core Web Vitals optimization
 */
export function generateCoreWebVitalsTags(config?: PageSEO['coreWebVitals']) {
  if (!config) return {};

  return {
    // Viewport optimization for CLS
    viewport: 'width=device-width, initial-scale=1, viewport-fit=cover',
    
    // Performance hints
    'http-equiv': {
      'x-dns-prefetch-control': 'on',
    },
  };
}