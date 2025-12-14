'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home, HelpCircle, Shield } from 'lucide-react';

const AppNavigation = () => {
  return (
    <nav className="flex items-center justify-center gap-4 py-4">
      <Link href="/">
        <Button variant="ghost" size="sm" className="gap-2">
          <Home className="w-4 h-4" />
          Home
        </Button>
      </Link>
      <Link href="/how-it-works">
        <Button variant="ghost" size="sm" className="gap-2">
          <HelpCircle className="w-4 h-4" />
          How it Works
        </Button>
      </Link>
      <Link href="/security">
        <Button variant="ghost" size="sm" className="gap-2">
          <Shield className="w-4 h-4" />
          Security
        </Button>
      </Link>
    </nav>
  );
};

export default AppNavigation;