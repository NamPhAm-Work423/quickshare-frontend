import { useMemo } from 'react';
import { seoConfig, type SEOTemplate, type SEOGenerator } from '@/lib/seo/metadata';

export interface UseProgrammaticSEOOptions {
  templateKey?: string;
  generatorKey?: string;
  variables?: Record<string, string>;
  maxPages?: number;
}

export interface ProgrammaticSEOResult {
  generatedMetadata: {
    title: string;
    description: string;
    variables: Record<string, string>;
  } | null;
  availableTemplates: string[];
  availableGenerators: string[];
  possibleCombinations: Array<{
    url: string;
    title: string;
    description: string;
    variables: Record<string, string>;
  }>;
  isValidCombination: boolean;
}

/**
 * Hook for programmatic SEO page generation
 * Handles template processing and variable substitution
 */
export function useProgrammaticSEO(options: UseProgrammaticSEOOptions = {}): ProgrammaticSEOResult {
  const { templateKey, generatorKey, variables, maxPages = 10 } = options;

  return useMemo(() => {
    const availableTemplates = Object.keys(seoConfig.programmatic.templates);
    const availableGenerators = Object.keys(seoConfig.programmatic.generators);

    // If no template specified, return available options
    if (!templateKey) {
      return {
        generatedMetadata: null,
        availableTemplates,
        availableGenerators,
        possibleCombinations: [],
        isValidCombination: false,
      };
    }

    const template = seoConfig.programmatic.templates[templateKey];
    if (!template) {
      return {
        generatedMetadata: null,
        availableTemplates,
        availableGenerators,
        possibleCombinations: [],
        isValidCombination: false,
      };
    }

    // Generate metadata with provided variables
    let generatedMetadata = null;
    let isValidCombination = false;

    if (variables) {
      // Check if all required variables are provided
      const templateVariables = Object.keys(template.variables);
      const providedVariables = Object.keys(variables);
      const hasAllVariables = templateVariables.every(key => providedVariables.includes(key));

      if (hasAllVariables) {
        // Validate variable values against allowed options
        const isValidVariables = templateVariables.every(key => {
          const allowedValues = template.variables[key];
          const providedValue = variables[key];
          return allowedValues.includes(providedValue);
        });

        if (isValidVariables) {
          let title = template.titleTemplate;
          let description = template.descriptionTemplate;

          // Substitute variables
          Object.entries(variables).forEach(([key, value]) => {
            const placeholder = `{${key}}`;
            title = title.replace(new RegExp(placeholder, 'g'), value);
            description = description.replace(new RegExp(placeholder, 'g'), value);
          });

          generatedMetadata = {
            title,
            description,
            variables,
          };
          isValidCombination = true;
        }
      }
    }

    // Generate all possible combinations for preview
    const possibleCombinations: Array<{
      url: string;
      title: string;
      description: string;
      variables: Record<string, string>;
    }> = [];

    if (generatorKey && seoConfig.programmatic.generators[generatorKey]) {
      const generator = seoConfig.programmatic.generators[generatorKey];
      const generatorTemplate = seoConfig.programmatic.templates[generator.template];

      if (generatorTemplate) {
        // Generate combinations up to maxPages
        const variableKeys = Object.keys(generatorTemplate.variables);
        const combinations = generateCombinations(generatorTemplate.variables, Math.min(maxPages, generator.maxPages));

        combinations.forEach(combo => {
          let url = generator.pattern;
          let title = generatorTemplate.titleTemplate;
          let description = generatorTemplate.descriptionTemplate;

          // Substitute variables in URL, title, and description
          Object.entries(combo).forEach(([key, value]) => {
            const placeholder = `{${key}}`;
            url = url.replace(new RegExp(placeholder, 'g'), value.toLowerCase().replace(/\s+/g, '-'));
            title = title.replace(new RegExp(placeholder, 'g'), value);
            description = description.replace(new RegExp(placeholder, 'g'), value);
          });

          possibleCombinations.push({
            url,
            title,
            description,
            variables: combo,
          });
        });
      }
    }

    return {
      generatedMetadata,
      availableTemplates,
      availableGenerators,
      possibleCombinations,
      isValidCombination,
    };
  }, [templateKey, generatorKey, variables, maxPages]);
}

/**
 * Generate combinations of variables up to a maximum count
 */
function generateCombinations(
  variables: Record<string, string[]>,
  maxCombinations: number
): Array<Record<string, string>> {
  const keys = Object.keys(variables);
  const combinations: Array<Record<string, string>> = [];

  function generateRecursive(
    currentCombo: Record<string, string>,
    keyIndex: number
  ) {
    if (combinations.length >= maxCombinations) return;
    
    if (keyIndex >= keys.length) {
      combinations.push({ ...currentCombo });
      return;
    }

    const currentKey = keys[keyIndex];
    const values = variables[currentKey];

    for (const value of values) {
      if (combinations.length >= maxCombinations) break;
      
      currentCombo[currentKey] = value;
      generateRecursive(currentCombo, keyIndex + 1);
    }
  }

  generateRecursive({}, 0);
  return combinations;
}