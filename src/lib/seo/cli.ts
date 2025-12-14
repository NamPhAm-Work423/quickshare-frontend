#!/usr/bin/env node

/**
 * CLI utility for testing and managing the programmatic SEO system
 * Usage: npx tsx src/lib/seo/cli.ts [command]
 */

import { generateAllSEOPages, validateAllSEOPages, getTemplateStats } from './programmatic';
import { defaultTemplateEngine } from './template-engine';

function main() {
  const command = process.argv[2] || 'help';

  switch (command) {
    case 'generate':
      console.log('Generating all SEO pages...');
      const pages = generateAllSEOPages();
      console.log(`Generated ${pages.length} pages:`);
      pages.slice(0, 10).forEach(page => {
        console.log(`- ${page.slug}: ${page.title}`);
      });
      if (pages.length > 10) {
        console.log(`... and ${pages.length - 10} more pages`);
      }
      break;

    case 'validate':
      console.log('Validating all SEO pages...');
      const validation = validateAllSEOPages();
      console.log(`Validation result: ${validation.isValid ? 'PASS' : 'FAIL'}`);
      
      if (validation.errors.length > 0) {
        console.log('\nErrors:');
        validation.errors.forEach(error => console.log(`- ${error}`));
      }
      
      if (validation.warnings.length > 0) {
        console.log('\nWarnings:');
        validation.warnings.forEach(warning => console.log(`- ${warning}`));
      }
      break;

    case 'stats':
      console.log('Template statistics:');
      const stats = getTemplateStats();
      Object.entries(stats).forEach(([name, stat]) => {
        if (stat) {
          console.log(`\n${name}:`);
          console.log(`  Total combinations: ${stat.totalCombinations}`);
          console.log(`  Variables: ${stat.variableCount}`);
          stat.variables.forEach(variable => {
            console.log(`    ${variable.name}: ${variable.valueCount} values`);
          });
        }
      });
      break;

    case 'templates':
      console.log('Available templates:');
      const deviceTransfer = defaultTemplateEngine.getTemplate('device-transfer');
      const comparison = defaultTemplateEngine.getTemplate('comparison');
      
      if (deviceTransfer) {
        console.log('\nDevice Transfer Template:');
        console.log(`  Title: ${deviceTransfer.titleTemplate}`);
        console.log(`  Description: ${deviceTransfer.descriptionTemplate}`);
      }
      
      if (comparison) {
        console.log('\nComparison Template:');
        console.log(`  Title: ${comparison.titleTemplate}`);
        console.log(`  Description: ${comparison.descriptionTemplate}`);
      }
      break;

    case 'help':
    default:
      console.log('Programmatic SEO CLI');
      console.log('\nCommands:');
      console.log('  generate   - Generate all SEO pages');
      console.log('  validate   - Validate generated pages');
      console.log('  stats      - Show template statistics');
      console.log('  templates  - Show available templates');
      console.log('  help       - Show this help message');
      break;
  }
}

if (require.main === module) {
  main();
}

export { main };