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
        <h1 className="text-3xl font-bold mb-6">Security & Privacy</h1>
        <p>Security content is currently unavailable.</p>
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