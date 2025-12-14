import { Metadata } from 'next';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { parseContent } from '@/lib/content/parser';
import { seoConfig } from '@/lib/seo/metadata';

export const metadata: Metadata = {
  title: seoConfig.pages.security?.title || 'Security & Privacy - QuickShare',
  description: seoConfig.pages.security?.description || 'Security measures and privacy protections for QuickShare',
  robots: {
    index: true,
    follow: true,
  },
};

async function getSecurityContent() {
  try {
    const filePath = join(process.cwd(), 'content/pages/security.md');
    const rawContent = await readFile(filePath, 'utf-8');
    return parseContent(rawContent);
  } catch (error) {
    console.error('Error loading security content:', error);
    return null;
  }
}

export default async function SecurityPage() {
  const content = await getSecurityContent();

  if (!content) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <header className="mb-8">
            <h1 className="text-4xl font-bold mb-4">Security & Privacy</h1>
            <p className="text-xl text-muted-foreground">
              Security content is currently unavailable.
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
            🛡️ Security & Privacy
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Discover how QuickShare keeps your files secure with end-to-end encryption, 
            zero-knowledge architecture, and industry-leading security practices.
          </p>
        </header>

        <section className="mb-8">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-green-50 dark:bg-green-950/20 p-6 rounded-lg">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/50 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🔐</span>
              </div>
              <h3 className="font-semibold mb-2">End-to-End Encryption</h3>
              <p className="text-sm text-muted-foreground">
                Your files are encrypted before leaving your device and can only be decrypted by the recipient.
              </p>
            </div>
            <div className="bg-blue-50 dark:bg-blue-950/20 p-6 rounded-lg">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🚫</span>
              </div>
              <h3 className="font-semibold mb-2">Zero Server Storage</h3>
              <p className="text-sm text-muted-foreground">
                Files are transferred directly between devices. We never store your data on our servers.
              </p>
            </div>
            <div className="bg-purple-50 dark:bg-purple-950/20 p-6 rounded-lg">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/50 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🔒</span>
              </div>
              <h3 className="font-semibold mb-2">Secure Connections</h3>
              <p className="text-sm text-muted-foreground">
                All connections use WebRTC with DTLS encryption for maximum security.
              </p>
            </div>
          </div>
        </section>

        <div className="bg-card border border-border rounded-lg shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🔐</span>
              </div>
              <div>
                <h2 className="text-xl font-semibold">Security Details</h2>
                <p className="opacity-90">Comprehensive security measures and protocols</p>
              </div>
            </div>
          </div>
          
          <div className="p-8">
            <article className="prose prose-lg dark:prose-invert max-w-none">
              <div dangerouslySetInnerHTML={{ __html: content.content }} />
            </article>
          </div>
        </div>

        <section className="mt-8 bg-gradient-to-r from-red-600 to-pink-600 text-white p-8 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Security Concerns?</h2>
          <p className="mb-6 opacity-90">
            We take security seriously. If you discover a security vulnerability or have 
            concerns about our security practices, please report it to our security team.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a 
              href="mailto:security@quickshare.app" 
              className="inline-block bg-background text-primary px-6 py-3 rounded-lg font-semibold hover:bg-muted transition-colors"
            >
              Report Security Issue
            </a>
            <a 
              href="/privacy" 
              className="inline-block bg-white/20 text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/30 transition-colors"
            >
              View Privacy Policy
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}