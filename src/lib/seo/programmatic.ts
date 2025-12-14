// Programmatic SEO System
import { SEOTemplate, SEOGenerator } from './metadata';
import { defaultPageGenerator, ProgrammaticPageGenerator, GeneratedPage } from './page-generator';
import { defaultTemplateEngine } from './template-engine';

export interface ProgrammaticPage {
  pattern: string;
  variables: Record<string, string[]>;
  maxCombinations: number;
  template: {
    title: string;
    description: string;
  };
}

export interface GeneratedPageData {
  slug: string;
  title: string;
  description: string;
  primaryKeyword: string;
  variables: Record<string, string>;
}

export class ProgrammaticSEOGenerator {
  private templates: Record<string, SEOTemplate>;
  private generators: Record<string, SEOGenerator>;

  constructor(templates: Record<string, SEOTemplate>, generators: Record<string, SEOGenerator>) {
    this.templates = templates;
    this.generators = generators;
  }

  generatePages(generatorName: string): GeneratedPageData[] {
    const generator = this.generators[generatorName];
    const template = this.templates[generator.template];
    
    if (!generator || !template) {
      throw new Error(`Generator or template not found: ${generatorName}`);
    }

    const pages: GeneratedPageData[] = [];
    const variableKeys = Object.keys(template.variables);
    
    // Generate all combinations up to maxPages limit
    const combinations = this.generateCombinations(template.variables, generator.maxPages);
    
    for (const combination of combinations) {
      const variables: Record<string, string> = {};
      variableKeys.forEach((key, index) => {
        variables[key] = combination[index];
      });

      const slug = this.interpolateString(generator.pattern, variables);
      const title = this.interpolateString(template.titleTemplate, variables);
      const description = this.interpolateString(template.descriptionTemplate, variables);
      const primaryKeyword = this.generatePrimaryKeyword(variables);

      pages.push({
        slug: slug.replace(/^\//, ''), // Remove leading slash
        title,
        description,
        primaryKeyword,
        variables,
      });
    }

    return pages;
  }

  private generateCombinations(variables: Record<string, string[]>, maxCombinations: number): string[][] {
    const keys = Object.keys(variables);
    const values = keys.map(key => variables[key]);
    
    const combinations: string[][] = [];
    const totalPossible = values.reduce((acc, arr) => acc * arr.length, 1);
    const limit = Math.min(maxCombinations, totalPossible);

    function generateRecursive(current: string[], depth: number) {
      if (combinations.length >= limit) return;
      
      if (depth === keys.length) {
        combinations.push([...current]);
        return;
      }

      for (const value of values[depth]) {
        current[depth] = value;
        generateRecursive(current, depth + 1);
      }
    }

    generateRecursive(new Array(keys.length), 0);
    return combinations;
  }

  private interpolateString(template: string, variables: Record<string, string>): string {
    return template.replace(/\{(\w+)\}/g, (match, key) => {
      return variables[key] || match;
    });
  }

  private generatePrimaryKeyword(variables: Record<string, string>): string {
    // Generate a primary keyword based on the variables
    const values = Object.values(variables);
    return `send file from ${values[0]} to ${values[1]}`.toLowerCase();
  }

  getAllGeneratedPages(): GeneratedPageData[] {
    const allPages: GeneratedPageData[] = [];
    
    for (const generatorName of Object.keys(this.generators)) {
      try {
        const pages = this.generatePages(generatorName);
        allPages.push(...pages);
      } catch (error) {
        console.error(`Error generating pages for ${generatorName}:`, error);
      }
    }

    return allPages;
  }
}

// Utility functions for programmatic SEO
export function createProgrammaticMetadata(
  pageData: GeneratedPageData,
  baseUrl: string = 'https://quickshare.app'
): {
  title: string;
  description: string;
  canonical: string;
  keywords: string[];
} {
  return {
    title: pageData.title,
    description: pageData.description,
    canonical: `${baseUrl}/${pageData.slug}`,
    keywords: [
      pageData.primaryKeyword,
      ...Object.values(pageData.variables),
      'file transfer',
      'p2p sharing',
    ],
  };
}

export function validateProgrammaticPage(pageData: GeneratedPageData): boolean {
  return !!(
    pageData.slug &&
    pageData.title &&
    pageData.description &&
    pageData.primaryKeyword &&
    pageData.title.length <= 60 &&
    pageData.description.length <= 160
  );
}

// Enhanced programmatic SEO utilities
export function generateAllSEOPages(): GeneratedPage[] {
  const pages = [];

  // Generate device transfer pages
  const deviceTransferPages = defaultPageGenerator.generatePages({
    templateName: 'device-transfer',
    urlPattern: 'blog/how-to/send-file-from-{device1}-to-{device2}',
    includeStructuredData: true,
  });
  pages.push(...deviceTransferPages);

  // Generate comparison pages
  const comparisonPages = defaultPageGenerator.generatePages({
    templateName: 'comparison',
    urlPattern: 'compare/{service}-alternative',
    includeStructuredData: true,
  });
  pages.push(...comparisonPages);

  return pages;
}

export function validateAllSEOPages() {
  const pages = generateAllSEOPages();
  return defaultPageGenerator.validatePages(pages);
}

export function getSEOPageBySlug(slug: string) {
  const allPages = generateAllSEOPages();
  return allPages.find(page => page.slug === slug);
}

export function getTemplateStats() {
  return {
    deviceTransfer: defaultTemplateEngine.getTemplateStats('device-transfer'),
    comparison: defaultTemplateEngine.getTemplateStats('comparison'),
  };
}