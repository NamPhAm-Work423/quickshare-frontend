import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { 
  FileText, 
  CheckCircle, 
  XCircle, 
  Scale, 
  ArrowRight,
  Scroll,
  Mail,
  Calendar,
  Shield,
  Users,
  Globe,
  Server
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Terms of Service - QuickShare',
  description: 'Terms of service for QuickShare file sharing platform',
  robots: {
    index: true,
    follow: true,
  },
};

const allowedItems = [
  'Share files securely with others',
  'Use the service for personal and business purposes',
  'Transfer files of any size',
  'Enjoy privacy-focused file sharing',
];

const notAllowedItems = [
  'Sharing illegal or harmful content',
  'Distributing malware or viruses',
  'Violating others\' privacy or rights',
  'Using the service for spam or abuse',
];

const termsSections = [
  {
    number: '1',
    title: 'Acceptance of Terms',
    icon: Scale,
    content: 'By accessing and using QuickShare, you accept and agree to be bound by the terms and provision of this agreement. These terms apply to all visitors, users, and others who access or use the service.',
  },
  {
    number: '2',
    title: 'Service Description',
    icon: Server,
    content: 'QuickShare provides peer-to-peer file sharing services that allow users to transfer files directly between devices without server storage. Our service uses WebRTC technology to enable secure, direct connections between users.',
  },
  {
    number: '3',
    title: 'User Responsibilities',
    icon: Users,
    content: 'You are responsible for the content you share. You must not share illegal, harmful, or copyrighted content without permission. You must not use the service to distribute malware or viruses. You must respect the privacy and rights of other users.',
  },
  {
    number: '4',
    title: 'Service Availability',
    icon: Globe,
    content: 'We strive to maintain service availability but do not guarantee uninterrupted access. The service is provided "as is" without warranties of any kind, either express or implied.',
  },
  {
    number: '5',
    title: 'Privacy',
    icon: Shield,
    content: 'Your privacy is important to us. Please review our Privacy Policy to understand how we handle your information. We do not store your files on our servers - they are transferred directly between devices.',
  },
  {
    number: '6',
    title: 'Limitation of Liability',
    icon: Scale,
    content: 'QuickShare shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of the service. This includes any loss of data, profits, or business opportunities.',
  },
  {
    number: '7',
    title: 'Changes to Terms',
    icon: FileText,
    content: 'We reserve the right to modify these terms at any time. Continued use of the service constitutes acceptance of modified terms. We will notify users of significant changes through our website.',
  },
];

export default function TermsPage() {
  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-background to-blue-500/5" />
        <div className="absolute inset-0">
          <div className="absolute top-20 right-10 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 left-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>
        
        {/* Background icon */}
        <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
          <Scroll className="w-[500px] h-[500px]" />
        </div>
        
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center">
            {/* Icon badge */}
            <div className="relative inline-block mb-6">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-2xl blur-xl opacity-50 animate-pulse" />
              <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 shadow-xl flex items-center justify-center">
                <Scroll className="w-10 h-10 text-white" />
              </div>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Terms of Service
            </h1>
            
            <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-4">
              Please read these terms carefully before using QuickShare. By using our service, 
              you agree to be bound by these terms and conditions.
            </p>
            
            {/* Last updated badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 border border-border/50 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span>Last updated: January 15, 2024</span>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Overview - What's Allowed / Not Allowed */}
      <section className="container mx-auto px-4 pb-16">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6">
            {/* What You Can Do */}
            <div className="group relative p-6 rounded-2xl border border-green-500/20 bg-gradient-to-br from-green-500/5 to-emerald-500/5 hover:border-green-500/40 transition-all duration-300">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="relative">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center mb-4 shadow-lg shadow-green-500/20">
                  <CheckCircle className="w-7 h-7 text-white" />
                </div>
                
                <h3 className="font-bold text-lg mb-4">What You Can Do</h3>
                
                <ul className="space-y-3">
                  {allowedItems.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* What's Not Allowed */}
            <div className="group relative p-6 rounded-2xl border border-red-500/20 bg-gradient-to-br from-red-500/5 to-rose-500/5 hover:border-red-500/40 transition-all duration-300">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="relative">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center mb-4 shadow-lg shadow-red-500/20">
                  <XCircle className="w-7 h-7 text-white" />
                </div>
                
                <h3 className="font-bold text-lg mb-4">What&apos;s Not Allowed</h3>
                
                <ul className="space-y-3">
                  {notAllowedItems.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Terms Sections */}
      <section className="container mx-auto px-4 pb-16">
        <div className="max-w-5xl mx-auto">
          <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-blue-600 p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div className="text-white">
                  <h2 className="text-xl font-semibold">Terms & Conditions</h2>
                  <p className="opacity-90 text-sm">Legal terms governing your use of QuickShare</p>
                </div>
              </div>
            </div>
            
            {/* Terms Content */}
            <div className="p-8">
              <div className="space-y-8">
                {termsSections.map((section) => {
                  const Icon = section.icon;
                  return (
                    <div 
                      key={section.number}
                      className="group relative pl-16 border-l-2 border-border hover:border-primary transition-colors"
                    >
                      {/* Number badge */}
                      <div className="absolute left-0 top-0 -translate-x-1/2 w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-lg">
                        {section.number}
                      </div>
                      
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-lg bg-muted/50 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/10 transition-colors">
                          <Icon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
                        
                        <div>
                          <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                            {section.title}
                          </h3>
                          <p className="text-muted-foreground leading-relaxed">
                            {section.content}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Contact Section */}
                <div className="relative pl-16 border-l-2 border-border">
                  <div className="absolute left-0 top-0 -translate-x-1/2 w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-lg">
                    8
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-muted/50 flex items-center justify-center flex-shrink-0">
                      <Mail className="w-5 h-5 text-muted-foreground" />
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Contact Information</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        For questions about these terms, please contact us at: 
                        <a href="mailto:legal@quickshare.app" className="text-primary hover:underline ml-1">
                          legal@quickshare.app
                        </a>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 pb-16">
        <div className="max-w-5xl mx-auto">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-500 to-blue-600 p-8 md:p-12">
            {/* Pattern overlay */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
              }} />
            </div>
            
            <div className="relative flex flex-col md:flex-row items-center gap-6 text-white">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center">
                  <Scale className="w-8 h-8" />
                </div>
              </div>
              
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-2xl md:text-3xl font-bold mb-2">
                  Questions About Our Terms?
                </h2>
                <p className="text-white/80 text-lg">
                  We want to be transparent about our terms of service. Our legal team is here to help with any questions.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <a href="mailto:legal@quickshare.app">
                  <Button 
                    size="lg" 
                    className="bg-white text-indigo-600 hover:bg-white/90 font-semibold shadow-xl"
                  >
                    Contact Legal Team
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