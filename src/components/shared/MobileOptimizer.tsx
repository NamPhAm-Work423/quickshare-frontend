'use client';

import { useEffect } from 'react';
import { applyMobileOptimizations } from '@/lib/mobile-optimizations';

/**
 * Component to apply mobile performance optimizations
 * Runs on client-side to detect device capabilities and apply optimizations
 */
export function MobileOptimizer() {
  useEffect(() => {
    // Apply optimizations after component mounts
    applyMobileOptimizations();
    
    // Listen for orientation changes and reapply optimizations
    const handleOrientationChange = () => {
      setTimeout(() => {
        applyMobileOptimizations();
      }, 100);
    };
    
    window.addEventListener('orientationchange', handleOrientationChange);
    window.addEventListener('resize', handleOrientationChange);
    
    return () => {
      window.removeEventListener('orientationchange', handleOrientationChange);
      window.removeEventListener('resize', handleOrientationChange);
    };
  }, []);

  return null; // This component doesn't render anything
}