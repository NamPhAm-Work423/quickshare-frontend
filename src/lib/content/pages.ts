// Static pages content management utilities
import { promises as fs } from 'fs';
import path from 'path';
import { Page, PageMetadata } from './types';
import { parseContent, validateContentMetadata } from './parser';

const CONTENT_DIR = path.join(process.cwd(), 'content');
const PAGES_DIR = path.join(CONTENT_DIR, 'pages');

export class PageManager {
  private static instance: PageManager;
  private pagesCache: Map<string, Page> = new Map();

  static getInstance(): PageManager {
    if (!PageManager.instance) {
      PageManager.instance = new PageManager();
    }
    return PageManager.instance;
  }

  async getAllPages(): Promise<Page[]> {
    try {
      const files = await fs.readdir(PAGES_DIR);
      const markdownFiles = files.filter(file => file.endsWith('.md'));
      
      const pages: Page[] = [];
      
      for (const file of markdownFiles) {
        try {
          const page = await this.getPageByFilename(file);
          if (page) {
            pages.push(page);
          }
        } catch (error) {
          console.error(`Error parsing page ${file}:`, error);
        }
      }

      // Sort by title
      return pages.sort((a, b) => a.metadata.title.localeCompare(b.metadata.title));
    } catch (error) {
      console.error('Error reading pages:', error);
      return [];
    }
  }

  async getPageBySlug(slug: string): Promise<Page | null> {
    // Check cache first
    if (this.pagesCache.has(slug)) {
      return this.pagesCache.get(slug)!;
    }

    try {
      const pages = await this.getAllPages();
      const page = pages.find(p => p.metadata.slug === slug) || null;
      
      if (page) {
        this.pagesCache.set(slug, page);
      }
      
      return page;
    } catch (error) {
      console.error(`Error getting page by slug ${slug}:`, error);
      return null;
    }
  }

  private async getPageByFilename(filename: string): Promise<Page | null> {
    try {
      const filePath = path.join(PAGES_DIR, filename);
      const content = await fs.readFile(filePath, 'utf-8');
      
      const parsed = parseContent<PageMetadata>(content, {
        includeExcerpt: true,
        calculateReadingTime: true,
      });

      if (!validateContentMetadata(parsed.metadata)) {
        console.error(`Invalid metadata in ${filename}`);
        return null;
      }

      return parsed as Page;
    } catch (error) {
      console.error(`Error reading page ${filename}:`, error);
      return null;
    }
  }

  async getPagesBySearchIntent(intent: PageMetadata['searchIntent']): Promise<Page[]> {
    const pages = await this.getAllPages();
    return pages.filter(page => page.metadata.searchIntent === intent);
  }

  async searchPages(query: string): Promise<Page[]> {
    const pages = await this.getAllPages();
    const lowercaseQuery = query.toLowerCase();
    
    return pages.filter(page => 
      page.metadata.title.toLowerCase().includes(lowercaseQuery) ||
      page.metadata.description.toLowerCase().includes(lowercaseQuery) ||
      page.content.toLowerCase().includes(lowercaseQuery) ||
      page.metadata.primaryKeyword.toLowerCase().includes(lowercaseQuery) ||
      (page.metadata.secondaryKeywords || []).some(keyword => 
        keyword.toLowerCase().includes(lowercaseQuery)
      )
    );
  }

  async getPagesByKeyword(keyword: string): Promise<Page[]> {
    const pages = await this.getAllPages();
    const lowercaseKeyword = keyword.toLowerCase();
    
    return pages.filter(page => 
      page.metadata.primaryKeyword.toLowerCase().includes(lowercaseKeyword) ||
      (page.metadata.secondaryKeywords || []).some(k => 
        k.toLowerCase().includes(lowercaseKeyword)
      )
    );
  }

  clearCache(): void {
    this.pagesCache.clear();
  }

  async refreshPage(slug: string): Promise<Page | null> {
    this.pagesCache.delete(slug);
    return this.getPageBySlug(slug);
  }
}

// Convenience functions
export const pageManager = PageManager.getInstance();

export async function getAllPages(): Promise<Page[]> {
  return pageManager.getAllPages();
}

export async function getPageBySlug(slug: string): Promise<Page | null> {
  return pageManager.getPageBySlug(slug);
}

export async function getPagesBySearchIntent(intent: PageMetadata['searchIntent']): Promise<Page[]> {
  return pageManager.getPagesBySearchIntent(intent);
}

export async function searchPages(query: string): Promise<Page[]> {
  return pageManager.searchPages(query);
}

export async function getPagesByKeyword(keyword: string): Promise<Page[]> {
  return pageManager.getPagesByKeyword(keyword);
}

// Utility functions for page management
export function createPageMetadata(
  title: string,
  description: string,
  slug: string,
  primaryKeyword: string,
  options: Partial<PageMetadata> = {}
): PageMetadata {
  return {
    title,
    description,
    slug,
    publishedAt: new Date().toISOString().split('T')[0],
    primaryKeyword,
    searchIntent: 'informational',
    ...options,
  };
}

export function validatePageSlug(slug: string): boolean {
  // Check if slug is valid (lowercase, hyphens, no special chars)
  const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  return slugRegex.test(slug);
}

export function generatePageSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
}