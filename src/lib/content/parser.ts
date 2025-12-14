// Content parsing utilities
import { ParsedContent, ContentMetadata, BlogPostMetadata, ParseOptions } from './types';

// Simple frontmatter parser (avoiding external dependencies)
export function parseFrontmatter(content: string): {
  metadata: Record<string, any>;
  content: string;
} {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n?([\s\S]*)$/;
  const match = content.match(frontmatterRegex);

  if (!match) {
    return {
      metadata: {},
      content: content,
    };
  }

  const [, frontmatterStr, bodyContent] = match;
  
  // Handle case where frontmatter is empty but still present
  if (!frontmatterStr.trim()) {
    return {
      metadata: {},
      content: bodyContent.trim(),
    };
  }
  const metadata: Record<string, any> = {};

  // Parse YAML-like frontmatter
  const lines = frontmatterStr.split('\n');
  let currentKey = '';
  let inArray = false;

  for (const line of lines) {
    const trimmedLine = line.trim();
    if (!trimmedLine) continue;

    if (trimmedLine.startsWith('- ')) {
      // Array item
      if (inArray && currentKey) {
        if (!Array.isArray(metadata[currentKey])) {
          metadata[currentKey] = [];
        }
        metadata[currentKey].push(trimmedLine.substring(2).replace(/['"]/g, ''));
      }
    } else if (trimmedLine.includes(':')) {
      // Key-value pair
      const colonIndex = trimmedLine.indexOf(':');
      const key = trimmedLine.substring(0, colonIndex).trim();
      let value = trimmedLine.substring(colonIndex + 1).trim();

      // Remove quotes
      value = value.replace(/^["']|["']$/g, '');

      if (value === '') {
        // Might be start of array
        currentKey = key;
        inArray = true;
        metadata[key] = [];
      } else {
        // Regular key-value
        currentKey = key;
        inArray = false;
        
        // Try to parse as number or boolean
        if (value === 'true') {
          metadata[key] = true;
        } else if (value === 'false') {
          metadata[key] = false;
        } else if (!isNaN(Number(value)) && value !== '') {
          metadata[key] = Number(value);
        } else {
          metadata[key] = value;
        }
      }
    }
  }

  return {
    metadata,
    content: bodyContent.trim(),
  };
}

export function calculateReadingTime(content: string, wordsPerMinute: number = 200): number {
  const words = content.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

export function extractExcerpt(content: string, length: number = 160): string {
  // Remove markdown formatting for excerpt
  const plainText = content
    .replace(/#{1,6}\s+/g, '') // Remove headers
    .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
    .replace(/\*(.*?)\*/g, '$1') // Remove italic
    .replace(/\[(.*?)\]\(.*?\)/g, '$1') // Remove links, keep text
    .replace(/`(.*?)`/g, '$1') // Remove inline code
    .replace(/\n+/g, ' ') // Replace newlines with spaces
    .trim();

  if (plainText.length <= length) {
    return plainText;
  }

  // Find the last complete word within the length limit
  const truncated = plainText.substring(0, length);
  const lastSpaceIndex = truncated.lastIndexOf(' ');
  
  if (lastSpaceIndex > 0) {
    return truncated.substring(0, lastSpaceIndex) + '...';
  }
  
  return truncated + '...';
}

export function countWords(content: string): number {
  return content.trim().split(/\s+/).filter(word => word.length > 0).length;
}

export function parseContent<T extends ContentMetadata = ContentMetadata>(
  rawContent: string,
  options: ParseOptions = {}
): ParsedContent<T> {
  const {
    includeExcerpt = true,
    excerptLength = 160,
    calculateReadingTime: calcReadingTime = true,
    wordsPerMinute = 200,
  } = options;

  const { metadata, content } = parseFrontmatter(rawContent);
  const wordCount = countWords(content);

  const parsed: ParsedContent<T> = {
    metadata: metadata as T,
    content,
    wordCount,
    readingTime: calcReadingTime ? calculateReadingTime(content, wordsPerMinute) : 0,
  };

  if (includeExcerpt) {
    parsed.excerpt = metadata.excerpt || extractExcerpt(content, excerptLength);
  }

  return parsed;
}

// Validation functions
export function validateContentMetadata(metadata: any): metadata is ContentMetadata {
  return (
    typeof metadata.title === 'string' &&
    typeof metadata.description === 'string' &&
    typeof metadata.slug === 'string' &&
    typeof metadata.publishedAt === 'string' &&
    typeof metadata.primaryKeyword === 'string' &&
    ['informational', 'navigational', 'transactional', 'commercial'].includes(metadata.searchIntent)
  );
}

export function validateBlogPostMetadata(metadata: any): metadata is BlogPostMetadata {
  return (
    validateContentMetadata(metadata) &&
    typeof (metadata as BlogPostMetadata).author === 'string' &&
    Array.isArray((metadata as BlogPostMetadata).tags) &&
    typeof (metadata as BlogPostMetadata).readingTime === 'number'
  );
}

// Content transformation utilities
export function transformMarkdownToHtml(markdown: string): string {
  // Basic markdown to HTML transformation
  // In a real implementation, you might use a library like marked or remark
  return markdown
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
    .replace(/\*(.*)\*/gim, '<em>$1</em>')
    .replace(/!\[([^\]]*)\]\(([^\)]*)\)/gim, '<img alt="$1" src="$2" />')
    .replace(/\[([^\]]*)\]\(([^\)]*)\)/gim, '<a href="$2">$1</a>')
    .replace(/`([^`]*)`/gim, '<code>$1</code>')
    .replace(/\n\n/gim, '</p><p>')
    .replace(/^(.*)$/gim, '<p>$1</p>')
    .replace(/<p><\/p>/gim, '')
    .replace(/<p>(<h[1-6]>.*<\/h[1-6]>)<\/p>/gim, '$1')
    .replace(/<p>(<img.*\/>)<\/p>/gim, '$1');
}

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
}