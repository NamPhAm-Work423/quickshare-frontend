import { Metadata } from 'next';
import Link from 'next/link';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { parseContent, transformMarkdownToHtml } from '@/lib/content/parser';
import { seoConfig } from '@/lib/seo/metadata';
import { Button } from '@/components/ui/button';
import { 
  Shield, 
  Lock, 
  Eye, 
  EyeOff, 
  Database, 
  FileX, 
  UserX, 
  CheckCircle, 
  ArrowRight,
  Fingerprint,
  KeyRound,
  ShieldCheck
} from 'lucide-react';

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
    const parsed = parseContent(rawContent);
    return {
      ...parsed,
      content: transformMarkdownToHtml(parsed.content)
    };
  } catch (error) {
    console.error('Error loading privacy content:', error);
    return null;
  }
}

const privacyHighlights = [
  {
    icon: EyeOff,
    title: 'No Tracking',
    description: 'We don\'t track your browsing habits or file sharing activities.',
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
  },
  {
    icon: FileX,
    title: 'No File Storage',
    description: 'Your files are never stored on our servers. Zero retention policy.',
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
  },
  {
    icon: UserX,
    title: 'No Accounts',
    description: 'Share files anonymously. No personal information required.',
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10',
  },
  {
    icon: Database,
    title: 'Minimal Data',
    description: 'We only process what\'s needed for P2P connection signaling.',
    color: 'text-orange-500',
    bgColor: 'bg-orange-500/10',
  },
];

const privacyPrinciples = [
  {
    title: 'Privacy by Design',
    description: 'Privacy is built into our architecture from the ground up, not added as an afterthought.',
    icon: Fingerprint,
  },
  {
    title: 'Zero Knowledge',
    description: 'We can\'t see your files because they never touch our servers. True end-to-end privacy.',
    icon: KeyRound,
  },
  {
    title: 'Transparent Practices',
    description: 'We\'re clear about what we collect (almost nothing) and why. No hidden data practices.',
    icon: ShieldCheck,
  },
];

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
    <div className="relative">
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-background to-purple-500/5" />
        <div className="absolute inset-0">
          <div className="absolute top-10 left-20 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-10 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>
        
        {/* Background icon */}
        <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
          <Lock className="w-[500px] h-[500px]" />
        </div>
        
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center">
            {/* Icon badge */}
            <div className="relative inline-block mb-6">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur-xl opacity-50 animate-pulse" />
              <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-xl flex items-center justify-center">
                <Lock className="w-10 h-10 text-white" />
              </div>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Privacy Policy
            </h1>
            
            <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              Your privacy matters to us. Learn how we protect your data and respect your rights 
              when using QuickShare&apos;s secure file sharing service.
            </p>
          </div>
        </div>
      </section>

      {/* Privacy Highlights */}
      <section className="container mx-auto px-4 pb-16">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {privacyHighlights.map((item, index) => {
              const Icon = item.icon;
              return (
                <div 
                  key={index}
                  className="group p-5 rounded-xl border border-border/50 bg-card/50 hover:border-primary/30 hover:shadow-lg transition-all duration-300"
                >
                  <div className={`w-12 h-12 rounded-xl ${item.bgColor} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                    <Icon className={`w-6 h-6 ${item.color}`} />
                  </div>
                  <h3 className="font-semibold mb-1">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Privacy Principles */}
      <section className="container mx-auto px-4 pb-16">
        <div className="max-w-5xl mx-auto">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-card to-muted/30 border border-border/50">
            {/* Decorative gradient */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-br from-blue-500/10 to-transparent rounded-full blur-2xl" />
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-gradient-to-tl from-purple-500/10 to-transparent rounded-full blur-2xl" />
            
            <div className="relative p-8">
              <h2 className="text-2xl font-bold text-center mb-8">Our Privacy Principles</h2>
              
              <div className="grid md:grid-cols-3 gap-6">
                {privacyPrinciples.map((principle, index) => {
                  const Icon = principle.icon;
                  return (
                    <div key={index} className="text-center group">
                      <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 flex items-center justify-center group-hover:from-blue-500/20 group-hover:to-purple-500/20 transition-colors">
                        <Icon className="w-7 h-7 text-primary" />
                      </div>
                      <h3 className="font-semibold text-lg mb-2">{principle.title}</h3>
                      <p className="text-sm text-muted-foreground">{principle.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-4 pb-16">
        <div className="max-w-5xl mx-auto">
          <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-purple-600 p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div className="text-white">
                  <h2 className="text-xl font-semibold">Privacy First</h2>
                  <p className="opacity-90 text-sm">We prioritize your privacy and data protection</p>
                </div>
              </div>
            </div>
            
            {/* Content */}
            <div className="p-8">
              <article className="prose prose-lg dark:prose-invert max-w-none">
                <div dangerouslySetInnerHTML={{ __html: content.content }} />
              </article>
            </div>
          </div>
        </div>
      </section>

      {/* Data We Don't Collect */}
      <section className="container mx-auto px-4 pb-16">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">What We Don&apos;t Collect</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              'Your Files',
              'Your IP Address',
              'Personal Information',
              'Browsing History',
              'Device Fingerprints',
              'Third-party Cookies',
            ].map((item, index) => (
              <div 
                key={index}
                className="flex items-center gap-3 p-4 rounded-xl bg-green-500/5 border border-green-500/20 hover:bg-green-500/10 transition-colors"
              >
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span className="text-sm font-medium">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 pb-16">
        <div className="max-w-5xl mx-auto">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-green-600 via-emerald-500 to-blue-600 p-8 md:p-12">
            {/* Pattern overlay */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
              }} />
            </div>
            
            <div className="relative flex flex-col md:flex-row items-center gap-6 text-white">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center">
                  <Eye className="w-8 h-8" />
                </div>
              </div>
              
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-2xl md:text-3xl font-bold mb-2">
                  Questions About Privacy?
                </h2>
                <p className="text-white/80 text-lg">
                  We&apos;re committed to transparency. If you have any questions about our privacy practices, 
                  don&apos;t hesitate to reach out.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <a href="mailto:privacy@quickshare.app">
                  <Button 
                    size="lg" 
                    className="bg-white text-green-600 hover:bg-white/90 font-semibold shadow-xl"
                  >
                    Contact Privacy Team
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </a>
                <Link href="/security">
                  <Button 
                    size="lg" 
                    variant="outline"
                    className="border-white/30 text-white hover:bg-white/10 font-semibold"
                  >
                    Security Measures
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}