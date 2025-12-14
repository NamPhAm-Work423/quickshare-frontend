// Blog content management utilities
import { promises as fs } from 'fs';
import path from 'path';
import { BlogPost, BlogPostMetadata, BlogMetadata, ContentQuery, BlogCategory, BlogTag } from './types';
import { parseContent, validateBlogPostMetadata } from './parser';

const CONTENT_DIR = path.join(process.cwd(), 'content');
const BLOG_DIR = path.join(CONTENT_DIR, 'blog');
const POSTS_DIR = path.join(BLOG_DIR, 'posts');

export class BlogManager {
  private static instance: BlogManager;
  private blogMetadata: BlogMetadata | null = null;

  static getInstance(): BlogManager {
    if (!BlogManager.instance) {
      BlogManager.instance = new BlogManager();
    }
    return BlogManager.instance;
  }

  async getBlogMetadata(): Promise<BlogMetadata> {
    if (this.blogMetadata) {
      return this.blogMetadata;
    }

    try {
      const metadataPath = path.join(BLOG_DIR, 'metadata.json');
      const metadataContent = await fs.readFile(metadataPath, 'utf-8');
      this.blogMetadata = JSON.parse(metadataContent);
      return this.blogMetadata!;
    } catch (error) {
      console.error('Error loading blog metadata:', error);
      // Return default metadata
      return {
        title: 'Blog',
        description: 'Latest articles and insights',
        categories: [],
        tags: [],
        authors: [],
      };
    }
  }

  async getAllPosts(): Promise<BlogPost[]> {
    try {
      const files = await fs.readdir(POSTS_DIR);
      const markdownFiles = files.filter(file => file.endsWith('.md'));
      
      const posts: BlogPost[] = [];
      
      for (const file of markdownFiles) {
        try {
          const post = await this.getPostByFilename(file);
          if (post) {
            posts.push(post);
          }
        } catch (error) {
          console.error(`Error parsing post ${file}:`, error);
        }
      }

      // Sort by published date (newest first)
      return posts.sort((a, b) => 
        new Date(b.metadata.publishedAt).getTime() - new Date(a.metadata.publishedAt).getTime()
      );
    } catch (error) {
      console.error('Error reading blog posts:', error);
      return [];
    }
  }

  async getPostBySlug(slug: string): Promise<BlogPost | null> {
    try {
      const posts = await this.getAllPosts();
      return posts.find(post => post.metadata.slug === slug) || null;
    } catch (error) {
      console.error(`Error getting post by slug ${slug}:`, error);
      return null;
    }
  }

  private async getPostByFilename(filename: string): Promise<BlogPost | null> {
    try {
      const filePath = path.join(POSTS_DIR, filename);
      const content = await fs.readFile(filePath, 'utf-8');
      
      const parsed = parseContent<BlogPostMetadata>(content, {
        includeExcerpt: true,
        calculateReadingTime: true,
      });

      if (!validateBlogPostMetadata(parsed.metadata)) {
        console.error(`Invalid metadata in ${filename}`);
        return null;
      }

      return parsed as BlogPost;
    } catch (error) {
      console.error(`Error reading post ${filename}:`, error);
      return null;
    }
  }

  async getPostsByCategory(categorySlug: string): Promise<BlogPost[]> {
    const posts = await this.getAllPosts();
    const metadata = await this.getBlogMetadata();
    
    const category = metadata.categories.find(cat => cat.slug === categorySlug);
    if (!category) {
      return [];
    }

    // Filter posts that have tags matching the category
    return posts.filter(post => 
      post.metadata.tags.some(tag => 
        tag.toLowerCase().includes(categorySlug.toLowerCase())
      )
    );
  }

  async getPostsByTag(tag: string): Promise<BlogPost[]> {
    const posts = await this.getAllPosts();
    return posts.filter(post => 
      post.metadata.tags.includes(tag.toLowerCase())
    );
  }

  async getPostsByAuthor(author: string): Promise<BlogPost[]> {
    const posts = await this.getAllPosts();
    return posts.filter(post => 
      post.metadata.author.toLowerCase() === author.toLowerCase()
    );
  }

  async queryPosts(query: ContentQuery): Promise<{
    posts: BlogPost[];
    total: number;
    hasMore: boolean;
  }> {
    let posts = await this.getAllPosts();

    // Apply filters
    if (query.category) {
      posts = await this.getPostsByCategory(query.category);
    }

    if (query.tag) {
      posts = posts.filter(post => 
        post.metadata.tags.includes(query.tag!.toLowerCase())
      );
    }

    if (query.author) {
      posts = posts.filter(post => 
        post.metadata.author.toLowerCase() === query.author!.toLowerCase()
      );
    }

    // Apply sorting
    if (query.sortBy) {
      posts.sort((a, b) => {
        let aValue: any, bValue: any;
        
        switch (query.sortBy) {
          case 'publishedAt':
            aValue = new Date(a.metadata.publishedAt).getTime();
            bValue = new Date(b.metadata.publishedAt).getTime();
            break;
          case 'updatedAt':
            aValue = new Date(a.metadata.updatedAt || a.metadata.publishedAt).getTime();
            bValue = new Date(b.metadata.updatedAt || b.metadata.publishedAt).getTime();
            break;
          case 'title':
            aValue = a.metadata.title.toLowerCase();
            bValue = b.metadata.title.toLowerCase();
            break;
          default:
            return 0;
        }

        if (query.sortOrder === 'asc') {
          return aValue > bValue ? 1 : -1;
        } else {
          return aValue < bValue ? 1 : -1;
        }
      });
    }

    const total = posts.length;
    const offset = query.offset || 0;
    const limit = query.limit || total;

    const paginatedPosts = posts.slice(offset, offset + limit);
    const hasMore = offset + limit < total;

    return {
      posts: paginatedPosts,
      total,
      hasMore,
    };
  }

  async getAllTags(): Promise<BlogTag[]> {
    const posts = await this.getAllPosts();
    const tagCounts: Record<string, number> = {};

    posts.forEach(post => {
      post.metadata.tags.forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });

    return Object.entries(tagCounts)
      .map(([tag, count]) => ({
        slug: tag,
        name: tag.charAt(0).toUpperCase() + tag.slice(1),
        count,
      }))
      .sort((a, b) => b.count - a.count);
  }

  async getRecentPosts(limit: number = 5): Promise<BlogPost[]> {
    const posts = await this.getAllPosts();
    return posts.slice(0, limit);
  }

  async getRelatedPosts(post: BlogPost, limit: number = 3): Promise<BlogPost[]> {
    const allPosts = await this.getAllPosts();
    
    // Filter out the current post
    const otherPosts = allPosts.filter(p => p.metadata.slug !== post.metadata.slug);
    
    // Score posts based on shared tags
    const scoredPosts = otherPosts.map(otherPost => {
      const sharedTags = post.metadata.tags.filter(tag => 
        otherPost.metadata.tags.includes(tag)
      );
      
      return {
        post: otherPost,
        score: sharedTags.length,
      };
    });

    // Sort by score and return top posts
    return scoredPosts
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(item => item.post);
  }
}

// Convenience functions
export const blogManager = BlogManager.getInstance();

export async function getAllBlogPosts(): Promise<BlogPost[]> {
  return blogManager.getAllPosts();
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  return blogManager.getPostBySlug(slug);
}

export async function getBlogMetadata(): Promise<BlogMetadata> {
  return blogManager.getBlogMetadata();
}

export async function getBlogPostsByCategory(category: string): Promise<BlogPost[]> {
  return blogManager.getPostsByCategory(category);
}

export async function getBlogPostsByTag(tag: string): Promise<BlogPost[]> {
  return blogManager.getPostsByTag(tag);
}

export async function getAllBlogTags(): Promise<BlogTag[]> {
  return blogManager.getAllTags();
}

export async function getRecentBlogPosts(limit?: number): Promise<BlogPost[]> {
  return blogManager.getRecentPosts(limit);
}

export async function getRelatedBlogPosts(post: BlogPost, limit?: number): Promise<BlogPost[]> {
  return blogManager.getRelatedPosts(post, limit);
}