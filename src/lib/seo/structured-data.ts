// Structured Data (JSON-LD) Generation System
export interface StructuredDataType {
  '@context': string;
  '@type': string;
  [key: string]: any;
}

export interface OrganizationSchema extends StructuredDataType {
  '@type': 'Organization';
  name: string;
  description: string;
  url: string;
  logo?: string;
  sameAs?: string[];
  foundingDate?: string;
  contactPoint?: {
    '@type': 'ContactPoint';
    contactType: string;
    email?: string;
  };
}

export interface WebPageSchema extends StructuredDataType {
  '@type': 'WebPage';
  name: string;
  description: string;
  url: string;
  mainEntity?: any;
  breadcrumb?: BreadcrumbSchema;
}

export interface ArticleSchema extends StructuredDataType {
  '@type': 'Article';
  headline: string;
  description: string;
  author: {
    '@type': 'Person' | 'Organization';
    name: string;
  };
  publisher: {
    '@type': 'Organization';
    name: string;
    logo?: {
      '@type': 'ImageObject';
      url: string;
    };
  };
  datePublished: string;
  dateModified?: string;
  mainEntityOfPage: string;
}

export interface BreadcrumbSchema extends StructuredDataType {
  '@type': 'BreadcrumbList';
  itemListElement: Array<{
    '@type': 'ListItem';
    position: number;
    name: string;
    item?: string;
  }>;
}

export interface FAQSchema extends StructuredDataType {
  '@type': 'FAQPage';
  mainEntity: Array<{
    '@type': 'Question';
    name: string;
    acceptedAnswer: {
      '@type': 'Answer';
      text: string;
    };
  }>;
}

export interface SoftwareApplicationSchema extends StructuredDataType {
  '@type': 'SoftwareApplication';
  name: string;
  description: string;
  url: string;
  applicationCategory: string;
  operatingSystem: string;
  offers?: {
    '@type': 'Offer';
    price: string;
    priceCurrency: string;
  };
  featureList?: string[];
}

// Structured data generators
export const structuredDataGenerators = {
  organization: (data: Partial<OrganizationSchema>): OrganizationSchema => ({
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'QuickShare',
    description: 'Secure P2P file sharing without login',
    url: 'https://quickshare.app',
    logo: 'https://quickshare.app/logo.png',
    sameAs: [],
    foundingDate: '2024',
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'technical support',
    },
    ...data,
  }),

  webPage: (data: Partial<WebPageSchema>): WebPageSchema => ({
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: data.name || 'QuickShare',
    description: data.description || 'Secure P2P file sharing',
    url: data.url || 'https://quickshare.app',
    ...data,
  }),

  article: (data: Partial<ArticleSchema>): ArticleSchema => ({
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: data.headline || 'Article Title',
    description: data.description || 'Article description',
    author: {
      '@type': 'Organization',
      name: 'QuickShare Team',
    },
    publisher: {
      '@type': 'Organization',
      name: 'QuickShare',
      logo: {
        '@type': 'ImageObject',
        url: 'https://quickshare.app/logo.png',
      },
    },
    datePublished: data.datePublished || new Date().toISOString(),
    mainEntityOfPage: data.mainEntityOfPage || 'https://quickshare.app',
    ...data,
  }),

  breadcrumb: (items: Array<{ name: string; url?: string }>): BreadcrumbSchema => ({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      ...(item.url && { item: item.url }),
    })),
  }),

  faq: (questions: Array<{ question: string; answer: string }>): FAQSchema => ({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: questions.map(q => ({
      '@type': 'Question',
      name: q.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: q.answer,
      },
    })),
  }),

  softwareApplication: (data: Partial<SoftwareApplicationSchema>): SoftwareApplicationSchema => ({
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'QuickShare',
    description: 'P2P file sharing application with 6-digit codes',
    url: 'https://quickshare.app/app',
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Web Browser',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    featureList: [
      'P2P file transfer',
      'No login required',
      '6-digit code sharing',
      'End-to-end encryption',
      'No server storage',
    ],
    ...data,
  }),
};

// Utility functions
export function generateStructuredData(
  type: keyof typeof structuredDataGenerators,
  data: any
): StructuredDataType {
  return structuredDataGenerators[type](data);
}

export function validateStructuredData(data: StructuredDataType): boolean {
  return !!(
    data['@context'] &&
    data['@type'] &&
    typeof data === 'object'
  );
}

export function combineStructuredData(schemas: StructuredDataType[]): StructuredDataType[] {
  return schemas.filter(validateStructuredData);
}