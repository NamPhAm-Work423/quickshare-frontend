/**
 * SEO Template Engine for Programmatic Page Generation
 * Provides variable substitution and template processing capabilities
 */

export interface TemplateVariable {
  name: string;
  values: string[];
  description?: string;
}

export interface SEOTemplateConfig {
  name: string;
  titleTemplate: string;
  descriptionTemplate: string;
  variables: Record<string, TemplateVariable>;
  maxCombinations?: number;
}

export class SEOTemplateEngine {
  private templates: Map<string, SEOTemplateConfig> = new Map();

  /**
   * Register a new SEO template
   */
  registerTemplate(config: SEOTemplateConfig): void {
    this.templates.set(config.name, config);
  }

  /**
   * Get a registered template by name
   */
  getTemplate(name: string): SEOTemplateConfig | undefined {
    return this.templates.get(name);
  }

  /**
   * Process a template with given variables
   */
  processTemplate(templateName: string, variables: Record<string, string>): {
    title: string;
    description: string;
  } | null {
    const template = this.templates.get(templateName);
    if (!template) {
      return null;
    }

    const title = this.interpolateString(template.titleTemplate, variables);
    const description = this.interpolateString(template.descriptionTemplate, variables);

    return { title, description };
  }

  /**
   * Generate all possible combinations for a template
   */
  generateCombinations(templateName: string): Array<{
    variables: Record<string, string>;
    title: string;
    description: string;
  }> {
    const template = this.templates.get(templateName);
    if (!template) {
      return [];
    }

    const variableNames = Object.keys(template.variables);
    const variableValues = variableNames.map(name => template.variables[name].values);
    
    const combinations: Array<Record<string, string>> = [];
    const maxCombinations = template.maxCombinations || 100;

    this.generateRecursiveCombinations(
      variableNames,
      variableValues,
      [],
      combinations,
      maxCombinations
    );

    return combinations.map(variables => ({
      variables,
      title: this.interpolateString(template.titleTemplate, variables),
      description: this.interpolateString(template.descriptionTemplate, variables),
    }));
  }

  /**
   * Validate template syntax
   */
  validateTemplate(config: SEOTemplateConfig): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    // Check if title template has variables
    const titleVariables = this.extractVariables(config.titleTemplate);
    const descriptionVariables = this.extractVariables(config.descriptionTemplate);
    const definedVariables = Object.keys(config.variables);

    // Check if all template variables are defined
    [...titleVariables, ...descriptionVariables].forEach(variable => {
      if (!definedVariables.includes(variable)) {
        errors.push(`Variable "${variable}" used in template but not defined`);
      }
    });

    // Check if all defined variables are used
    definedVariables.forEach(variable => {
      if (!titleVariables.includes(variable) && !descriptionVariables.includes(variable)) {
        errors.push(`Variable "${variable}" defined but not used in templates`);
      }
    });

    // Check variable values
    Object.entries(config.variables).forEach(([name, variable]) => {
      if (!variable.values || variable.values.length === 0) {
        errors.push(`Variable "${name}" has no values defined`);
      }
      
      variable.values.forEach((value, index) => {
        if (!value || value.trim() === '') {
          errors.push(`Variable "${name}" has empty value at index ${index}`);
        }
      });
    });

    // Check template length constraints
    const sampleVariables: Record<string, string> = {};
    Object.entries(config.variables).forEach(([name, variable]) => {
      sampleVariables[name] = variable.values[0] || '';
    });

    const sampleTitle = this.interpolateString(config.titleTemplate, sampleVariables);
    const sampleDescription = this.interpolateString(config.descriptionTemplate, sampleVariables);

    if (sampleTitle.length > 60) {
      errors.push(`Title template may generate titles longer than 60 characters (sample: ${sampleTitle.length})`);
    }

    if (sampleDescription.length > 160) {
      errors.push(`Description template may generate descriptions longer than 160 characters (sample: ${sampleDescription.length})`);
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Get statistics about a template
   */
  getTemplateStats(templateName: string): {
    totalCombinations: number;
    variableCount: number;
    variables: Array<{ name: string; valueCount: number }>;
  } | null {
    const template = this.templates.get(templateName);
    if (!template) {
      return null;
    }

    const variables = Object.entries(template.variables).map(([name, variable]) => ({
      name,
      valueCount: variable.values.length,
    }));

    const totalCombinations = variables.reduce((total, variable) => total * variable.valueCount, 1);

    return {
      totalCombinations,
      variableCount: variables.length,
      variables,
    };
  }

  private interpolateString(template: string, variables: Record<string, string>): string {
    return template.replace(/\{(\w+)\}/g, (match, variableName) => {
      return variables[variableName] || match;
    });
  }

  private extractVariables(template: string): string[] {
    const matches = template.match(/\{(\w+)\}/g);
    if (!matches) return [];
    
    return matches.map(match => match.slice(1, -1)); // Remove { and }
  }

  private generateRecursiveCombinations(
    variableNames: string[],
    variableValues: string[][],
    current: string[],
    results: Array<Record<string, string>>,
    maxResults: number
  ): void {
    if (results.length >= maxResults) return;

    if (current.length === variableNames.length) {
      const combination: Record<string, string> = {};
      variableNames.forEach((name, index) => {
        combination[name] = current[index];
      });
      results.push(combination);
      return;
    }

    const currentIndex = current.length;
    for (const value of variableValues[currentIndex]) {
      current.push(value);
      this.generateRecursiveCombinations(variableNames, variableValues, current, results, maxResults);
      current.pop();
    }
  }
}

// Default template engine instance
export const defaultTemplateEngine = new SEOTemplateEngine();

// Register default templates
defaultTemplateEngine.registerTemplate({
  name: 'device-transfer',
  titleTemplate: 'Send Files from {device1} to {device2} {scenario} - QuickShare',
  descriptionTemplate: 'Learn how to transfer files from {device1} to {device2} {scenario}. Step-by-step guide with screenshots and security tips for P2P file sharing.',
  variables: {
    device1: {
      name: 'device1',
      values: ['iPhone', 'Android', 'Mac', 'Windows', 'Linux'],
      description: 'Source device type',
    },
    device2: {
      name: 'device2',
      values: ['PC', 'Mac', 'iPhone', 'Android', 'Windows'],
      description: 'Target device type',
    },
    scenario: {
      name: 'scenario',
      values: ['Securely', 'Quickly', 'Without Internet', 'Over WiFi'],
      description: 'Transfer scenario or method',
    },
  },
  maxCombinations: 25,
});

defaultTemplateEngine.registerTemplate({
  name: 'comparison',
  titleTemplate: '{service} Alternative - Better P2P File Sharing | QuickShare',
  descriptionTemplate: 'Looking for a {service} alternative? QuickShare offers {feature} with no login required. Compare features and see why users prefer our P2P file sharing.',
  variables: {
    service: {
      name: 'service',
      values: ['Wormhole', 'Snapdrop', 'WeTransfer', 'Dropbox', 'Google Drive'],
      description: 'Competitor service name',
    },
    feature: {
      name: 'feature',
      values: ['better security', 'faster transfers', 'no file size limits', 'complete privacy'],
      description: 'Key differentiating feature',
    },
  },
  maxCombinations: 10,
});