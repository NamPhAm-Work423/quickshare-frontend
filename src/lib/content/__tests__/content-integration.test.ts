// Integration tests for content system
import { promises as fs } from 'fs';
import path from 'path';
import { parseContent, BlogPostMetadata, PageMetadata } from '../index';

describe('Content Integration', () => {
  const contentDir = path.join(process.cwd(), 'content');

  describe('Blog Posts', () => {
    it('should parse example blog post correctly', async () => {
      const postPath = path.join(contentDir, 'blog/posts/example-post.md');
      
      try {
        const content = await fs.readFile(postPath, 'utf-8');
        const parsed = parseContent<BlogPostMetadata>(content);

        expect(parsed.metadata.title).toBe('What is P2P File Transfer? Complete Guide');
        expect(parsed.metadata.slug).toBe('what-is-p2p-file-transfer');
        expect(parsed.metadata.author).toBe('QuickShare Team');
        expect(parsed.metadata.tags).toContain('p2p');
        expect(parsed.metadata.primaryKeyword).toBe('p2p file transfer');
        expect(parsed.metadata.searchIntent).toBe('informational');
        expect(parsed.content).toContain('# What is P2P File Transfer?');
        expect(parsed.wordCount).toBeGreaterThan(0);
        expect(parsed.readingTime).toBeGreaterThan(0);
        expect(parsed.excerpt).toBeDefined();
      } catch (error) {
        // If file doesn't exist, skip test
        if ((error as any).code === 'ENOENT') {
          console.warn('Example blog post not found, skipping test');
          return;
        }
        throw error;
      }
    });

    it('should parse WebRTC security blog post correctly', async () => {
      const postPath = path.join(contentDir, 'blog/posts/webrtc-security-explained.md');
      
      try {
        const content = await fs.readFile(postPath, 'utf-8');
        const parsed = parseContent<BlogPostMetadata>(content);

        expect(parsed.metadata.title).toBe('WebRTC Security Explained: How P2P File Transfer Stays Safe');
        expect(parsed.metadata.slug).toBe('webrtc-security-explained');
        expect(parsed.metadata.primaryKeyword).toBe('webrtc security');
        expect(parsed.metadata.tags).toContain('webrtc');
        expect(parsed.metadata.tags).toContain('security');
        expect(parsed.content).toContain('# WebRTC Security Explained');
      } catch (error) {
        if ((error as any).code === 'ENOENT') {
          console.warn('WebRTC security post not found, skipping test');
          return;
        }
        throw error;
      }
    });
  });

  describe('Static Pages', () => {
    it('should parse about page correctly', async () => {
      const pagePath = path.join(contentDir, 'pages/about.md');
      
      try {
        const content = await fs.readFile(pagePath, 'utf-8');
        const parsed = parseContent<PageMetadata>(content);

        expect(parsed.metadata.title).toBe('About QuickShare - Secure P2P File Sharing');
        expect(parsed.metadata.slug).toBe('about');
        expect(parsed.metadata.primaryKeyword).toBe('secure file sharing');
        expect(parsed.metadata.searchIntent).toBe('informational');
        expect(parsed.content).toContain('# About QuickShare');
      } catch (error) {
        if ((error as any).code === 'ENOENT') {
          console.warn('About page not found, skipping test');
          return;
        }
        throw error;
      }
    });

    it('should parse privacy page correctly', async () => {
      const pagePath = path.join(contentDir, 'pages/privacy.md');
      
      try {
        const content = await fs.readFile(pagePath, 'utf-8');
        const parsed = parseContent<PageMetadata>(content);

        expect(parsed.metadata.title).toBe('Privacy Policy - Your Data, Your Control');
        expect(parsed.metadata.slug).toBe('privacy');
        expect(parsed.metadata.primaryKeyword).toBe('file sharing privacy');
        expect(parsed.content).toContain('# Privacy Policy');
      } catch (error) {
        if ((error as any).code === 'ENOENT') {
          console.warn('Privacy page not found, skipping test');
          return;
        }
        throw error;
      }
    });

    it('should parse security page correctly', async () => {
      const pagePath = path.join(contentDir, 'pages/security.md');
      
      try {
        const content = await fs.readFile(pagePath, 'utf-8');
        const parsed = parseContent<PageMetadata>(content);

        expect(parsed.metadata.title).toBe('Security & Privacy - How QuickShare Protects Your Files');
        expect(parsed.metadata.slug).toBe('security');
        expect(parsed.metadata.primaryKeyword).toBe('secure file sharing');
        expect(parsed.content).toContain('# Security & Privacy');
      } catch (error) {
        if ((error as any).code === 'ENOENT') {
          console.warn('Security page not found, skipping test');
          return;
        }
        throw error;
      }
    });
  });

  describe('Blog Metadata', () => {
    it('should parse blog metadata.json correctly', async () => {
      const metadataPath = path.join(contentDir, 'blog/metadata.json');
      
      try {
        const content = await fs.readFile(metadataPath, 'utf-8');
        const metadata = JSON.parse(content);

        expect(metadata.title).toBe('QuickShare Blog - P2P File Sharing Insights');
        expect(metadata.categories).toBeInstanceOf(Array);
        expect(metadata.tags).toBeInstanceOf(Array);
        expect(metadata.authors).toBeInstanceOf(Array);
        
        // Check categories structure
        const categories = metadata.categories;
        expect(categories.length).toBeGreaterThan(0);
        expect(categories[0]).toHaveProperty('slug');
        expect(categories[0]).toHaveProperty('name');
        expect(categories[0]).toHaveProperty('description');
        
        // Check authors structure
        const authors = metadata.authors;
        expect(authors.length).toBeGreaterThan(0);
        expect(authors[0]).toHaveProperty('name');
        expect(authors[0]).toHaveProperty('bio');
      } catch (error) {
        if ((error as any).code === 'ENOENT') {
          console.warn('Blog metadata not found, skipping test');
          return;
        }
        throw error;
      }
    });
  });
});