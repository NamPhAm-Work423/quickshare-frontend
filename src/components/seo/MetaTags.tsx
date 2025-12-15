'use client';

import { Metadata } from 'next';
import { PageSEO } from '../../lib/seo/metadata';

export interface MetaTagsProps {
  title: string;
  description: string;
  primaryKeyword: string;
  secondaryKeywords?: string[];
  canonical?: string;
  ogImage?: string;
  noIndex?: boolean;
  structuredData?: object;
  preloadFonts?: string[];
  criticalCSS?: string;
  searchIntent?: 'informational' | 'navigational' | 'transactional' | 'commercial';
  coreWebVitals?: {
    lcpTarget: number;
    clsTarget: number;
    fidTarget: number;
  };
}

/**
 * MetaTags component for CTR-optimized SEO metadata
 * Generates comprehensive meta tags optimized for search engine visibility
 */
export function MetaTags({
  title,
  description,
  primaryKeyword,
  secondaryKeywords = [],
  canonical,
  ogImage,
  noIndex = false,
  structuredData,
  preloadFonts = [],
  criticalCSS,
  searchIntent = 'informational',
  coreWebVitals,
}: MetaTagsProps) {
  // CTR optimization: Ensure title includes primary keyword and is under 60 chars
  const optimizedTitle = optimizeTitleForCTR(title, primaryKeyword);
  
  // Description optimization: Include primary keyword and stay under 160 chars
  const optimizedDescription = optimizeDescriptionForCTR(description, primaryKeyword);
  
  // Generate keywords meta tag (though less important for modern SEO)
  const keywords = [primaryKeyword, ...secondaryKeywords].join(', ');
  
  // Generate Open Graph image URL
  const ogImageUrl = ogImage || '/og-default.png';
  const canonicalUrl = canonical || (typeof window !== 'undefined' ? window.location.href : '');

  return (
    <>
      {/* Basic Meta Tags */}
      <title>{optimizedTitle}</title>
      <meta name="description" content={optimizedDescription} />
      <meta name="keywords" content={keywords} />
      
      {/* Canonical URL */}
      {canonical && <link rel="canonical" href={canonical} />}
      
      {/* Robots directives */}
      <meta 
        name="robots" 
        content={noIndex ? 'noindex,nofollow' : 'index,follow'} 
      />
      
      {/* Open Graph Meta Tags */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={optimizedTitle} />
      <meta property="og:description" content={optimizedDescription} />
      <meta property="og:image" content={ogImageUrl} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:site_name" content="QuickShare" />
      
      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={optimizedTitle} />
      <meta name="twitter:description" content={optimizedDescription} />
      <meta name="twitter:image" content={ogImageUrl} />
      
      {/* Search Intent Optimization */}
      {searchIntent === 'transactional' && (
        <meta name="google-site-verification" content="transactional-intent" />
      )}
      
      {/* Preload Critical Fonts */}
      {preloadFonts.map((font, index) => (
        <link
          key={index}
          rel="preload"
          href={font}
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      ))}
      
      {/* Critical CSS */}
      {criticalCSS && (
        <style dangerouslySetInnerHTML={{ __html: criticalCSS }} />
      )}
      
      {/* Structured Data */}
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData)
          }}
        />
      )}
      
      {/* Core Web Vitals Hints */}
      {coreWebVitals && (
        <>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </>
      )}
    </>
  );
}

/**
 * Optimize title for CTR by ensuring primary keyword is included
 * and length is under 60 characters for full display in SERPs
 */
function optimizeTitleForCTR(title: string, primaryKeyword: string): string {
  // If title already contains primary keyword, return as is (if under 60 chars)
  if (title.toLowerCase().includes(primaryKeyword.toLowerCase())) {
    return title.length <= 60 ? title : title.substring(0, 57) + '...';
  }
  
  // Try to prepend primary keyword if there's space
  const keywordTitle = `${primaryKeyword} - ${title}`;
  if (keywordTitle.length <= 60) {
    return keywordTitle;
  }
  
  // Fallback: truncate original title
  return title.length <= 60 ? title : title.substring(0, 57) + '...';
}

/**
 * Optimize description for CTR by ensuring primary keyword is included
 * and length is under 160 characters for full display in SERPs
 */
function optimizeDescriptionForCTR(description: string, primaryKeyword: string): string {
  // If description already contains primary keyword and is under 160 chars
  if (description.toLowerCase().includes(primaryKeyword.toLowerCase())) {
    return description.length <= 160 ? description : description.substring(0, 157) + '...';
  }
  
  // Try to include primary keyword at the beginning
  const keywordDescription = `${primaryKeyword}: ${description}`;
  if (keywordDescription.length <= 160) {
    return keywordDescription;
  }
  
  // Fallback: truncate original description
  return description.length <= 160 ? description : description.substring(0, 157) + '...';
}

/**
 * Generate Next.js Metadata object from MetaTagsProps
 * For use with Next.js App Router metadata API
 */
export function generateMetadata(props: MetaTagsProps): Metadata {
  const optimizedTitle = optimizeTitleForCTR(props.title, props.primaryKeyword);
  const optimizedDescription = optimizeDescriptionForCTR(props.description, props.primaryKeyword);
  const keywords = [props.primaryKeyword, ...(props.secondaryKeywords || [])];
  
  return {
    title: optimizedTitle,
    description: optimizedDescription,
    keywords: keywords,
    robots: props.noIndex ? 'noindex,nofollow' : 'index,follow',
    alternates: props.canonical ? { canonical: props.canonical } : undefined,
    openGraph: {
      type: 'website',
      title: optimizedTitle,
      description: optimizedDescription,
      images: props.ogImage ? [props.ogImage] : ['/og-default.png'],
      url: props.canonical,
      siteName: 'QuickShare',
    },
    twitter: {
      card: 'summary_large_image',
      title: optimizedTitle,
      description: optimizedDescription,
      images: props.ogImage ? [props.ogImage] : ['/og-default.png'],
    },
  };
}

export default MetaTags;