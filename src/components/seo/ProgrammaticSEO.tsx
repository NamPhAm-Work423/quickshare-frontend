'use client';

import { useMemo } from 'react';
import type { SEOTemplate, SEOGenerator } from '../../lib/seo/metadata';

export interface ProgrammaticSEOProps {
  template: string;
  variables: Record<string, string>;
  fallbackContent?: string;
  maxLength?: number;
}

export interface SEOTemplateProps {
  templateConfig: SEOTemplate;
  variables: Record<string, string>;
  fallbackContent?: string;
}

export interface SEOGeneratorProps {
  generatorConfig: SEOGenerator;
  currentVariables: Record<string, string>;
  fallbackContent?: string;
}

/**
 * ProgrammaticSEO component for dynamic content generation
 * Supports variable substitution in templates for scalable SEO content
 */
export function ProgrammaticSEO({
  template,
  variables,
  fallbackContent = '',
  maxLength
}: ProgrammaticSEOProps) {
  const processedContent = useMemo(() => {
    return processTemplate(template, variables, fallbackContent, maxLength);
  }, [template, variables, fallbackContent, maxLength]);

  if (!processedContent) {
    return fallbackContent ? <span>{fallbackContent}</span> : null;
  }

  return <span dangerouslySetInnerHTML={{ __html: processedContent }} />;
}

/**
 * SEO Template component for predefined template configurations
 */
export function SEOTemplate({
  templateConfig,
  variables,
  fallbackContent = ''
}: SEOTemplateProps) {
  const { titleTemplate, descriptionTemplate } = templateConfig;
  
  const processedTitle = useMemo(() => {
    return processTemplate(titleTemplate, variables, fallbackContent);
  }, [titleTemplate, variables, fallbackContent]);

  const processedDescription = useMemo(() => {
    return processTemplate(descriptionTemplate, variables, fallbackContent);
  }, [descriptionTemplate, variables, fallbackContent]);

  return (
    <div className="seo-template">
      {processedTitle && (
        <h1 className="text-3xl font-bold mb-4">
          <ProgrammaticSEO 
            template={titleTemplate} 
            variables={variables}
            fallbackContent={fallbackContent}
          />
        </h1>
      )}
      {processedDescription && (
        <p className="text-lg text-gray-600 mb-6">
          <ProgrammaticSEO 
            template={descriptionTemplate} 
            variables={variables}
            fallbackContent={fallbackContent}
          />
        </p>
      )}
    </div>
  );
}

/**
 * SEO Generator component for dynamic page generation
 */
export function SEOGenerator({
  generatorConfig,
  currentVariables,
  fallbackContent = ''
}: SEOGeneratorProps) {
  const { pattern, template: templateName, maxPages } = generatorConfig;
  
  // In a real implementation, you would fetch the template from your config
  // For now, we'll create a basic template structure
  const generatedContent = useMemo(() => {
    return generateContentFromPattern(pattern, currentVariables, maxPages);
  }, [pattern, currentVariables, maxPages]);

  if (!generatedContent) {
    return fallbackContent ? <div>{fallbackContent}</div> : null;
  }

  return (
    <div className="seo-generated-content">
      {generatedContent}
    </div>
  );
}

/**
 * Process template string by replacing variables
 */
function processTemplate(
  template: string,
  variables: Record<string, string>,
  fallback: string = '',
  maxLength?: number
): string {
  if (!template) return fallback;

  let processed = template;
  
  // Replace variables in the format {variableName}
  Object.entries(variables).forEach(([key, value]) => {
    const regex = new RegExp(`\\{${key}\\}`, 'g');
    processed = processed.replace(regex, value || '');
  });

  // Check for unreplaced variables
  const unreplacedVariables = processed.match(/\{[^}]+\}/g);
  if (unreplacedVariables) {
    console.warn('ProgrammaticSEO: Unreplaced variables found:', unreplacedVariables);
    // Remove unreplaced variables
    processed = processed.replace(/\{[^}]+\}/g, '');
  }

  // Trim and clean up extra spaces
  processed = processed.replace(/\s+/g, ' ').trim();

  // Apply max length if specified
  if (maxLength && processed.length > maxLength) {
    processed = processed.substring(0, maxLength - 3) + '...';
  }

  return processed || fallback;
}

/**
 * Generate content from URL pattern and variables
 */
function generateContentFromPattern(
  pattern: string,
  variables: Record<string, string>,
  maxPages: number
): React.ReactNode {
  // Extract variable names from pattern
  const variableMatches = pattern.match(/\{([^}]+)\}/g);
  if (!variableMatches) {
    return <div>No variables found in pattern</div>;
  }

  const variableNames = variableMatches.map(match => match.slice(1, -1));
  
  // Generate URL based on current variables
  let generatedUrl = pattern;
  variableNames.forEach(varName => {
    const value = variables[varName];
    if (value) {
      generatedUrl = generatedUrl.replace(`{${varName}}`, value.toLowerCase().replace(/\s+/g, '-'));
    }
  });

  return (
    <div className="generated-page-info">
      <p className="text-sm text-gray-500 mb-2">
        Generated URL: <code className="bg-gray-100 px-2 py-1 rounded">{generatedUrl}</code>
      </p>
      <div className="variable-info">
        <h3 className="font-semibold mb-2">Current Variables:</h3>
        <ul className="list-disc list-inside text-sm text-gray-600">
          {Object.entries(variables).map(([key, value]) => (
            <li key={key}>
              <strong>{key}:</strong> {value}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/**
 * Utility functions for programmatic SEO
 */

/**
 * Generate all possible combinations from template variables
 */
export function generateVariableCombinations(
  templateVariables: Record<string, string[]>,
  maxCombinations: number = 50
): Array<Record<string, string>> {
  const keys = Object.keys(templateVariables);
  const combinations: Array<Record<string, string>> = [];
  
  function generateCombination(index: number, current: Record<string, string>) {
    if (index === keys.length) {
      combinations.push({ ...current });
      return;
    }
    
    if (combinations.length >= maxCombinations) {
      return;
    }
    
    const key = keys[index];
    const values = templateVariables[key];
    
    for (const value of values) {
      if (combinations.length >= maxCombinations) break;
      
      current[key] = value;
      generateCombination(index + 1, current);
    }
  }
  
  generateCombination(0, {});
  return combinations.slice(0, maxCombinations);
}

/**
 * Generate SEO-friendly URL slug from variables
 */
export function generateSlugFromVariables(
  pattern: string,
  variables: Record<string, string>
): string {
  let slug = pattern;
  
  Object.entries(variables).forEach(([key, value]) => {
    const slugValue = value
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-')         // Replace spaces with hyphens
      .replace(/-+/g, '-')          // Replace multiple hyphens with single
      .trim();
    
    slug = slug.replace(`{${key}}`, slugValue);
  });
  
  return slug;
}

/**
 * Validate template variables
 */
export function validateTemplateVariables(
  template: string,
  variables: Record<string, string>
): {
  isValid: boolean;
  missingVariables: string[];
  extraVariables: string[];
} {
  const templateVariables = (template.match(/\{([^}]+)\}/g) || [])
    .map(match => match.slice(1, -1));
  
  const providedVariables = Object.keys(variables);
  
  const missingVariables = templateVariables.filter(
    varName => !providedVariables.includes(varName)
  );
  
  const extraVariables = providedVariables.filter(
    varName => !templateVariables.includes(varName)
  );
  
  return {
    isValid: missingVariables.length === 0,
    missingVariables,
    extraVariables
  };
}

/**
 * Hook for programmatic SEO content generation
 */
export function useProgrammaticSEO(
  template: string,
  variables: Record<string, string>,
  options?: {
    fallback?: string;
    maxLength?: number;
    validate?: boolean;
  }
) {
  return useMemo(() => {
    const { fallback = '', maxLength, validate = true } = options || {};
    
    if (validate) {
      const validation = validateTemplateVariables(template, variables);
      if (!validation.isValid) {
        console.warn('ProgrammaticSEO: Template validation failed', validation);
      }
    }
    
    return {
      content: processTemplate(template, variables, fallback, maxLength),
      validation: validate ? validateTemplateVariables(template, variables) : null
    };
  }, [template, variables, options]);
}

export default ProgrammaticSEO;