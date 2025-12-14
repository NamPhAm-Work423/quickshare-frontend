// Enhanced SEO interfaces with search intent optimization

export interface SEOConfig {
  site: {
    name: string;
    description: string;
    url: string;
    logo: string;
  };
  defaults: {
    title: string;
    description: string;
    ogImage: string;
  };
  pages: Record<string, PageSEO>;
  programmatic: {
    templates: Record<string, SEOTemplate>;
    generators: Record<string, SEOGenerator>;
  };
}

export interface PageSEO {
  title: string;                    // CTR-optimized for search intent
  description: string;              // Search snippet optimized
  primaryKeyword: string;           // Main target keyword
  secondaryKeywords: string[];      // Supporting keywords
  searchIntent: 'informational' | 'navigational' | 'transactional' | 'commercial';
  canonical?: string;
  ogImage?: string;
  keywords?: string[];              // Computed keywords array
  noIndex?: boolean;
  structuredData?: object[];
  coreWebVitals?: {
    lcpTarget: number;
    clsTarget: number;
    fidTarget: number;
  };
}

// Programmatic SEO support
export interface SEOTemplate {
  titleTemplate: string;           // "Send Files from {device1} to {device2}"
  descriptionTemplate: string;
  variables: Record<string, string[]>;
}

export interface SEOGenerator {
  pattern: string;                 // "/send-file-from-{device1}-to-{device2}"
  template: string;
  maxPages: number;
}

// Enhanced SEO configuration with search intent optimization
export const seoConfig: SEOConfig = {
  site: {
    name: 'QuickShare',
    description: 'Secure P2P file sharing without login',
    url: 'https://quickshare.app',
    logo: '/logo.png',
  },
  defaults: {
    title: 'QuickShare - Send Files Instantly Without Login',
    description: 'Share files securely using 6-digit codes. No login required, files never stored on server.',
    ogImage: '/og-default.png',
  },
  pages: {
    home: {
      title: 'Send Files Instantly Without Login (P2P & Secure)',
      description: 'Share files between devices using a 6-digit code. No account, no cloud storage. P2P WebRTC encrypted transfer directly between browsers.',
      primaryKeyword: 'send files without login',
      secondaryKeywords: ['p2p file sharing', 'secure file transfer', 'anonymous file sharing'],
      searchIntent: 'transactional',
      coreWebVitals: {
        lcpTarget: 2.5,
        clsTarget: 0.1,
        fidTarget: 100,
      },
    },
    app: {
      title: 'P2P File Transfer App - Share Files Instantly',
      description: 'Upload files and get 6-digit codes for instant sharing. WebRTC P2P transfer with end-to-end encryption.',
      primaryKeyword: 'p2p file transfer app',
      secondaryKeywords: ['webrtc file sharing', 'secure file upload'],
      searchIntent: 'transactional',
      noIndex: true,
    },
    howItWorks: {
      title: 'How It Works - P2P File Sharing Without Server Storage',
      description: 'Learn how our 6-digit code file sharing works. WebRTC P2P technology ensures files never touch our servers.',
      primaryKeyword: 'p2p file sharing explained',
      secondaryKeywords: ['webrtc file transfer', '6-digit code sharing', 'browser file transfer'],
      searchIntent: 'informational',
    },
    security: {
      title: 'Security & Privacy - No Server File Storage',
      description: 'Your files never stored on servers. WebRTC P2P encryption, single-use codes, automatic expiration. Enterprise-grade security.',
      primaryKeyword: 'secure file sharing',
      secondaryKeywords: ['p2p encryption', 'privacy file transfer', 'no server storage'],
      searchIntent: 'informational',
    },
    privacy: {
      title: 'Privacy Policy - No Tracking, No Accounts',
      description: 'We don\'t track users or store files. Anonymous file sharing with minimal logging. Your privacy is our priority.',
      primaryKeyword: 'file sharing privacy',
      secondaryKeywords: ['anonymous file transfer', 'no tracking file sharing'],
      searchIntent: 'informational',
    },
    faq: {
      title: 'FAQ - P2P File Sharing Questions Answered',
      description: 'Common questions about our secure P2P file sharing. How 6-digit codes work, WebRTC security, file limits, and more.',
      primaryKeyword: 'p2p file sharing faq',
      secondaryKeywords: ['webrtc file transfer questions', 'secure file sharing help'],
      searchIntent: 'informational',
    },
  },
  programmatic: {
    templates: {
      deviceTransfer: {
        titleTemplate: 'Send Files from {device1} to {device2} {scenario}',
        descriptionTemplate: 'Learn how to transfer files from {device1} to {device2} {scenario}. Step-by-step guide with screenshots and tips.',
        variables: {
          device1: ['iPhone', 'Android', 'Mac', 'Windows', 'Linux'],
          device2: ['PC', 'Mac', 'iPhone', 'Android', 'Windows'],
          scenario: ['without internet', 'over wifi', 'securely', 'quickly'],
        },
      },
    },
    generators: {
      howToPages: {
        pattern: '/blog/how-to/send-file-from-{device1}-to-{device2}',
        template: 'deviceTransfer',
        maxPages: 25,
      },
    },
  },
};

// Legacy export for backward compatibility
export const seoMetadata = seoConfig.pages;

export const structuredData = {
  organization: {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'QuickShare',
    description: 'Secure P2P file sharing without login',
    url: 'https://quickshare.app',
    sameAs: [],
    foundingDate: '2025',
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'technical support'
    }
  },
  webApp: {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'QuickShare',
    description: 'P2P file sharing application with 6-digit codes',
    url: 'https://quickshare.app/app',
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Web Browser',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD'
    },
    featureList: [
      'P2P file transfer',
      'No login required',
      '6-digit code sharing',
      'End-to-end encryption',
      'No server storage'
    ]
  },
  faqPage: {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'How does the 6-digit code work?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'When you upload a file, we generate a unique 6-digit code. The recipient enters this code to connect directly to your browser via WebRTC for P2P transfer.'
        }
      },
      {
        '@type': 'Question',
        name: 'Are files stored on your servers?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'No. Files never touch our servers. We only provide signaling to establish direct P2P connections between browsers.'
        }
      },
      {
        '@type': 'Question',
        name: 'Is the transfer encrypted?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. WebRTC provides end-to-end encryption for all P2P transfers. Files are encrypted during transit between browsers.'
        }
      },
      {
        '@type': 'Question',
        name: 'Do I need to create an account?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'No account required. Simply upload files and share the generated 6-digit code with recipients.'
        }
      },
      {
        '@type': 'Question',
        name: 'What are the file size limits?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'File size limits depend on your browser and network connection. Most browsers handle files up to 2GB for P2P transfer.'
        }
      }
    ]
  }
} as const;
