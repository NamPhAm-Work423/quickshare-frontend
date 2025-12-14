import { useMemo } from 'react';
import { seoConfig, type PageSEO } from '@/lib/seo/metadata';

export interface UseSEOMetadataOptions {
  pageKey?: string;
  customMetadata?: Partial<PageSEO>;
  variables?: Record<string, string>;
}

export interface SEOMetadataResult {
  metadata: PageSEO;
  structuredData: object[];
  canonicalUrl: string;
  openGraph: {
    title: string;
    description: string;
    image: string;
    type: string;
    url: string;
  };
  twitterCard: {
    card: string;
    title: string;
    description: string;
    image: string;
  };
}

/**
 * Hook for generating complete SEO metadata for pages
 * Supports programmatic SEO with variable substitution
 */
export function useSEOMetadata(options: UseSEOMetadataOptions = {}): SEOMetadataResult {
  const { pageKey, customMetadata, variables } = options;

  return useMemo(() => {
    // Get base metadata from config
    let baseMetadata: PageSEO;
    
    if (pageKey && seoConfig.pages[pageKey]) {
      baseMetadata = seoConfig.pages[pageKey];
    } else {
      // Use defaults if no page key or page not found
      baseMetadata = {
        title: seoConfig.defaults.title,
        description: seoConfig.defaults.description,
        primaryKeyword: 'file sharing',
        secondaryKeywords: ['p2p transfer', 'secure sharing'],
        searchIntent: 'transactional' as const,
        ogImage: seoConfig.defaults.ogImage,
      };
    }

    // Apply variable substitution for programmatic SEO
    let processedTitle = baseMetadata.title;
    let processedDescription = baseMetadata.description;

    if (variables) {
      Object.entries(variables).forEach(([key, value]) => {
        const placeholder = `{${key}}`;
        processedTitle = processedTitle.replace(new RegExp(placeholder, 'g'), value);
        processedDescription = processedDescription.replace(new RegExp(placeholder, 'g'), value);
      });
    }

    // Apply variable substitution to custom metadata as well
    let customTitle = customMetadata?.title || processedTitle;
    let customDescription = customMetadata?.description || processedDescription;

    if (variables && customMetadata) {
      Object.entries(variables).forEach(([key, value]) => {
        const placeholder = `{${key}}`;
        if (customMetadata.title) {
          customTitle = customTitle.replace(new RegExp(placeholder, 'g'), value);
        }
        if (customMetadata.description) {
          customDescription = customDescription.replace(new RegExp(placeholder, 'g'), value);
        }
      });
    }

    // Merge with custom metadata
    const finalMetadata: PageSEO = {
      ...customMetadata,
      title: customTitle,
      description: customDescription,
      primaryKeyword: baseMetadata.primaryKeyword,
      secondaryKeywords: baseMetadata.secondaryKeywords || [],
      searchIntent: baseMetadata.searchIntent,
      canonical: baseMetadata.canonical,
      ogImage: baseMetadata.ogImage || seoConfig.defaults.ogImage,
      keywords: [
        baseMetadata.primaryKeyword,
        ...(baseMetadata.secondaryKeywords || [])
      ],
      noIndex: baseMetadata.noIndex,
      coreWebVitals: baseMetadata.coreWebVitals,
    };

    // Generate canonical URL
    const canonicalUrl = finalMetadata.canonical || 
      (typeof window !== 'undefined' ? window.location.href : seoConfig.site.url);

    // Generate Open Graph metadata
    const openGraph = {
      title: finalMetadata.title,
      description: finalMetadata.description,
      image: finalMetadata.ogImage || seoConfig.defaults.ogImage,
      type: 'website',
      url: canonicalUrl,
    };

    // Generate Twitter Card metadata
    const twitterCard = {
      card: 'summary_large_image',
      title: finalMetadata.title,
      description: finalMetadata.description,
      image: finalMetadata.ogImage || seoConfig.defaults.ogImage,
    };

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
    });

    // Add any custom structured data from metadata
    if (baseMetadata.structuredData) {
      structuredData.push(...baseMetadata.structuredData);
    }

    return {
      metadata: finalMetadata,
      structuredData,
      canonicalUrl,
      openGraph,
      twitterCard,
    };
  }, [pageKey, customMetadata, variables]);
}