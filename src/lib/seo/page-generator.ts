/**
 * Programmatic Page Generator
 * Generates SEO-optimized pages using templates and variable substitution
 */

import { defaultTemplateEngine, SEOTemplateEngine } from './template-engine';
import { createProgrammaticMetadata, GeneratedPageData } from './programmatic';
import { structuredDataGenerators } from './structured-data';

export interface GeneratedPage {
  slug: string;
  title: string;
  description: string;
  primaryKeyword: string;
  canonical: string;
  keywords: string[];
  structuredData: any[];
  variables: Record<string, string>;
  content?: string;
}

export interface PageGenerationConfig {
  templateName: string;
  urlPattern: string;
  baseUrl?: string;
  includeStructuredData?: boolean;
  contentTemplate?: string;
}

export class ProgrammaticPageGenerator {
  private templateEngine: SEOTemplateEngine;

  constructor(templateEngine: SEOTemplateEngine = defaultTemplateEngine) {
    this.templateEngine = templateEngine;
  }

  /**
   * Generate pages based on a template and URL pattern
   */
  generatePages(config: PageGenerationConfig): GeneratedPage[] {
    const combinations = this.templateEngine.generateCombinations(config.templateName);
    const baseUrl = config.baseUrl || 'https://quickshare.app';
    
    return combinations.map(combination => {
      const slug = this.generateSlug(config.urlPattern, combination.variables);
      const primaryKeyword = this.generatePrimaryKeyword(combination.variables);
      const canonical = `${baseUrl}/${slug}`;
      const keywords = this.generateKeywords(combination.variables, primaryKeyword);
      
      const page: GeneratedPage = {
        slug,
        title: combination.title,
        description: combination.description,
        primaryKeyword,
        canonical,
        keywords,
        structuredData: [],
        variables: combination.variables,
      };

      // Add structured data if requested
      if (config.includeStructuredData) {
        page.structuredData = this.generateStructuredData(page);
      }

      // Generate content if template provided
      if (config.contentTemplate) {
        page.content = this.generateContent(config.contentTemplate, combination.variables);
      }

      return page;
    });
  }

  /**
   * Generate a single page with specific variables
   */
  generateSinglePage(
    templateName: string,
    variables: Record<string, string>,
    urlPattern: string,
    config?: Partial<PageGenerationConfig>
  ): GeneratedPage | null {
    const processed = this.templateEngine.processTemplate(templateName, variables);
    if (!processed) {
      return null;
    }

    const baseUrl = config?.baseUrl || 'https://quickshare.app';
    const slug = this.generateSlug(urlPattern, variables);
    const primaryKeyword = this.generatePrimaryKeyword(variables);
    const canonical = `${baseUrl}/${slug}`;
    const keywords = this.generateKeywords(variables, primaryKeyword);

    const page: GeneratedPage = {
      slug,
      title: processed.title,
      description: processed.description,
      primaryKeyword,
      canonical,
      keywords,
      structuredData: [],
      variables,
    };

    if (config?.includeStructuredData) {
      page.structuredData = this.generateStructuredData(page);
    }

    if (config?.contentTemplate) {
      page.content = this.generateContent(config.contentTemplate, variables);
    }

    return page;
  }

  /**
   * Validate generated pages for SEO compliance
   */
  validatePages(pages: GeneratedPage[]): {
    isValid: boolean;
    errors: string[];
    warnings: string[];
  } {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Check for duplicate slugs
    const slugs = pages.map(p => p.slug);
    const uniqueSlugs = new Set(slugs);
    if (uniqueSlugs.size !== slugs.length) {
      errors.push('Duplicate slugs found in generated pages');
    }

    // Check for duplicate titles
    const titles = pages.map(p => p.title);
    const uniqueTitles = new Set(titles);
    if (uniqueTitles.size !== titles.length) {
      warnings.push('Duplicate titles found in generated pages');
    }

    // Validate each page
    pages.forEach((page, index) => {
      // Title length
      if (page.title.length > 60) {
        warnings.push(`Page ${index + 1} (${page.slug}): Title too long (${page.title.length} chars)`);
      }
      if (page.title.length < 10) {
        warnings.push(`Page ${index + 1} (${page.slug}): Title too short (${page.title.length} chars)`);
      }

      // Description length
      if (page.description.length > 160) {
        warnings.push(`Page ${index + 1} (${page.slug}): Description too long (${page.description.length} chars)`);
      }
      if (page.description.length < 50) {
        warnings.push(`Page ${index + 1} (${page.slug}): Description too short (${page.description.length} chars)`);
      }

      // Required fields
      if (!page.title || !page.description || !page.canonical) {
        errors.push(`Page ${index + 1} (${page.slug}): Missing required fields`);
      }

      // URL format
      if (!page.canonical.match(/^https?:\/\/.+/)) {
        errors.push(`Page ${index + 1} (${page.slug}): Invalid canonical URL format`);
      }

      // Keywords
      if (!page.keywords || page.keywords.length === 0) {
        warnings.push(`Page ${index + 1} (${page.slug}): No keywords defined`);
      }
    });

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  private generateSlug(pattern: string, variables: Record<string, string>): string {
    let slug = pattern;
    
    // Replace variables in pattern
    Object.entries(variables).forEach(([key, value]) => {
      const placeholder = `{${key}}`;
      slug = slug.replace(new RegExp(placeholder, 'g'), this.slugify(value));
    });

    // Clean up the slug
    return slug
      .replace(/^\/+/, '') // Remove leading slashes
      .replace(/\/+$/, '') // Remove trailing slashes
      .replace(/\/+/g, '/'); // Replace multiple slashes with single slash
  }

  private generatePrimaryKeyword(variables: Record<string, string>): string {
    // Generate a primary keyword based on the variables
    const values = Object.values(variables);
    if (values.length >= 2) {
      return `send file from ${values[0]} to ${values[1]}`.toLowerCase();
    }
    return `file transfer ${values[0] || ''}`.toLowerCase().trim();
  }

  private generateKeywords(variables: Record<string, string>, primaryKeyword: string): string[] {
    const keywords = [primaryKeyword];
    
    // Add variable-based keywords
    Object.values(variables).forEach(value => {
      keywords.push(`${value.toLowerCase()} file transfer`);
      keywords.push(`send files ${value.toLowerCase()}`);
    });

    // Add generic keywords
    keywords.push('p2p file sharing', 'secure file transfer', 'no login file sharing');

    // Remove duplicates and empty strings
    return [...new Set(keywords.filter(k => k.trim() !== ''))];
  }

  private generateStructuredData(page: GeneratedPage): any[] {
    const structuredData = [];

    // Add WebPage structured data
    structuredData.push(structuredDataGenerators.webPage({
      name: page.title,
      description: page.description,
      url: page.canonical,
    }));

    // Add Article structured data for how-to pages
    if (page.slug.includes('how-to')) {
      structuredData.push(structuredDataGenerators.article({
        headline: page.title,
        description: page.description,
        mainEntityOfPage: page.canonical,
        datePublished: new Date().toISOString(),
      }));
    }

    // Add breadcrumb structured data
    const breadcrumbItems = this.generateBreadcrumbs(page.slug);
    if (breadcrumbItems.length > 1) {
      structuredData.push(structuredDataGenerators.breadcrumb(breadcrumbItems));
    }

    return structuredData;
  }

  private generateBreadcrumbs(slug: string): Array<{ name: string; url?: string }> {
    const parts = slug.split('/').filter(part => part !== '');
    const breadcrumbs = [{ name: 'Home', url: 'https://quickshare.app' }];

    let currentPath = '';
    parts.forEach((part, index) => {
      currentPath += `/${part}`;
      const name = this.humanizeSlug(part);
      
      if (index === parts.length - 1) {
        // Last item (current page) doesn't need URL
        breadcrumbs.push({ name, url: undefined });
      } else {
        breadcrumbs.push({ name, url: `https://quickshare.app${currentPath}` });
      }
    });

    return breadcrumbs;
  }

  private generateContent(template: string, variables: Record<string, string>): string {
    let content = template;
    
    Object.entries(variables).forEach(([key, value]) => {
      const placeholder = `{${key}}`;
      content = content.replace(new RegExp(placeholder, 'g'), value);
    });

    return content;
  }

  private slugify(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  private humanizeSlug(slug: string): string {
    return slug
      .replace(/-/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase());
  }
}

// Default page generator instance
export const defaultPageGenerator = new ProgrammaticPageGenerator();