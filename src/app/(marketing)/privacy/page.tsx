import { Metadata } from 'next';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { parseContent } from '@/lib/content/parser';
import { seoConfig } from '@/lib/seo/metadata';

export const metadata: Metadata = {
  title: seoConfig.pages.privacy?.title || 'Privacy Policy - QuickShare',
  description: seoConfig.pages.privacy?.description || 'Privacy policy for QuickShare file sharing service',
  robots: {
    index: true,
    follow: true,
  },
};

async function getPrivacyContent() {
  try {
    const filePath = join(process.cwd(), 'content/pages/privacy.md');
    const rawContent = await readFile(filePath, 'utf-8');
    return parseContent(rawContent);
  } catch (error) {
    console.error('Error loading privacy content:', error);
    return null;
  }
}

export default async function PrivacyPage() {
  const content = await getPrivacyContent();

  if (!content) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <header className="mb-8">
            <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
            <p className="text-xl text-muted-foreground">
              Privacy policy content is currently unavailable.
            </p>
          </header>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-4">
            🔒 Privacy Policy
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Your privacy matters to us. Learn how we protect your data and respect your rights 
            when using QuickShare's secure file sharing service.
          </p>
        </header>

        <div className="bg-card border border-border rounded-lg shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🛡️</span>
              </div>
              <div>
                <h2 className="text-xl font-semibold">Privacy First</h2>
                <p className="opacity-90">We prioritize your privacy and data protection</p>
              </div>
            </div>
          </div>
          
          <div className="p-8">
            <article className="prose prose-lg dark:prose-invert max-w-none">
              <div dangerouslySetInnerHTML={{ __html: content.content }} />
            </article>
          </div>
        </div>

        <section className="mt-8 bg-gradient-to-r from-green-600 to-blue-600 text-white p-8 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Questions About Privacy?</h2>
          <p className="mb-6 opacity-90">
            We're committed to transparency. If you have any questions about our privacy practices, 
            don't hesitate to reach out to our privacy team.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a 
              href="mailto:privacy@quickshare.app" 
              className="inline-block bg-background text-primary px-6 py-3 rounded-lg font-semibold hover:bg-muted transition-colors"
            >
              Contact Privacy Team
            </a>
            <a 
              href="/security" 
              className="inline-block bg-white/20 text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/30 transition-colors"
            >
              View Security Measures
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}