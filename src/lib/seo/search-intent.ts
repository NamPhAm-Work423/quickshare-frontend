// Search Intent Mapping System
export interface SearchIntentMap {
  [keyword: string]: {
    intent: 'informational' | 'navigational' | 'transactional' | 'commercial';
    primaryPage: string;
    supportingPages: string[];
    keywords: string[];
  };
}

export const searchIntentMap: SearchIntentMap = {
  'send files without login': {
    intent: 'transactional',
    primaryPage: '/use-cases/send-files-without-login',
    supportingPages: ['/compare/wormhole-alternative', '/security'],
    keywords: ['send files without login', 'share files no account', 'anonymous file sharing'],
  },
  'p2p file transfer': {
    intent: 'informational',
    primaryPage: '/use-cases/p2p-file-transfer',
    supportingPages: ['/blog/p2p-file-sharing/what-is-p2p-file-transfer'],
    keywords: ['p2p file transfer', 'peer to peer file sharing', 'webrtc file transfer'],
  },
  'secure file sharing': {
    intent: 'informational',
    primaryPage: '/use-cases/secure-file-sharing',
    supportingPages: ['/security', '/privacy'],
    keywords: ['secure file sharing', 'encrypted file transfer', 'safe file sharing'],
  },
  'wormhole alternative': {
    intent: 'commercial',
    primaryPage: '/compare/wormhole-alternative',
    supportingPages: ['/use-cases/send-files-without-login'],
    keywords: ['wormhole alternative', 'magic wormhole replacement', 'better than wormhole'],
  },
  'snapdrop alternative': {
    intent: 'commercial',
    primaryPage: '/compare/snapdrop-alternative',
    supportingPages: ['/use-cases/p2p-file-transfer'],
    keywords: ['snapdrop alternative', 'snapdrop replacement', 'better than snapdrop'],
  },
};

export function getSearchIntent(keyword: string): SearchIntentMap[string] | null {
  return searchIntentMap[keyword.toLowerCase()] || null;
}

export function getAllKeywords(): string[] {
  return Object.keys(searchIntentMap);
}

export function getPagesByIntent(intent: SearchIntentMap[string]['intent']): string[] {
  return Object.values(searchIntentMap)
    .filter(mapping => mapping.intent === intent)
    .map(mapping => mapping.primaryPage);
}

/**
 * Get search intent recommendations for a given page
 */
export function getIntentRecommendations(currentPage: string): {
  isPrimaryPage: boolean;
  isSupportingPage: boolean;
  relatedKeywords: string[];
  suggestedKeywords: string[];
  intentType: SearchIntentMap[string]['intent'] | null;
} {
  // Find if current page is a primary page
  const primaryMatch = Object.entries(searchIntentMap).find(
    ([, mapping]) => mapping.primaryPage === currentPage
  );

  if (primaryMatch) {
    const [keyword, mapping] = primaryMatch;
    return {
      isPrimaryPage: true,
      isSupportingPage: false,
      relatedKeywords: mapping.keywords,
      suggestedKeywords: mapping.keywords.filter(k => k !== keyword),
      intentType: mapping.intent,
    };
  }

  // Find if current page is a supporting page
  const supportingMatch = Object.entries(searchIntentMap).find(
    ([, mapping]) => mapping.supportingPages.includes(currentPage)
  );

  if (supportingMatch) {
    const [keyword, mapping] = supportingMatch;
    return {
      isPrimaryPage: false,
      isSupportingPage: true,
      relatedKeywords: mapping.keywords,
      suggestedKeywords: mapping.keywords.filter(k => k !== keyword),
      intentType: mapping.intent,
    };
  }

  // Page not found in intent mapping - suggest related keywords
  const pathSegments = currentPage.split('/').filter(Boolean);
  const suggestedKeywords = getAllKeywords().filter(keyword =>
    pathSegments.some(segment => 
      keyword.toLowerCase().includes(segment.replace(/-/g, ' ')) ||
      segment.replace(/-/g, ' ').includes(keyword.toLowerCase())
    )
  );

  return {
    isPrimaryPage: false,
    isSupportingPage: false,
    relatedKeywords: [],
    suggestedKeywords: suggestedKeywords.slice(0, 5),
    intentType: null,
  };
}

/**
 * Analyze keyword competition and difficulty
 */
export function analyzeKeywordCompetition(keyword: string): {
  competitionLevel: 'low' | 'medium' | 'high';
  difficulty: number; // 1-100 scale
  relatedKeywords: string[];
  searchVolume: 'low' | 'medium' | 'high'; // Estimated based on keyword characteristics
} {
  const allKeywords = getAllKeywords();
  const relatedKeywords = allKeywords.filter(k => 
    k !== keyword && (
      k.includes(keyword.toLowerCase()) || 
      keyword.toLowerCase().includes(k) ||
      k.split(' ').some(word => keyword.toLowerCase().includes(word))
    )
  );

  // Simple heuristic for competition analysis
  const wordCount = keyword.split(' ').length;
  const hasCommercialIntent = ['buy', 'best', 'top', 'compare', 'vs', 'alternative'].some(
    term => keyword.toLowerCase().includes(term)
  );
  const hasLongTail = wordCount >= 3;

  let difficulty = 50; // Base difficulty
  let competitionLevel: 'low' | 'medium' | 'high' = 'medium';

  // Adjust based on characteristics
  if (hasCommercialIntent) {
    difficulty += 20;
    competitionLevel = 'high';
  }
  
  if (hasLongTail) {
    difficulty -= 15;
    if (competitionLevel === 'high') competitionLevel = 'medium';
    else competitionLevel = 'low';
  }

  if (relatedKeywords.length > 5) {
    difficulty += 10;
  }

  // Estimate search volume based on keyword characteristics
  let searchVolume: 'low' | 'medium' | 'high' = 'medium';
  if (wordCount === 1 || hasCommercialIntent) {
    searchVolume = 'high';
  } else if (wordCount >= 4) {
    searchVolume = 'low';
  }

  return {
    competitionLevel,
    difficulty: Math.min(100, Math.max(1, difficulty)),
    relatedKeywords,
    searchVolume,
  };
}

/**
 * Generate keyword variations for programmatic SEO
 */
export function generateKeywordVariations(baseKeyword: string): {
  variations: string[];
  modifiers: string[];
  longtailKeywords: string[];
} {
  const modifiers = [
    'how to', 'best', 'free', 'online', 'secure', 'fast', 'easy',
    'without login', 'no account', 'anonymous', 'private', 'instant'
  ];

  const suffixes = [
    'tool', 'app', 'service', 'solution', 'platform', 'software',
    'guide', 'tutorial', 'tips', 'methods', 'ways'
  ];

  const variations = [
    baseKeyword,
    ...modifiers.map(mod => `${mod} ${baseKeyword}`),
    ...suffixes.map(suf => `${baseKeyword} ${suf}`),
  ];

  const longtailKeywords = [
    `how to ${baseKeyword}`,
    `best ${baseKeyword} tool`,
    `${baseKeyword} without account`,
    `secure ${baseKeyword} online`,
    `free ${baseKeyword} service`,
  ];

  return {
    variations: [...new Set(variations)], // Remove duplicates
    modifiers,
    longtailKeywords,
  };
}

/**
 * Get content optimization suggestions based on search intent
 */
export function getContentOptimizationSuggestions(
  keyword: string,
  currentContent?: string
): {
  titleSuggestions: string[];
  headingSuggestions: string[];
  contentSuggestions: string[];
  ctaSuggestions: string[];
} {
  const intentData = getSearchIntent(keyword);
  const intent = intentData?.intent || 'informational';

  const titleSuggestions: string[] = [];
  const headingSuggestions: string[] = [];
  const contentSuggestions: string[] = [];
  const ctaSuggestions: string[] = [];

  switch (intent) {
    case 'transactional':
      titleSuggestions.push(
        `${keyword} - Start Now`,
        `${keyword} Instantly`,
        `${keyword} in Seconds`
      );
      headingSuggestions.push(
        'How It Works',
        'Get Started',
        'Features',
        'Security & Privacy'
      );
      contentSuggestions.push(
        'Include step-by-step instructions',
        'Highlight security features',
        'Show file size limits',
        'Explain the process clearly'
      );
      ctaSuggestions.push(
        'Start Sharing Files',
        'Upload Your File',
        'Try It Now',
        'Get Started Free'
      );
      break;

    case 'informational':
      titleSuggestions.push(
        `What is ${keyword}?`,
        `${keyword} - Complete Guide`,
        `${keyword} Explained`
      );
      headingSuggestions.push(
        'What is it?',
        'How does it work?',
        'Benefits',
        'Use cases',
        'Best practices'
      );
      contentSuggestions.push(
        'Provide comprehensive explanations',
        'Include examples and use cases',
        'Add technical details',
        'Compare different approaches'
      );
      ctaSuggestions.push(
        'Learn More',
        'Try Our Tool',
        'Read Related Articles',
        'Get Started'
      );
      break;

    case 'commercial':
      titleSuggestions.push(
        `Best ${keyword} - Top Options`,
        `${keyword} - Compare Solutions`,
        `${keyword} Reviews & Comparison`
      );
      headingSuggestions.push(
        'Top Solutions',
        'Feature Comparison',
        'Pros and Cons',
        'Pricing',
        'Our Recommendation'
      );
      contentSuggestions.push(
        'Compare different options',
        'Include feature matrices',
        'Highlight unique benefits',
        'Address common concerns'
      );
      ctaSuggestions.push(
        'Try Our Solution',
        'Compare Features',
        'See Why We\'re Better',
        'Start Free Trial'
      );
      break;

    case 'navigational':
      titleSuggestions.push(
        `${keyword} | Official Page`,
        `${keyword} - Access Here`,
        keyword
      );
      headingSuggestions.push(
        'Welcome',
        'Features',
        'Getting Started',
        'Support'
      );
      contentSuggestions.push(
        'Provide clear navigation',
        'Highlight key features',
        'Include quick access links',
        'Show recent updates'
      );
      ctaSuggestions.push(
        'Access Now',
        'Go to App',
        'Sign In',
        'Get Started'
      );
      break;
  }

  return {
    titleSuggestions,
    headingSuggestions,
    contentSuggestions,
    ctaSuggestions,
  };
}