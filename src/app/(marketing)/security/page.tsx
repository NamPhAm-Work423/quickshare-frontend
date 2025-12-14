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
  Server, 
  Eye, 
  Zap, 
  CheckCircle, 
  ArrowRight,
  FileKey,
  Globe,
  RefreshCw
} from 'lucide-react';

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
    const parsed = parseContent(rawContent);
    return {
      ...parsed,
      content: transformMarkdownToHtml(parsed.content)
    };
  } catch (error) {
    console.error('Error loading security content:', error);
    return null;
  }
}

const securityFeatures = [
  {
    icon: Lock,
    title: 'End-to-End Encryption',
    description: 'Your files are encrypted before leaving your device and can only be decrypted by the recipient.',
    gradient: 'from-green-500 to-emerald-600',
    bgGradient: 'from-green-500/10 to-emerald-500/10',
  },
  {
    icon: Server,
    title: 'Zero Server Storage',
    description: 'Files are transferred directly between devices. We never store your data on our servers.',
    gradient: 'from-blue-500 to-cyan-600',
    bgGradient: 'from-blue-500/10 to-cyan-500/10',
  },
  {
    icon: Shield,
    title: 'Secure Connections',
    description: 'All connections use WebRTC with DTLS encryption for maximum security.',
    gradient: 'from-purple-500 to-pink-600',
    bgGradient: 'from-purple-500/10 to-pink-500/10',
  },
];

const securityMetrics = [
  { label: 'Encryption Standard', value: 'AES-256', icon: Lock },
  { label: 'Protocol', value: 'WebRTC + DTLS', icon: Globe },
  { label: 'Data Retention', value: 'Zero', icon: Eye },
  { label: 'Code Expiry', value: '24 Hours', icon: RefreshCw },
];

const trustBadges = [
  'No registration required',
  'No file size tracking',
  'No third-party analytics',
  'No data selling',
  'Open security practices',
  'Regular security audits',
];

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
    <div className="relative">
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-background to-orange-500/5" />
        <div className="absolute inset-0">
          <div className="absolute top-20 right-20 w-72 h-72 bg-red-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-10 left-10 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>
        
        {/* Animated shield icon */}
        <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
          <Shield className="w-[600px] h-[600px]" />
        </div>
        
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center">
            {/* Animated shield badge */}
            <div className="relative inline-block mb-6">
              <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl blur-xl opacity-50 animate-pulse" />
              <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-red-500 to-orange-600 shadow-xl flex items-center justify-center">
                <Shield className="w-10 h-10 text-white" />
              </div>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Security & Privacy
            </h1>
            
            <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              Discover how QuickShare keeps your files secure with end-to-end encryption, 
              zero-knowledge architecture, and industry-leading security practices.
            </p>
          </div>
        </div>
      </section>

      {/* Security Features Grid */}
      <section className="container mx-auto px-4 pb-16">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6">
            {securityFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div 
                  key={index}
                  className="group relative p-6 rounded-2xl border border-border/50 bg-card/50 backdrop-blur transition-all duration-300 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1"
                >
                  {/* Gradient overlay */}
                  <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                  
                  <div className="relative">
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    
                    <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Security Metrics */}
      <section className="container mx-auto px-4 pb-16">
        <div className="max-w-5xl mx-auto">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-card to-muted/30 border border-border/50 p-8">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-red-500/10 to-transparent rounded-full blur-2xl" />
            
            <h2 className="text-2xl font-bold text-center mb-8">Security at a Glance</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {securityMetrics.map((metric, index) => {
                const Icon = metric.icon;
                return (
                  <div key={index} className="text-center group">
                    <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br from-red-500/10 to-orange-500/10 flex items-center justify-center group-hover:from-red-500/20 group-hover:to-orange-500/20 transition-colors">
                      <Icon className="w-6 h-6 text-red-500" />
                    </div>
                    <div className="font-bold text-xl bg-gradient-to-r from-red-500 to-orange-600 bg-clip-text text-transparent">
                      {metric.value}
                    </div>
                    <div className="text-sm text-muted-foreground">{metric.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="container mx-auto px-4 pb-16">
        <div className="max-w-5xl mx-auto">
          <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-red-600 via-red-500 to-orange-600 p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
                  <FileKey className="w-6 h-6 text-white" />
                </div>
                <div className="text-white">
                  <h2 className="text-xl font-semibold">Security Details</h2>
                  <p className="opacity-90 text-sm">Comprehensive security measures and protocols</p>
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

      {/* Trust Badges */}
      <section className="container mx-auto px-4 pb-16">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">Our Privacy Commitments</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {trustBadges.map((badge, index) => (
              <div 
                key={index}
                className="flex items-center gap-3 p-4 rounded-xl bg-green-500/5 border border-green-500/20 hover:bg-green-500/10 transition-colors"
              >
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span className="text-sm font-medium">{badge}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 pb-16">
        <div className="max-w-5xl mx-auto">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-red-600 via-red-500 to-orange-600 p-8 md:p-12">
            {/* Pattern overlay */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
              }} />
            </div>
            
            <div className="relative flex flex-col md:flex-row items-center gap-6 text-white">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center">
                  <Shield className="w-8 h-8" />
                </div>
              </div>
              
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-2xl md:text-3xl font-bold mb-2">
                  Security Concerns?
                </h2>
                <p className="text-white/80 text-lg">
                  We take security seriously. Report vulnerabilities or ask questions about our security practices.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <a href="mailto:security@quickshare.app">
                  <Button 
                    size="lg" 
                    className="bg-white text-red-600 hover:bg-white/90 font-semibold shadow-xl"
                  >
                    Report Security Issue
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </a>
                <Link href="/privacy">
                  <Button 
                    size="lg" 
                    variant="outline"
                    className="border-white/30 text-white hover:bg-white/10 font-semibold"
                  >
                    Privacy Policy
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