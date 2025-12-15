'use client';

import { useEffect } from 'react';

/**
 * Component to fix white flash issues on mobile
 * Ensures consistent dark theme application
 */
export function MobileThemeFix() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Force dark theme on mobile to prevent white flash
    const isMobile = window.innerWidth <= 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
      // Ensure html and body have dark background
      document.documentElement.style.backgroundColor = 'hsl(222.2 84% 4.9%)';
      document.body.style.backgroundColor = 'hsl(222.2 84% 4.9%)';
      document.body.style.color = 'hsl(210 40% 98%)';
      
      // Add mobile-theme-fixed class for additional CSS targeting
      document.documentElement.classList.add('mobile-theme-fixed');
      
      // Override any white backgrounds that might cause flash
      const style = document.createElement('style');
      style.textContent = `
        @media (max-width: 768px) {
          .mobile-theme-fixed * {
            background-color: inherit !important;
          }
          
          .mobile-theme-fixed .bg-white {
            background-color: hsl(222.2 84% 4.9%) !important;
            color: hsl(210 40% 98%) !important;
          }
          
          .mobile-theme-fixed .text-gray-700,
          .mobile-theme-fixed .text-gray-600 {
            color: hsl(215 20.2% 65.1%) !important;
          }
        }
      `;
      document.head.appendChild(style);
      
      return () => {
        document.head.removeChild(style);
        document.documentElement.classList.remove('mobile-theme-fixed');
      };
    }
  }, []);

  return null;
}