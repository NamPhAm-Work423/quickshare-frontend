/**
 * Mobile performance optimizations
 * Detects mobile devices and applies performance-focused settings
 */

export function isMobileDevice(): boolean {
  if (typeof window === 'undefined') return false;
  
  return (
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
    window.innerWidth <= 768 ||
    'ontouchstart' in window
  );
}

export function isLowPerformanceDevice(): boolean {
  if (typeof window === 'undefined') return false;
  
  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  // Check for low-end device indicators
  const isLowMemory = (navigator as any).deviceMemory && (navigator as any).deviceMemory <= 2;
  const isSlowConnection = (navigator as any).connection && 
    ((navigator as any).connection.effectiveType === 'slow-2g' || 
     (navigator as any).connection.effectiveType === '2g');
  
  return prefersReducedMotion || isLowMemory || isSlowConnection || isMobileDevice();
}

/**
 * Apply mobile-specific CSS classes to disable animations
 */
export function applyMobileOptimizations(): void {
  if (typeof window === 'undefined') return;
  
  const shouldOptimize = isLowPerformanceDevice();
  
  if (shouldOptimize) {
    document.documentElement.classList.add('mobile-optimized');
    
    // Disable smooth scrolling
    document.documentElement.style.scrollBehavior = 'auto';
    
    // Add meta tag to prevent zoom on input focus (iOS)
    const viewport = document.querySelector('meta[name="viewport"]');
    if (viewport && isMobileDevice()) {
      viewport.setAttribute('content', 
        'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no'
      );
    }
  }
}

/**
 * Conditional class names for animations
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function animateClass(animationClass: string, fallbackClass: string = ''): string {
  if (typeof window !== 'undefined' && isLowPerformanceDevice()) {
    return fallbackClass;
  }
  return animationClass;
}

/**
 * Hook to get mobile optimization status
 */
export function useMobileOptimization() {
  if (typeof window === 'undefined') {
    return { isMobile: false, shouldOptimize: false };
  }
  
  const isMobile = isMobileDevice();
  const shouldOptimize = isLowPerformanceDevice();
  
  return { isMobile, shouldOptimize };
}