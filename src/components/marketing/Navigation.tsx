'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X, FileText, Shield, Zap, Calculator, QrCode, Hash } from 'lucide-react';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navigationItems = [
    {
      label: 'Use Cases',
      items: [
        { href: '/use-cases/send-files-without-login', label: 'Send Files Without Login', icon: FileText },
        { href: '/use-cases/p2p-file-transfer', label: 'P2P File Transfer', icon: Zap },
        { href: '/use-cases/secure-file-sharing', label: 'Secure File Sharing', icon: Shield },
        { href: '/use-cases/share-files-securely', label: 'Share Files Securely', icon: Shield },
      ]
    },
    {
      label: 'Tools',
      items: [
        { href: '/tools/file-size-calculator', label: 'File Size Calculator', icon: Calculator },
        { href: '/tools/checksum-generator', label: 'Checksum Generator', icon: Hash },
        { href: '/tools/qr-code-generator', label: 'QR Code Generator', icon: QrCode },
      ]
    },
    {
      label: 'Learn',
      items: [
        { href: '/blog/p2p-file-sharing', label: 'P2P File Sharing', icon: FileText },
        { href: '/blog/security', label: 'Security', icon: Shield },
        { href: '/blog/how-to', label: 'How-To Guides', icon: FileText },
      ]
    }
  ];

  return (
    <nav className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-xl">QuickShare</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigationItems.map((section) => (
              <div key={section.label} className="relative group">
                <button className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                  {section.label}
                </button>
                <div className="absolute top-full left-0 mt-2 w-64 bg-background border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="p-2">
                    {section.items.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="flex items-center space-x-3 px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors"
                        >
                          <Icon className="w-4 h-4 text-muted-foreground" />
                          <span>{item.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
            
            <div className="flex items-center space-x-4">
              <Link href="/how-it-works">
                <Button variant="ghost" size="sm">How it Works</Button>
              </Link>
              <Link href="/app">
                <Button size="sm">Start Sharing</Button>
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t">
            {navigationItems.map((section) => (
              <div key={section.label} className="mb-4">
                <h3 className="font-medium text-sm text-muted-foreground mb-2 px-2">
                  {section.label}
                </h3>
                {section.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex items-center space-x-3 px-2 py-2 text-sm rounded-md hover:bg-muted transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      <Icon className="w-4 h-4 text-muted-foreground" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            ))}
            <div className="pt-4 border-t space-y-2">
              <Link href="/how-it-works" onClick={() => setIsOpen(false)}>
                <Button variant="ghost" size="sm" className="w-full justify-start">
                  How it Works
                </Button>
              </Link>
              <Link href="/app" onClick={() => setIsOpen(false)}>
                <Button size="sm" className="w-full">
                  Start Sharing
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;