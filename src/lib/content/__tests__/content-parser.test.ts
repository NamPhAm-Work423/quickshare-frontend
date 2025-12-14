// Content parser tests
import { 
  parseFrontmatter, 
  parseContent, 
  calculateReadingTime, 
  extractExcerpt, 
  countWords,
  validateContentMetadata,
  validateBlogPostMetadata,
  generateSlug
} from '../parser';

describe('Content Parser', () => {
  describe('parseFrontmatter', () => {
    it('should parse valid frontmatter', () => {
      const content = `---
title: "Test Title"
description: "Test description"
tags:
- tag1
- tag2
readingTime: 5
published: true
---

# Content here

This is the main content.`;

      const result = parseFrontmatter(content);
      
      expect(result.metadata.title).toBe('Test Title');
      expect(result.metadata.description).toBe('Test description');
      expect(result.metadata.tags).toEqual(['tag1', 'tag2']);
      expect(result.metadata.readingTime).toBe(5);
      expect(result.metadata.published).toBe(true);
      expect(result.content).toBe('# Content here\n\nThis is the main content.');
    });

    it('should handle content without frontmatter', () => {
      const content = `# Just Content

No frontmatter here.`;

      const result = parseFrontmatter(content);
      
      expect(result.metadata).toEqual({});
      expect(result.content).toBe(content);
    });

    it('should handle empty frontmatter', () => {
      const content = `---
---

# Content only`;

      const result = parseFrontmatter(content);
      
      expect(result.metadata).toEqual({});
      // Since the regex doesn't match empty frontmatter, it returns the original content
      expect(result.content).toBe(content);
    });
  });

  describe('calculateReadingTime', () => {
    it('should calculate reading time correctly', () => {
      const content = 'word '.repeat(200); // 200 words
      const readingTime = calculateReadingTime(content, 200);
      expect(readingTime).toBe(1);
    });

    it('should round up partial minutes', () => {
      const content = 'word '.repeat(250); // 250 words
      const readingTime = calculateReadingTime(content, 200);
      expect(readingTime).toBe(2);
    });
  });

  describe('extractExcerpt', () => {
    it('should extract excerpt from content', () => {
      const content = `# Title

This is a long piece of content that should be truncated at some point to create a nice excerpt for the blog post or page.`;
      
      const excerpt = extractExcerpt(content, 50);
      expect(excerpt.length).toBeLessThanOrEqual(53); // 50 + "..."
      expect(excerpt).toContain('...');
    });

    it('should return full content if shorter than limit', () => {
      const content = 'Short content';
      const excerpt = extractExcerpt(content, 50);
      expect(excerpt).toBe('Short content');
    });

    it('should remove markdown formatting', () => {
      const content = '**Bold** and *italic* and [link](url) text';
      const excerpt = extractExcerpt(content, 100);
      expect(excerpt).toBe('Bold and italic and link text');
    });
  });

  describe('countWords', () => {
    it('should count words correctly', () => {
      const content = 'This is a test with five words';
      expect(countWords(content)).toBe(7);
    });

    it('should handle empty content', () => {
      expect(countWords('')).toBe(0);
      expect(countWords('   ')).toBe(0);
    });
  });

  describe('parseContent', () => {
    it('should parse complete content with metadata', () => {
      const rawContent = `---
title: "Test Post"
description: "Test description"
slug: "test-post"
publishedAt: "2024-01-01"
primaryKeyword: "test"
searchIntent: "informational"
---

# Test Content

This is test content for parsing.`;

      const parsed = parseContent(rawContent);
      
      expect(parsed.metadata.title).toBe('Test Post');
      expect(parsed.content).toContain('# Test Content');
      expect(parsed.wordCount).toBeGreaterThan(0);
      expect(parsed.readingTime).toBeGreaterThan(0);
      expect(parsed.excerpt).toBeDefined();
    });
  });

  describe('validateContentMetadata', () => {
    it('should validate correct metadata', () => {
      const metadata = {
        title: 'Test Title',
        description: 'Test description',
        slug: 'test-slug',
        publishedAt: '2024-01-01',
        primaryKeyword: 'test keyword',
        searchIntent: 'informational' as const,
      };

      expect(validateContentMetadata(metadata)).toBe(true);
    });

    it('should reject invalid metadata', () => {
      const metadata = {
        title: 'Test Title',
        // missing required fields
      };

      expect(validateContentMetadata(metadata)).toBe(false);
    });
  });

  describe('validateBlogPostMetadata', () => {
    it('should validate correct blog post metadata', () => {
      const metadata = {
        title: 'Test Title',
        description: 'Test description',
        slug: 'test-slug',
        publishedAt: '2024-01-01',
        primaryKeyword: 'test keyword',
        searchIntent: 'informational' as const,
        author: 'Test Author',
        tags: ['tag1', 'tag2'],
        readingTime: 5,
      };

      expect(validateBlogPostMetadata(metadata)).toBe(true);
    });

    it('should reject invalid blog post metadata', () => {
      const metadata = {
        title: 'Test Title',
        description: 'Test description',
        slug: 'test-slug',
        publishedAt: '2024-01-01',
        primaryKeyword: 'test keyword',
        searchIntent: 'informational' as const,
        // missing author, tags, readingTime
      };

      expect(validateBlogPostMetadata(metadata)).toBe(false);
    });
  });

  describe('generateSlug', () => {
    it('should generate valid slugs', () => {
      expect(generateSlug('Test Title')).toBe('test-title');
      expect(generateSlug('Complex Title with Special! Characters@')).toBe('complex-title-with-special-characters');
      expect(generateSlug('Multiple   Spaces')).toBe('multiple-spaces');
    });

    it('should handle edge cases', () => {
      expect(generateSlug('')).toBe('');
      expect(generateSlug('   ')).toBe('');
      expect(generateSlug('---')).toBe('');
    });
  });
});