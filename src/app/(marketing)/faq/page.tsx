'use client';

import { useState } from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { 
  ChevronDown, 
  Shield, 
  Zap, 
  Lock, 
  Users, 
  HelpCircle, 
  Clock, 
  Globe, 
  Folder, 
  AlertCircle, 
  DollarSign,
  ArrowRight,
  MessageCircle
} from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
  icon: React.ElementType;
  category: string;
}

const faqs: FAQItem[] = [
  {
    question: 'How does the 6-digit code work?',
    answer: 'When you upload a file, we generate a unique 6-digit code. The recipient enters this code to connect directly to your browser via WebRTC for P2P transfer. The code is single-use and expires automatically for security.',
    icon: Lock,
    category: 'Getting Started',
  },
  {
    question: 'Are files stored on your servers?',
    answer: 'No. Files never touch our servers. We only provide signaling to establish direct P2P connections between browsers. Your files transfer directly from your device to the recipient\'s device.',
    icon: Shield,
    category: 'Security',
  },
  {
    question: 'Is the transfer encrypted?',
    answer: 'Yes. WebRTC provides end-to-end encryption for all P2P transfers. Files are encrypted during transit between browsers using industry-standard encryption protocols.',
    icon: Lock,
    category: 'Security',
  },
  {
    question: 'Do I need to create an account?',
    answer: 'No account required. Simply upload files and share the generated 6-digit code with recipients. We believe in anonymous, privacy-first file sharing.',
    icon: Users,
    category: 'Getting Started',
  },
  {
    question: 'What are the file size limits?',
    answer: 'File size limits depend on your browser and network connection. Most browsers handle files up to 2GB for P2P transfer. For larger files, consider splitting them into smaller chunks.',
    icon: Folder,
    category: 'Usage',
  },
  {
    question: 'How long do codes last?',
    answer: 'Codes expire automatically after 24 hours for security. Each code can only be used once. If a transfer fails, you\'ll need to generate a new code.',
    icon: Clock,
    category: 'Usage',
  },
  {
    question: 'What browsers are supported?',
    answer: 'QuickShare works on all modern browsers that support WebRTC, including Chrome, Firefox, Safari, and Edge. Mobile browsers are also supported.',
    icon: Globe,
    category: 'Compatibility',
  },
  {
    question: 'Can I transfer multiple files?',
    answer: 'Yes! You can select multiple files or entire folders. They\'ll be packaged together and transferred as a single bundle with one 6-digit code.',
    icon: Folder,
    category: 'Usage',
  },
  {
    question: 'What if the transfer fails?',
    answer: 'If a transfer fails due to network issues, simply generate a new code and try again. Make sure both devices have stable internet connections and aren\'t behind restrictive firewalls.',
    icon: AlertCircle,
    category: 'Troubleshooting',
  },
  {
    question: 'Is QuickShare free?',
    answer: 'Yes, QuickShare is completely free to use. We don\'t charge for file transfers, storage (since we don\'t store files), or any other features.',
    icon: DollarSign,
    category: 'Pricing',
  },
];

const categories = ['Getting Started', 'Security', 'Usage', 'Compatibility', 'Troubleshooting', 'Pricing'];

function FAQAccordionItem({ item, isOpen, onClick }: { item: FAQItem; isOpen: boolean; onClick: () => void }) {
  const Icon = item.icon;
  
  return (
    <div 
      className={`
        group relative overflow-hidden rounded-xl border transition-all duration-300
        ${isOpen 
          ? 'border-primary/30 bg-gradient-to-br from-primary/5 to-purple-500/5 shadow-lg shadow-primary/5' 
          : 'border-border/50 bg-card/50 hover:border-primary/20 hover:bg-muted/30'
        }
      `}
    >
      {/* Gradient overlay on hover */}
      <div className={`
        absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-purple-500/5 
        transition-opacity duration-300 pointer-events-none
        ${isOpen ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'}
      `} />
      
      <button
        onClick={onClick}
        className="relative w-full flex items-start gap-4 p-5 text-left"
      >
        <div className={`
          flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300
          ${isOpen 
            ? 'bg-gradient-to-br from-primary to-purple-600 text-white shadow-lg shadow-primary/25' 
            : 'bg-muted/80 text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary'
          }
        `}>
          <Icon className="w-5 h-5" />
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className={`
            font-semibold text-base transition-colors duration-200
            ${isOpen ? 'text-foreground' : 'text-foreground/90 group-hover:text-foreground'}
          `}>
            {item.question}
          </h3>
          
          <span className="text-xs text-muted-foreground mt-1 inline-block">
            {item.category}
          </span>
        </div>
        
        <div className={`
          flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center 
          bg-muted/50 transition-all duration-300 mt-1
          ${isOpen ? 'rotate-180 bg-primary/10' : 'group-hover:bg-primary/10'}
        `}>
          <ChevronDown className={`w-4 h-4 transition-colors ${isOpen ? 'text-primary' : 'text-muted-foreground'}`} />
        </div>
      </button>
      
      <div className={`
        overflow-hidden transition-all duration-300 ease-in-out
        ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}
      `}>
        <div className="relative px-5 pb-5 pl-[4.5rem]">
          <p className="text-muted-foreground leading-relaxed">
            {item.answer}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filteredFaqs = activeCategory 
    ? faqs.filter(faq => faq.category === activeCategory)
    : faqs;

  return (
    <div className="relative">
      {/* Hero Section with Animated Background */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-purple-500/5" />
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>
        
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center">
            {/* Icon */}
            <div className="inline-flex items-center justify-center w-20 h-20 mb-6 rounded-2xl bg-gradient-to-br from-primary to-purple-600 shadow-xl shadow-primary/25">
              <HelpCircle className="w-10 h-10 text-white" />
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-foreground via-foreground to-muted-foreground bg-clip-text">
              Frequently Asked Questions
            </h1>
            
            <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              Everything you need to know about QuickShare. Can&apos;t find what you&apos;re looking for? 
              Reach out to our team.
            </p>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="container mx-auto px-4 mb-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-wrap gap-2 justify-center">
            <button
              onClick={() => setActiveCategory(null)}
              className={`
                px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
                ${!activeCategory 
                  ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25' 
                  : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'
                }
              `}
            >
              All Questions
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category === activeCategory ? null : category)}
                className={`
                  px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
                  ${activeCategory === category 
                    ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25' 
                    : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'
                  }
                `}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ List */}
      <section className="container mx-auto px-4 pb-16">
        <div className="max-w-4xl mx-auto space-y-4">
          {filteredFaqs.map((faq, index) => (
            <FAQAccordionItem
              key={index}
              item={faq}
              isOpen={openIndex === faqs.indexOf(faq)}
              onClick={() => setOpenIndex(openIndex === faqs.indexOf(faq) ? null : faqs.indexOf(faq))}
            />
          ))}
        </div>
      </section>

      {/* Quick Stats */}
      <section className="container mx-auto px-4 pb-16">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Files Shared', value: '10M+', icon: Folder },
              { label: 'Happy Users', value: '500K+', icon: Users },
              { label: 'Countries', value: '150+', icon: Globe },
              { label: 'Uptime', value: '99.9%', icon: Zap },
            ].map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div 
                  key={index}
                  className="relative group p-5 rounded-xl bg-card/50 border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-purple-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative text-center">
                    <Icon className="w-6 h-6 text-primary mx-auto mb-2" />
                    <div className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                      {stat.value}
                    </div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 pb-16">
        <div className="max-w-4xl mx-auto">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary via-purple-600 to-primary bg-[length:200%_100%] animate-gradient p-8 md:p-12">
            {/* Overlay pattern */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtOS45NDEgMC0xOCA4LjA1OS0xOCAxOHM4LjA1OSAxOCAxOCAxOCAxOC04LjA1OSAxOC0xOC04LjA1OS0xOC0xOC0xOHptMCAzMmMtNy43MzIgMC0xNC02LjI2OC0xNC0xNHM2LjI2OC0xNCAxNC0xNCAxNCA2LjI2OCAxNCAxNC02LjI2OCAxNC0xNCAxNHoiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iLjA1Ii8+PC9nPjwvc3ZnPg==')] opacity-30" />
            
            <div className="relative flex flex-col md:flex-row items-center gap-6 text-white">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center">
                  <MessageCircle className="w-8 h-8" />
                </div>
              </div>
              
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-2xl md:text-3xl font-bold mb-2">
                  Still have questions?
                </h2>
                <p className="text-white/80 text-lg">
                  Our team is here to help. Reach out and we&apos;ll get back to you within 24 hours.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <a href="mailto:hello@quickshare.app">
                  <Button 
                    size="lg" 
                    className="bg-white text-primary hover:bg-white/90 font-semibold shadow-xl"
                  >
                    Contact Support
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </a>
                <Link href="/security">
                  <Button 
                    size="lg" 
                    variant="outline"
                    className="border-white/30 text-white hover:bg-white/10 font-semibold"
                  >
                    Security Docs
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