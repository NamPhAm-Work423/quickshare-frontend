'use client';

import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { StructuredData } from './StructuredData';
import { structuredDataGenerators } from '../../lib/seo/structured-data';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  current?: boolean;
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  structuredData?: boolean;  // Generate JSON-LD breadcrumb markup
  showHome?: boolean;        // Show home icon for first item
  separator?: React.ReactNode; // Custom separator
  className?: string;
  itemClassName?: string;
  linkClassName?: string;
  currentClassName?: string;
}

/**
 * Breadcrumbs component with JSON-LD structured data support
 * Provides navigation breadcrumbs with SEO-optimized structured data
 */
export function Breadcrumbs({
  items,
  structuredData = true,
  showHome = true,
  separator,
  className = '',
  itemClassName = '',
  linkClassName = '',
  currentClassName = ''
}: BreadcrumbsProps) {
  // Ensure we have at least one item
  if (!items || items.length === 0) {
    return null;
  }

  // Add home item if not present and showHome is true
  const breadcrumbItems = showHome && items[0]?.label !== 'Home' 
    ? [{ label: 'Home', href: '/' }, ...items]
    : items;

  // Generate structured data for breadcrumbs
  const breadcrumbStructuredData = structuredData 
    ? structuredDataGenerators.breadcrumb(
        breadcrumbItems.map(item => ({
          name: item.label,
          url: item.href
        }))
      )
    : null;

  // Default separator
  const defaultSeparator = separator || <ChevronRight className="w-4 h-4 text-gray-400" />;

  return (
    <>
      {/* Breadcrumb Navigation */}
      <nav 
        aria-label="Breadcrumb"
        className={`flex items-center space-x-1 text-sm ${className}`}
      >
        <ol className="flex items-center space-x-1">
          {breadcrumbItems.map((item, index) => {
            const isLast = index === breadcrumbItems.length - 1;
            const isCurrent = item.current || isLast;
            
            return (
              <li key={index} className={`flex items-center ${itemClassName}`}>
                {/* Separator (not for first item) */}
                {index > 0 && (
                  <span className="mx-2" aria-hidden="true">
                    {defaultSeparator}
                  </span>
                )}
                
                {/* Breadcrumb Item */}
                {item.href && !isCurrent ? (
                  <Link
                    href={item.href}
                    className={`hover:text-blue-600 transition-colors ${linkClassName}`}
                    aria-current={isCurrent ? 'page' : undefined}
                  >
                    {index === 0 && showHome ? (
                      <span className="flex items-center">
                        <Home className="w-4 h-4 mr-1" />
                        {item.label}
                      </span>
                    ) : (
                      item.label
                    )}
                  </Link>
                ) : (
                  <span 
                    className={`text-gray-500 ${isCurrent ? currentClassName : ''}`}
                    aria-current={isCurrent ? 'page' : undefined}
                  >
                    {index === 0 && showHome ? (
                      <span className="flex items-center">
                        <Home className="w-4 h-4 mr-1" />
                        {item.label}
                      </span>
                    ) : (
                      item.label
                    )}
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </nav>

      {/* JSON-LD Structured Data */}
      {breadcrumbStructuredData && (
        <StructuredData 
          data={breadcrumbStructuredData} 
          type="BreadcrumbList" 
        />
      )}
    </>
  );
}

/**
 * Generate breadcrumb items from pathname
 * Useful for automatic breadcrumb generation from URL structure
 */
export function generateBreadcrumbsFromPath(
  pathname: string,
  pathLabels?: Record<string, string>
): BreadcrumbItem[] {
  const segments = pathname.split('/').filter(Boolean);
  const breadcrumbs: BreadcrumbItem[] = [];
  
  // Add home
  breadcrumbs.push({ label: 'Home', href: '/' });
  
  // Build breadcrumbs from path segments
  let currentPath = '';
  segments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    const isLast = index === segments.length - 1;
    
    // Use custom label if provided, otherwise format segment
    const label = pathLabels?.[segment] || formatSegmentLabel(segment);
    
    breadcrumbs.push({
      label,
      href: isLast ? undefined : currentPath, // No href for current page
      current: isLast
    });
  });
  
  return breadcrumbs;
}

/**
 * Format URL segment into readable label
 */
function formatSegmentLabel(segment: string): string {
  return segment
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Breadcrumbs for specific page types
 */

export interface BlogBreadcrumbsProps {
  category?: string;
  postTitle?: string;
  categoryHref?: string;
}

export function BlogBreadcrumbs({ 
  category, 
  postTitle, 
  categoryHref 
}: BlogBreadcrumbsProps) {
  const items: BreadcrumbItem[] = [
    { label: 'Home', href: '/' },
    { label: 'Blog', href: '/blog' }
  ];
  
  if (category) {
    items.push({
      label: category,
      href: categoryHref || `/blog/${category.toLowerCase().replace(/\s+/g, '-')}`
    });
  }
  
  if (postTitle) {
    items.push({
      label: postTitle,
      current: true
    });
  }
  
  return <Breadcrumbs items={items} />;
}

export interface ToolsBreadcrumbsProps {
  toolName: string;
}

export function ToolsBreadcrumbs({ toolName }: ToolsBreadcrumbsProps) {
  const items: BreadcrumbItem[] = [
    { label: 'Home', href: '/' },
    { label: 'Tools', href: '/tools' },
    { label: toolName, current: true }
  ];
  
  return <Breadcrumbs items={items} />;
}

export interface UseCasesBreadcrumbsProps {
  useCaseName: string;
}

export function UseCasesBreadcrumbs({ useCaseName }: UseCasesBreadcrumbsProps) {
  const items: BreadcrumbItem[] = [
    { label: 'Home', href: '/' },
    { label: 'Use Cases', href: '/use-cases' },
    { label: useCaseName, current: true }
  ];
  
  return <Breadcrumbs items={items} />;
}

/**
 * Hook for using breadcrumbs with Next.js router
 */
export function useBreadcrumbs(
  customItems?: BreadcrumbItem[],
  pathLabels?: Record<string, string>
) {
  if (typeof window === 'undefined') {
    return customItems || [];
  }
  
  const pathname = window.location.pathname;
  
  return customItems || generateBreadcrumbsFromPath(pathname, pathLabels);
}

export default Breadcrumbs;