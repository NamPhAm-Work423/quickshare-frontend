// SEO Library Barrel Export
export { seoConfig, seoMetadata, structuredData, type SEOConfig, type PageSEO } from './metadata';
export { 
  searchIntentMap, 
  getSearchIntent, 
  getAllKeywords, 
  getPagesByIntent,
  getIntentRecommendations,
  analyzeKeywordCompetition,
  generateKeywordVariations,
  getContentOptimizationSuggestions,
  type SearchIntentMap 
} from './search-intent';
export { 
  generateMetadata,
  generateProgrammaticMetadata,
  generateMetadataFromIntent,
  extractKeywords,
  generateCoreWebVitalsTags,
  type MetadataGeneratorOptions,
  type GeneratedMetadata
} from './metadata-generator';
export {
  generateSlug,
  calculateReadingTime,
  extractExcerpt,
  optimizeMetaDescription,
  generateAltText,
  analyzeSEOContent,
  generateStructuredData,
  validateStructuredData
} from './seo-utils';
export { 
  ProgrammaticPageGenerator, 
  defaultPageGenerator, 
  type GeneratedPage, 
  type PageGenerationConfig 
} from './page-generator';
export { 
  SEOTemplateEngine, 
  defaultTemplateEngine, 
  type TemplateVariable, 
  type SEOTemplateConfig 
} from './template-engine';