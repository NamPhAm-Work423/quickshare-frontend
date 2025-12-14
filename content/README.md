# Content Management System

This directory contains the content management system for the QuickShare application, organized for SEO optimization and maintainability.

## Directory Structure

```
content/
├── blog/
│   ├── posts/           # Blog post markdown files
│   └── metadata.json    # Blog configuration and metadata
├── pages/               # Static page markdown files
└── README.md           # This file
```

## Blog Posts (`/blog/posts/`)

Blog posts are stored as markdown files with YAML frontmatter. Each post should include:

### Required Frontmatter Fields

```yaml
---
title: "Post Title (SEO Optimized)"
description: "Meta description for search engines (max 160 chars)"
slug: "url-friendly-slug"
publishedAt: "2025-12-15"
author: "Author Name"
tags: ["tag1", "tag2", "tag3"]
readingTime: 5
primaryKeyword: "main seo keyword"
secondaryKeywords: ["supporting", "keywords"]
searchIntent: "informational"  # informational|navigational|transactional|commercial
---
```

### Optional Frontmatter Fields

```yaml
updatedAt: "2025-12-15"
ogImage: "/blog/post-image.jpg"
excerpt: "Custom excerpt override"
noIndex: false
```

### Example Blog Post

```markdown
---
title: "What is P2P File Transfer? Complete Guide"
description: "Learn how peer-to-peer file transfer works, its benefits, and why it's more secure than traditional cloud storage methods."
slug: "what-is-p2p-file-transfer"
publishedAt: "2025-12-15"
author: "QuickShare Team"
tags: ["p2p", "file-transfer", "webrtc"]
readingTime: 5
primaryKeyword: "p2p file transfer"
secondaryKeywords: ["peer to peer file sharing", "webrtc file transfer"]
searchIntent: "informational"
---

# What is P2P File Transfer?

Your content here...
```

## Static Pages (`/pages/`)

Static pages follow the same markdown + frontmatter structure but with simpler metadata:

### Required Frontmatter Fields

```yaml
---
title: "Page Title"
description: "Page description for SEO"
slug: "page-slug"
publishedAt: "2025-12-15"
primaryKeyword: "main keyword"
searchIntent: "informational"
---
```

### Example Static Page

```markdown
---
title: "About QuickShare - Secure P2P File Sharing"
description: "Learn about QuickShare's mission to provide secure, private file sharing without accounts or cloud storage."
slug: "about"
publishedAt: "2025-12-15"
primaryKeyword: "secure file sharing"
searchIntent: "informational"
---

# About QuickShare

Your content here...
```

## Blog Metadata (`/blog/metadata.json`)

The blog metadata file configures blog-wide settings:

```json
{
  "title": "Blog Title",
  "description": "Blog description",
  "categories": [
    {
      "slug": "category-slug",
      "name": "Category Name",
      "description": "Category description"
    }
  ],
  "tags": ["tag1", "tag2"],
  "authors": [
    {
      "name": "Author Name",
      "bio": "Author bio",
      "avatar": "/authors/author.jpg"
    }
  ]
}
```

## Content Management API

The content system provides a programmatic API for accessing content:

### Blog Functions

```typescript
import { 
  getAllBlogPosts,
  getBlogPostBySlug,
  getBlogPostsByCategory,
  getBlogPostsByTag,
  getRecentBlogPosts,
  getRelatedBlogPosts
} from '@/lib/content';

// Get all blog posts
const posts = await getAllBlogPosts();

// Get specific post
const post = await getBlogPostBySlug('what-is-p2p-file-transfer');

// Get posts by category
const categoryPosts = await getBlogPostsByCategory('p2p-file-sharing');

// Get recent posts
const recentPosts = await getRecentBlogPosts(5);
```

### Page Functions

```typescript
import {
  getAllPages,
  getPageBySlug,
  searchPages,
  getPagesByKeyword
} from '@/lib/content';

// Get all static pages
const pages = await getAllPages();

// Get specific page
const aboutPage = await getPageBySlug('about');

// Search pages
const searchResults = await searchPages('privacy');
```

### Content Parsing

```typescript
import { parseContent } from '@/lib/content';

// Parse markdown content with frontmatter
const rawContent = `---
title: "Example Post"
---
# Content here`;

const parsed = parseContent(rawContent);
console.log(parsed.metadata.title); // "Example Post"
console.log(parsed.content); // "# Content here"
console.log(parsed.wordCount); // Calculated word count
console.log(parsed.readingTime); // Calculated reading time
```

## SEO Optimization

### Search Intent Classification

Content is classified by search intent to optimize for different user goals:

- **Informational**: Educational content (how-to guides, explanations)
- **Navigational**: Brand/product specific searches
- **Transactional**: Action-oriented content (sign up, download)
- **Commercial**: Comparison and evaluation content

### Keyword Strategy

- **Primary Keyword**: Main target keyword for the content
- **Secondary Keywords**: Supporting keywords for broader reach
- **Long-tail Keywords**: Specific phrases for niche targeting

### Content Structure

- Use semantic HTML structure (H1 → H2 → H3)
- Include structured data markup
- Optimize meta titles and descriptions
- Use descriptive alt text for images
- Internal linking between related content

## Content Guidelines

### Writing Best Practices

1. **Clear Headlines**: Use descriptive, keyword-rich headlines
2. **Scannable Content**: Use bullet points, short paragraphs, subheadings
3. **Value-First**: Lead with the most important information
4. **Call-to-Actions**: Include relevant CTAs where appropriate
5. **Internal Links**: Link to related content within the site

### SEO Best Practices

1. **Title Tags**: Keep under 60 characters, include primary keyword
2. **Meta Descriptions**: Keep under 160 characters, compelling and descriptive
3. **URL Structure**: Use clean, descriptive slugs
4. **Image Optimization**: Use descriptive filenames and alt text
5. **Content Length**: Aim for comprehensive coverage of topics

### Technical Requirements

1. **Frontmatter Validation**: All required fields must be present
2. **Slug Format**: Use lowercase, hyphens, no special characters
3. **Date Format**: Use YYYY-MM-DD format for dates
4. **Tag Format**: Use lowercase, hyphenated tags
5. **File Naming**: Use descriptive, SEO-friendly filenames

## Development Workflow

### Adding New Blog Posts

1. Create new `.md` file in `/content/blog/posts/`
2. Add complete frontmatter with all required fields
3. Write content using markdown
4. Test locally using the content API
5. Verify SEO metadata is correct

### Adding New Pages

1. Create new `.md` file in `/content/pages/`
2. Add frontmatter with page-specific metadata
3. Write content using semantic markdown structure
4. Test page rendering and SEO metadata

### Content Updates

1. Edit existing markdown files
2. Update `updatedAt` field in frontmatter
3. Verify content parsing still works
4. Check for broken internal links

## Testing

The content system includes comprehensive tests:

```bash
# Run content parser tests
npm test -- --testPathPatterns=content-parser.test.ts

# Run integration tests
npm test -- --testPathPatterns=content-integration.test.ts

# Run all content tests
npm test -- --testPathPatterns=content
```

## Performance Considerations

- Content is parsed at build time for static generation
- Metadata is cached for improved performance
- Large content files are automatically paginated
- Images should be optimized before adding to content

## Future Enhancements

- [ ] Automated content validation
- [ ] Content scheduling system
- [ ] Multi-language support
- [ ] Content analytics integration
- [ ] Automated SEO suggestions
- [ ] Content versioning system