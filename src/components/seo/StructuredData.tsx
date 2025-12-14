'use client';

import { 
  StructuredDataType,
  OrganizationSchema,
  WebPageSchema,
  ArticleSchema,
  BreadcrumbSchema,
  FAQSchema,
  SoftwareApplicationSchema,
  structuredDataGenerators,
  validateStructuredData,
  combineStructuredData
} from '../../lib/seo/structured-data';

export interface StructuredDataProps {
  data: object | object[];
  type: 'Organization' | 'WebPage' | 'Article' | 'SoftwareApplication' | 'HowTo' | 'FAQ' | 'BreadcrumbList' | 'custom';
  validate?: boolean;
}

/**
 * StructuredData component for JSON-LD schema markup
 * Generates valid structured data for enhanced search results
 */
export function StructuredData({ 
  data, 
  type, 
  validate = true 
}: StructuredDataProps) {
  // Handle array of structured data objects
  const structuredDataArray = Array.isArray(data) ? data : [data];
  
  // Validate structured data if requested
  const validatedData = validate 
    ? structuredDataArray.filter(item => validateStructuredData(item as StructuredDataType))
    : structuredDataArray;
  
  // If no valid data, don't render anything
  if (validatedData.length === 0) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('StructuredData: No valid structured data provided');
    }
    return null;
  }
  
  // Generate JSON-LD script tag
  const jsonLd = validatedData.length === 1 ? validatedData[0] : validatedData;
  
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(jsonLd, null, process.env.NODE_ENV === 'development' ? 2 : 0)
      }}
    />
  );
}

/**
 * Pre-built structured data components for common schema types
 */

export interface OrganizationStructuredDataProps {
  name?: string;
  description?: string;
  url?: string;
  logo?: string;
  sameAs?: string[];
  contactEmail?: string;
}

export function OrganizationStructuredData(props: OrganizationStructuredDataProps) {
  const data = structuredDataGenerators.organization(props);
  return <StructuredData data={data} type="Organization" />;
}

export interface WebPageStructuredDataProps {
  name: string;
  description: string;
  url: string;
  breadcrumb?: Array<{ name: string; url?: string }>;
}

export function WebPageStructuredData({ breadcrumb, ...props }: WebPageStructuredDataProps) {
  const webPageData = structuredDataGenerators.webPage(props);
  
  // Add breadcrumb if provided
  if (breadcrumb) {
    webPageData.breadcrumb = structuredDataGenerators.breadcrumb(breadcrumb);
  }
  
  return <StructuredData data={webPageData} type="WebPage" />;
}

export interface ArticleStructuredDataProps {
  headline: string;
  description: string;
  url: string;
  datePublished: string;
  dateModified?: string;
  author?: {
    name: string;
    type?: 'Person' | 'Organization';
  };
  image?: string;
}

export function ArticleStructuredData(props: ArticleStructuredDataProps) {
  const data = structuredDataGenerators.article({
    headline: props.headline,
    description: props.description,
    mainEntityOfPage: props.url,
    datePublished: props.datePublished,
    dateModified: props.dateModified,
    ...(props.author && {
      author: {
        '@type': props.author.type || 'Organization',
        name: props.author.name,
      }
    }),
    ...(props.image && {
      image: {
        '@type': 'ImageObject',
        url: props.image,
      }
    })
  });
  
  return <StructuredData data={data} type="Article" />;
}

export interface FAQStructuredDataProps {
  questions: Array<{
    question: string;
    answer: string;
  }>;
}

export function FAQStructuredData({ questions }: FAQStructuredDataProps) {
  const data = structuredDataGenerators.faq(questions);
  return <StructuredData data={data} type="FAQ" />;
}

export interface SoftwareApplicationStructuredDataProps {
  name?: string;
  description?: string;
  url?: string;
  applicationCategory?: string;
  operatingSystem?: string;
  price?: string;
  priceCurrency?: string;
  featureList?: string[];
}

export function SoftwareApplicationStructuredData(props: SoftwareApplicationStructuredDataProps) {
  const data = structuredDataGenerators.softwareApplication({
    ...props,
    ...(props.price && {
      offers: {
        '@type': 'Offer',
        price: props.price,
        priceCurrency: props.priceCurrency || 'USD',
      }
    })
  });
  
  return <StructuredData data={data} type="SoftwareApplication" />;
}

export interface HowToStructuredDataProps {
  name: string;
  description: string;
  image?: string;
  totalTime?: string;
  estimatedCost?: {
    currency: string;
    value: string;
  };
  supply?: string[];
  tool?: string[];
  steps: Array<{
    name: string;
    text: string;
    image?: string;
    url?: string;
  }>;
}

export function HowToStructuredData({
  name,
  description,
  image,
  totalTime,
  estimatedCost,
  supply = [],
  tool = [],
  steps
}: HowToStructuredDataProps) {
  const data: StructuredDataType = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name,
    description,
    ...(image && { image }),
    ...(totalTime && { totalTime }),
    ...(estimatedCost && { estimatedCost }),
    ...(supply.length > 0 && { supply }),
    ...(tool.length > 0 && { tool }),
    step: steps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step.name,
      text: step.text,
      ...(step.image && { image: step.image }),
      ...(step.url && { url: step.url }),
    })),
  };
  
  return <StructuredData data={data} type="HowTo" />;
}

/**
 * Utility hook for generating structured data
 */
export function useStructuredData(type: keyof typeof structuredDataGenerators, data: any) {
  return structuredDataGenerators[type](data);
}

/**
 * Combine multiple structured data objects into a single JSON-LD script
 */
export interface CombinedStructuredDataProps {
  schemas: StructuredDataType[];
  validate?: boolean;
}

export function CombinedStructuredData({ schemas, validate = true }: CombinedStructuredDataProps) {
  const validatedSchemas = validate ? combineStructuredData(schemas) : schemas;
  
  if (validatedSchemas.length === 0) {
    return null;
  }
  
  return <StructuredData data={validatedSchemas} type="custom" validate={false} />;
}

export default StructuredData;