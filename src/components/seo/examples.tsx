/**
 * Example usage of SEO components
 * This file demonstrates how to use the SEO components in your pages
 */

import { 
  MetaTags, 
  StructuredData,
  OrganizationStructuredData,
  WebPageStructuredData,
  ArticleStructuredData,
  FAQStructuredData,
  Breadcrumbs,
  BlogBreadcrumbs,
  ToolsBreadcrumbs,
  ProgrammaticSEO,
  SEOTemplate,
  generateMetadata
} from './index';

// Example 1: Basic MetaTags usage
export function ExampleMetaTags() {
  return (
    <MetaTags
      title="Send Files Without Login - Secure P2P Transfer"
      description="Share files instantly using 6-digit codes. No account required, end-to-end encrypted P2P transfer."
      primaryKeyword="send files without login"
      secondaryKeywords={['p2p file sharing', 'secure file transfer', 'anonymous file sharing']}
      canonical="https://quickshare.app"
      ogImage="/og-home.png"
      searchIntent="transactional"
      coreWebVitals={{
        lcpTarget: 2.5,
        clsTarget: 0.1,
        fidTarget: 100
      }}
    />
  );
}

// Example 2: Structured Data usage
export function ExampleStructuredData() {
  return (
    <>
      {/* Organization Schema */}
      <OrganizationStructuredData
        name="QuickShare"
        description="Secure P2P file sharing without login"
        url="https://quickshare.app"
        logo="https://quickshare.app/logo.png"
        contactEmail="support@quickshare.app"
      />

      {/* Web Page Schema */}
      <WebPageStructuredData
        name="QuickShare - Send Files Without Login"
        description="Secure P2P file sharing application"
        url="https://quickshare.app"
        breadcrumb={[
          { name: 'Home', url: 'https://quickshare.app' }
        ]}
      />

      {/* FAQ Schema */}
      <FAQStructuredData
        questions={[
          {
            question: 'How does the 6-digit code work?',
            answer: 'When you upload a file, we generate a unique 6-digit code. The recipient enters this code to connect directly to your browser via WebRTC for P2P transfer.'
          },
          {
            question: 'Are files stored on your servers?',
            answer: 'No. Files never touch our servers. We only provide signaling to establish direct P2P connections between browsers.'
          }
        ]}
      />
    </>
  );
}

// Example 3: Breadcrumbs usage
export function ExampleBreadcrumbs() {
  return (
    <>
      {/* Basic breadcrumbs */}
      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: 'Tools', href: '/tools' },
          { label: 'File Size Calculator', current: true }
        ]}
        structuredData={true}
      />

      {/* Blog breadcrumbs */}
      <BlogBreadcrumbs
        category="How To"
        postTitle="Send Files from iPhone to PC"
        categoryHref="/blog/how-to"
      />

      {/* Tools breadcrumbs */}
      <ToolsBreadcrumbs toolName="Checksum Generator" />
    </>
  );
}

// Example 4: Programmatic SEO usage
export function ExampleProgrammaticSEO() {
  const deviceTransferTemplate = {
    titleTemplate: 'Send Files from {device1} to {device2} {scenario}',
    descriptionTemplate: 'Learn how to transfer files from {device1} to {device2} {scenario}. Step-by-step guide with screenshots and tips.',
    variables: {
      device1: ['iPhone', 'Android', 'Mac', 'Windows'],
      device2: ['PC', 'Mac', 'iPhone', 'Android'],
      scenario: ['without internet', 'over wifi', 'securely', 'quickly']
    }
  };

  const currentVariables = {
    device1: 'iPhone',
    device2: 'PC',
    scenario: 'securely'
  };

  return (
    <div>
      {/* Simple programmatic content */}
      <h1>
        <ProgrammaticSEO
          template="Send Files from {device1} to {device2} {scenario}"
          variables={currentVariables}
          fallbackContent="Send Files Securely"
        />
      </h1>

      {/* Template-based content */}
      <SEOTemplate
        templateConfig={deviceTransferTemplate}
        variables={currentVariables}
        fallbackContent="File Transfer Guide"
      />

      {/* Description with programmatic content */}
      <p>
        <ProgrammaticSEO
          template="This comprehensive guide shows you how to transfer files from your {device1} to a {device2} {scenario}. Our step-by-step instructions make it easy to share files between {device1} and {device2} devices."
          variables={currentVariables}
          maxLength={160}
        />
      </p>
    </div>
  );
}

// Example 5: Complete page with all SEO components
export function ExampleCompletePage() {
  const pageData = {
    title: 'Send Files from iPhone to PC Securely',
    description: 'Learn how to transfer files from iPhone to PC securely using our P2P file sharing service. No login required, end-to-end encrypted.',
    primaryKeyword: 'send files from iPhone to PC',
    secondaryKeywords: ['iPhone to PC transfer', 'secure file sharing', 'P2P file transfer'],
    canonical: 'https://quickshare.app/blog/how-to/send-file-from-iphone-to-pc',
    ogImage: '/og-iphone-to-pc.png'
  };

  return (
    <>
      {/* Meta tags */}
      <MetaTags {...pageData} searchIntent="informational" />

      {/* Structured data */}
      <ArticleStructuredData
        headline={pageData.title}
        description={pageData.description}
        url={pageData.canonical!}
        datePublished="2025-12-15T10:00:00Z"
        author={{ name: 'QuickShare Team', type: 'Organization' }}
        image={pageData.ogImage}
      />

      {/* Page content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <BlogBreadcrumbs
          category="How To"
          postTitle="Send Files from iPhone to PC"
          categoryHref="/blog/how-to"
        />

        {/* Main content */}
        <article className="mt-8">
          <h1 className="text-4xl font-bold mb-4">
            <ProgrammaticSEO
              template="How to Send Files from {device1} to {device2} {scenario}"
              variables={{
                device1: 'iPhone',
                device2: 'PC',
                scenario: 'Securely'
              }}
            />
          </h1>

          <p className="text-lg text-gray-600 mb-8">
            <ProgrammaticSEO
              template="This guide will show you the easiest way to transfer files from your {device1} to a {device2} {scenario} using our P2P file sharing service."
              variables={{
                device1: 'iPhone',
                device2: 'PC',
                scenario: 'securely'
              }}
            />
          </p>

          {/* Article content would go here */}
        </article>
      </div>
    </>
  );
}

// Example 6: Next.js App Router metadata generation
export function generateExampleMetadata() {
  return generateMetadata({
    title: 'P2P File Transfer Tools',
    description: 'Free online tools for secure file sharing and P2P transfer',
    primaryKeyword: 'p2p file transfer tools',
    secondaryKeywords: ['file sharing tools', 'secure transfer', 'online file tools'],
    canonical: 'https://quickshare.app/tools',
    ogImage: '/og-tools.png',
    searchIntent: 'commercial'
  });
}