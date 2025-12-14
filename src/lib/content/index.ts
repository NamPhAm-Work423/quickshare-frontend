// Content management system - main exports
export * from './types';
export * from './parser';
export * from './blog';
export * from './pages';

// Re-export commonly used functions
export {
  // Blog functions
  getAllBlogPosts,
  getBlogPostBySlug,
  getBlogMetadata,
  getBlogPostsByCategory,
  getBlogPostsByTag,
  getAllBlogTags,
  getRecentBlogPosts,
  getRelatedBlogPosts,
} from './blog';

export {
  // Page functions
  getAllPages,
  getPageBySlug,
  getPagesBySearchIntent,
  searchPages,
  getPagesByKeyword,
} from './pages';

export {
  // Utility functions
  parseContent,
  calculateReadingTime,
  extractExcerpt,
  countWords,
  transformMarkdownToHtml,
  generateSlug,
  validateContentMetadata,
  validateBlogPostMetadata,
} from './parser';

export {
  createPageMetadata,
  validatePageSlug,
  generatePageSlug,
} from './pages';

// Content system configuration
export const CONTENT_CONFIG = {
  blog: {
    postsPerPage: 10,
    excerptLength: 160,
    wordsPerMinute: 200,
    defaultAuthor: 'QuickShare Team',
  },
  pages: {
    cacheEnabled: true,
    defaultSearchIntent: 'informational' as const,
  },
  seo: {
    maxTitleLength: 60,
    maxDescriptionLength: 160,
    maxKeywords: 10,
  },
} as const;