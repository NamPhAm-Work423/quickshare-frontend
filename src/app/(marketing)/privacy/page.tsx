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
        <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
        <p>Privacy policy content is currently unavailable.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <article className="prose prose-lg dark:prose-invert mx-auto">
        <div dangerouslySetInnerHTML={{ __html: content.content }} />
      </article>
    </div>
  );
}