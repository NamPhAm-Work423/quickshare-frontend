// Content management types
export interface ContentMetadata {
  title: string;
  description: string;
  slug: string;
  publishedAt: string;
  updatedAt?: string;
  primaryKeyword: string;
  secondaryKeywords?: string[];
  searchIntent: 'informational' | 'navigational' | 'transactional' | 'commercial';
  ogImage?: string;
  noIndex?: boolean;
}

export interface BlogPostMetadata extends ContentMetadata {
  author: string;
  tags: string[];
  readingTime: number;
  excerpt?: string;
}

export interface PageMetadata extends ContentMetadata {
  // Pages may have additional metadata fields
}

export interface ParsedContent<T extends ContentMetadata = ContentMetadata> {
  metadata: T;
  content: string;
  excerpt?: string;
  wordCount: number;
  readingTime: number;
}

export interface BlogPost extends ParsedContent<BlogPostMetadata> {
  // Blog-specific properties
}

export interface Page extends ParsedContent<PageMetadata> {
  // Page-specific properties
}

export interface BlogCategory {
  slug: string;
  name: string;
  description: string;
}

export interface BlogTag {
  slug: string;
  name: string;
  count: number;
}

export interface Author {
  name: string;
  bio: string;
  avatar?: string;
}

export interface BlogMetadata {
  title: string;
  description: string;
  categories: BlogCategory[];
  tags: string[];
  authors: Author[];
}

export interface ContentCollection<T extends ContentMetadata = ContentMetadata> {
  items: ParsedContent<T>[];
  total: number;
  categories?: BlogCategory[];
  tags?: BlogTag[];
}

// Content parsing options
export interface ParseOptions {
  includeExcerpt?: boolean;
  excerptLength?: number;
  calculateReadingTime?: boolean;
  wordsPerMinute?: number;
}

// Content query options
export interface ContentQuery {
  category?: string;
  tag?: string;
  author?: string;
  limit?: number;
  offset?: number;
  sortBy?: 'publishedAt' | 'updatedAt' | 'title';
  sortOrder?: 'asc' | 'desc';
}