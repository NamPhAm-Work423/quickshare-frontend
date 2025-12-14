// Performance optimization components
export { default as CoreWebVitals, validateCoreWebVitals } from './CoreWebVitals';
export type { CoreWebVitalsProps, PerformanceConfig } from './CoreWebVitals';

export { default as FontPreloader, commonFonts, useFontPreloading } from './FontPreloader';
export type { FontPreloaderProps, FontConfig } from './FontPreloader';

export { default as OptimizedImage, ImagePreloader, useImagePriority } from './ImagePriority';
export type { OptimizedImageProps, ImagePriorityConfig } from './ImagePriority';

// SEO Components
export { default as MetaTags, generateMetadata } from './MetaTags';
export type { MetaTagsProps } from './MetaTags';

export { 
  default as StructuredData,
  OrganizationStructuredData,
  WebPageStructuredData,
  ArticleStructuredData,
  FAQStructuredData,
  SoftwareApplicationStructuredData,
  HowToStructuredData,
  CombinedStructuredData,
  useStructuredData
} from './StructuredData';
export type { 
  StructuredDataProps,
  OrganizationStructuredDataProps,
  WebPageStructuredDataProps,
  ArticleStructuredDataProps,
  FAQStructuredDataProps,
  SoftwareApplicationStructuredDataProps,
  HowToStructuredDataProps,
  CombinedStructuredDataProps
} from './StructuredData';

export { 
  default as Breadcrumbs,
  BlogBreadcrumbs,
  ToolsBreadcrumbs,
  UseCasesBreadcrumbs,
  generateBreadcrumbsFromPath,
  useBreadcrumbs
} from './Breadcrumbs';
export type { 
  BreadcrumbsProps,
  BreadcrumbItem,
  BlogBreadcrumbsProps,
  ToolsBreadcrumbsProps,
  UseCasesBreadcrumbsProps
} from './Breadcrumbs';

export { 
  default as ProgrammaticSEO,
  SEOTemplate,
  SEOGenerator,
  generateVariableCombinations,
  generateSlugFromVariables,
  validateTemplateVariables,
  useProgrammaticSEO
} from './ProgrammaticSEO';
export type { 
  ProgrammaticSEOProps,
  SEOTemplateProps,
  SEOGeneratorProps
} from './ProgrammaticSEO';

// Re-export performance utilities
export { coreWebVitalsConfig } from '../../lib/performance/core-web-vitals';