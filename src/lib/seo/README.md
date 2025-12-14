# Programmatic SEO System

This directory contains a comprehensive programmatic SEO system for generating SEO-optimized pages at scale.

## Components

### 1. Template Engine (`template-engine.ts`)
- Manages SEO templates with variable substitution
- Validates template syntax and constraints
- Generates all possible combinations within limits

### 2. Page Generator (`page-generator.ts`)
- Generates complete SEO pages from templates
- Creates structured data and metadata
- Validates generated pages for SEO compliance

### 3. Programmatic Core (`programmatic.ts`)
- Legacy programmatic SEO implementation
- Integration utilities for the new system
- Backward compatibility functions

### 4. Metadata System (`metadata.ts`)
- Central SEO configuration
- Page-specific metadata definitions
- Search intent mapping

### 5. Structured Data (`structured-data.ts`)
- JSON-LD schema generators
- Validation utilities
- Common structured data patterns

## Usage

### Basic Page Generation

```typescript
import { defaultPageGenerator } from './page-generator';

// Generate pages from a template
const pages = defaultPageGenerator.generatePages({
  templateName: 'device-transfer',
  urlPattern: 'blog/how-to/send-file-from-{device1}-to-{device2}',
  includeStructuredData: true,
});

console.log(`Generated ${pages.length} pages`);
```

### Creating Custom Templates

```typescript
import { defaultTemplateEngine } from './template-engine';

// Register a new template
defaultTemplateEngine.registerTemplate({
  name: 'my-template',
  titleTemplate: 'How to {action} with {tool} - QuickShare',
  descriptionTemplate: 'Learn how to {action} using {tool}. Complete guide with examples.',
  variables: {
    action: {
      name: 'action',
      values: ['share files', 'transfer data', 'send documents'],
    },
    tool: {
      name: 'tool',
      values: ['P2P', 'WebRTC', 'browser'],
    },
  },
  maxCombinations: 10,
});
```

### Validation

```typescript
import { validateAllSEOPages } from './programmatic';

const validation = validateAllSEOPages();
if (!validation.isValid) {
  console.error('SEO validation failed:', validation.errors);
}
```

## CLI Usage

```bash
# Generate all pages
npx tsx src/lib/seo/cli.ts generate

# Validate pages
npx tsx src/lib/seo/cli.ts validate

# Show statistics
npx tsx src/lib/seo/cli.ts stats

# List templates
npx tsx src/lib/seo/cli.ts templates
```

## Testing

The system includes comprehensive property-based tests:

```bash
# Run SEO metadata tests
npm test -- --testPathPatterns="metadata.test.ts"

# Run canonical URL tests
npm test -- --testPathPatterns="canonical-url.test.ts"
```

## Key Features

1. **Template-Based Generation**: Create pages using reusable templates with variable substitution
2. **SEO Optimization**: Automatic title/description length validation, keyword generation
3. **Structured Data**: Automatic JSON-LD generation for better search visibility
4. **Validation**: Comprehensive validation for SEO compliance
5. **Property-Based Testing**: Ensures correctness across all generated combinations
6. **CLI Tools**: Command-line utilities for development and debugging

## Requirements Satisfied

- **Requirements 2.2**: Centralized metadata configuration system ✓
- **Requirements 3.1**: Complete Open Graph and Twitter Card metadata ✓
- **Requirements 3.3**: Canonical URLs for all pages ✓

The system generates SEO-optimized pages programmatically while maintaining high quality standards and search engine best practices.