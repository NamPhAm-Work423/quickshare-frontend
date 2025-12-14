import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { 
  MetaTags, 
  StructuredData, 
  Breadcrumbs, 
  ProgrammaticSEO,
  generateMetadata
} from '../index';

// Mock Next.js Head component
jest.mock('next/head', () => {
  return function Head({ children }: { children: React.ReactNode }) {
    return <div data-testid="head">{children}</div>;
  };
});

describe('SEO Components', () => {
  describe('MetaTags', () => {
    it('should render meta tags with CTR optimization', () => {
      const props = {
        title: 'Test Page',
        description: 'Test description',
        primaryKeyword: 'test keyword',
        secondaryKeywords: ['secondary', 'keywords'],
        canonical: 'https://example.com/test',
        ogImage: '/test-image.jpg'
      };

      render(<MetaTags {...props} />);
      
      // Check if title is rendered
      expect(document.title).toBe('test keyword - Test Page');
    });

    it('should generate Next.js metadata correctly', () => {
      const props = {
        title: 'Test Page',
        description: 'Test description',
        primaryKeyword: 'test keyword',
        secondaryKeywords: ['secondary', 'keywords'],
        canonical: 'https://example.com/test'
      };

      const metadata = generateMetadata(props);
      
      expect(metadata.title).toBe('test keyword - Test Page');
      expect(metadata.description).toBe('test keyword: Test description');
      expect(metadata.keywords).toEqual(['test keyword', 'secondary', 'keywords']);
    });
  });

  describe('StructuredData', () => {
    it('should render JSON-LD script tag', () => {
      const testData = {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'Test Organization'
      };

      render(<StructuredData data={testData} type="Organization" />);
      
      const script = document.querySelector('script[type="application/ld+json"]');
      expect(script).toBeInTheDocument();
      expect(script?.textContent).toContain('Test Organization');
    });

    it('should validate structured data when requested', () => {
      const invalidData = { name: 'Test' }; // Missing @context and @type
      
      render(<StructuredData data={invalidData} type="Organization" validate={true} />);
      
      // Should not render invalid data
      const script = document.querySelector('script[type="application/ld+json"]');
      expect(script).not.toBeInTheDocument();
    });
  });

  describe('Breadcrumbs', () => {
    it('should render breadcrumb navigation', () => {
      const items = [
        { label: 'Home', href: '/' },
        { label: 'Category', href: '/category' },
        { label: 'Current Page', current: true }
      ];

      render(<Breadcrumbs items={items} />);
      
      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('Category')).toBeInTheDocument();
      expect(screen.getByText('Current Page')).toBeInTheDocument();
    });

    it('should generate structured data for breadcrumbs', () => {
      const items = [
        { label: 'Home', href: '/' },
        { label: 'Current Page', current: true }
      ];

      render(<Breadcrumbs items={items} structuredData={true} />);
      
      const script = document.querySelector('script[type="application/ld+json"]');
      expect(script).toBeInTheDocument();
      expect(script?.textContent).toContain('BreadcrumbList');
    });
  });

  describe('ProgrammaticSEO', () => {
    it('should process template with variables', () => {
      const template = 'Send files from {device1} to {device2}';
      const variables = { device1: 'iPhone', device2: 'PC' };

      render(<ProgrammaticSEO template={template} variables={variables} />);
      
      expect(screen.getByText('Send files from iPhone to PC')).toBeInTheDocument();
    });

    it('should handle missing variables gracefully', () => {
      const template = 'Send files from {device1} to {device2}';
      const variables = { device1: 'iPhone' }; // Missing device2

      render(<ProgrammaticSEO template={template} variables={variables} fallbackContent="Fallback" />);
      
      // Should still render with missing variable removed
      expect(screen.getByText('Send files from iPhone to')).toBeInTheDocument();
    });

    it('should apply max length constraint', () => {
      const template = 'This is a very long template that should be truncated';
      const variables = {};

      render(<ProgrammaticSEO template={template} variables={variables} maxLength={20} />);
      
      expect(screen.getByText('This is a very lo...')).toBeInTheDocument();
    });
  });
});