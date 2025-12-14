import { useMemo } from 'react';
import { getSearchIntent, getAllKeywords, getPagesByIntent, type SearchIntentMap } from '@/lib/seo/search-intent';

export interface UseSearchIntentOptions {
  keyword?: string;
  currentPath?: string;
}

export interface SearchIntentResult {
  intent: SearchIntentMap[string]['intent'] | null;
  primaryPage: string | null;
  supportingPages: string[];
  relatedKeywords: string[];
  isCurrentPagePrimary: boolean;
  isCurrentPageSupporting: boolean;
  suggestions: {
    primaryKeywords: string[];
    relatedPages: string[];
  };
}

/**
 * Hook for analyzing search intent and providing SEO recommendations
 */
export function useSearchIntent(options: UseSearchIntentOptions = {}): SearchIntentResult {
  const { keyword, currentPath } = options;

  return useMemo(() => {
    if (!keyword) {
      return {
        intent: null,
        primaryPage: null,
        supportingPages: [],
        relatedKeywords: [],
        isCurrentPagePrimary: false,
        isCurrentPageSupporting: false,
        suggestions: {
          primaryKeywords: getAllKeywords().slice(0, 5), // Top 5 keywords
          relatedPages: [],
        },
      };
    }

    const intentData = getSearchIntent(keyword);

    if (!intentData) {
      // No exact match found, provide suggestions
      const allKeywords = getAllKeywords();
      const relatedKeywords = allKeywords.filter(k => 
        k.includes(keyword.toLowerCase()) || keyword.toLowerCase().includes(k)
      );

      return {
        intent: null,
        primaryPage: null,
        supportingPages: [],
        relatedKeywords,
        isCurrentPagePrimary: false,
        isCurrentPageSupporting: false,
        suggestions: {
          primaryKeywords: relatedKeywords.slice(0, 5),
          relatedPages: [],
        },
      };
    }

    // Check if current page is primary or supporting
    const isCurrentPagePrimary = currentPath === intentData.primaryPage;
    const isCurrentPageSupporting = intentData.supportingPages.includes(currentPath || '');

    // Generate suggestions based on intent type
    const sameIntentPages = getPagesByIntent(intentData.intent);
    const relatedPages = sameIntentPages.filter(page => 
      page !== intentData.primaryPage && 
      !intentData.supportingPages.includes(page)
    );

    return {
      intent: intentData.intent,
      primaryPage: intentData.primaryPage,
      supportingPages: intentData.supportingPages,
      relatedKeywords: intentData.keywords,
      isCurrentPagePrimary,
      isCurrentPageSupporting,
      suggestions: {
        primaryKeywords: intentData.keywords,
        relatedPages: relatedPages.slice(0, 3),
      },
    };
  }, [keyword, currentPath]);
}

/**
 * Hook for getting all search intents for analytics/admin purposes
 */
export function useAllSearchIntents() {
  return useMemo(() => {
    const allKeywords = getAllKeywords();
    const intentsByType = {
      informational: getPagesByIntent('informational'),
      navigational: getPagesByIntent('navigational'),
      transactional: getPagesByIntent('transactional'),
      commercial: getPagesByIntent('commercial'),
    };

    const keywordAnalysis = allKeywords.map(keyword => {
      const intentData = getSearchIntent(keyword);
      return {
        keyword,
        ...intentData,
      };
    });

    return {
      allKeywords,
      intentsByType,
      keywordAnalysis,
      totalKeywords: allKeywords.length,
    };
  }, []);
}