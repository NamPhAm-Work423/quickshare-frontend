import Link from 'next/link';
import { Zap } from 'lucide-react';

const MarketingFooter = () => {
  const footerSections = [
    {
      title: 'Product',
      links: [
        { href: '/use-cases/send-files-without-login', label: 'Send Files Without Login' },
        { href: '/use-cases/p2p-file-transfer', label: 'P2P File Transfer' },
        { href: '/use-cases/secure-file-sharing', label: 'Secure File Sharing' },
        { href: '/how-it-works', label: 'How it Works' },
      ]
    },
    {
      title: 'Tools',
      links: [
        { href: '/tools/file-size-calculator', label: 'File Size Calculator' },
        { href: '/tools/checksum-generator', label: 'Checksum Generator' },
        { href: '/tools/qr-code-generator', label: 'QR Code Generator' },
      ]
    },
    {
      title: 'Learn',
      links: [
        { href: '/blog/p2p-file-sharing', label: 'P2P File Sharing' },
        { href: '/blog/security', label: 'Security' },
        { href: '/blog/how-to', label: 'How-To Guides' },
        { href: '/faq', label: 'FAQ' },
      ]
    },
    {
      title: 'Company',
      links: [
        { href: '/privacy', label: 'Privacy Policy' },
        { href: '/terms', label: 'Terms of Service' },
        { href: '/security', label: 'Security' },
      ]
    }
  ];

  return (
    <footer className="bg-muted/50 border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-xl">QuickShare</span>
            </Link>
            <p className="text-sm text-muted-foreground mb-4">
              Send files instantly without login. Secure, fast, and private P2P file sharing.
            </p>
            <Link 
              href="/app" 
              className="inline-flex items-center text-sm font-medium text-primary hover:underline"
            >
              Start sharing files →
            </Link>
          </div>

          {/* Footer Links */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="font-semibold text-sm mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link 
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            © 2024 QuickShare. All rights reserved.
          </p>
          <div className="flex items-center space-x-6 mt-4 md:mt-0">
            <Link 
              href="/privacy" 
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Privacy
            </Link>
            <Link 
              href="/terms" 
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Terms
            </Link>
            <Link 
              href="/security" 
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Security
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default MarketingFooter;