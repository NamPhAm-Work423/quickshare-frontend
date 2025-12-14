'use client';

import Image, { ImageProps } from 'next/image';
import { useEffect, useRef, useState } from 'react';

export interface OptimizedImageProps extends Omit<ImageProps, 'priority' | 'placeholder' | 'loading'> {
  priority?: 'high' | 'low' | 'auto';
  loading?: 'eager' | 'lazy' | 'auto';
  fetchPriority?: 'high' | 'low' | 'auto';
  preload?: boolean;
  criticalViewport?: boolean; // Whether image is in critical viewport
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
}

export interface ImagePriorityConfig {
  criticalImages: string[];      // Images that should load with high priority
  lazyLoadThreshold: number;     // Intersection threshold for lazy loading
  preloadStrategy: 'viewport' | 'intent' | 'immediate';
  webpSupport: boolean;
  avifSupport: boolean;
}

const defaultConfig: ImagePriorityConfig = {
  criticalImages: [],
  lazyLoadThreshold: 0.1,
  preloadStrategy: 'viewport',
  webpSupport: true,
  avifSupport: true,
};

export function OptimizedImage({
  src,
  alt,
  priority = 'auto',
  loading = 'auto',
  fetchPriority = 'auto',
  preload = false,
  criticalViewport = false,
  placeholder,
  blurDataURL,
  className,
  ...props
}: OptimizedImageProps) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [shouldLoad, setShouldLoad] = useState(criticalViewport || priority === 'high');
  const imgRef = useRef<HTMLDivElement>(null);

  // Determine actual loading strategy
  const actualLoading = loading === 'auto' 
    ? (criticalViewport || priority === 'high' ? 'eager' : 'lazy')
    : loading;

  const actualPriority = priority === 'auto'
    ? criticalViewport
    : priority === 'high';

  const actualFetchPriority = fetchPriority === 'auto'
    ? (criticalViewport || priority === 'high' ? 'high' : 'low')
    : fetchPriority;

  // Intersection Observer for lazy loading optimization
  useEffect(() => {
    if (actualLoading === 'eager' || shouldLoad) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true);
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '50px', // Start loading 50px before entering viewport
        threshold: 0.1,
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [actualLoading, shouldLoad]);

  // Preload critical images
  useEffect(() => {
    if (preload && typeof window !== 'undefined') {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = typeof src === 'string' ? src : (src as any).src || src.toString();
      link.as = 'image';
      if (actualFetchPriority === 'high') {
        link.setAttribute('fetchpriority', 'high');
      }
      document.head.appendChild(link);

      return () => {
        if (document.head.contains(link)) {
          document.head.removeChild(link);
        }
      };
    }
  }, [preload, src, actualFetchPriority]);

  // Generate optimized blur placeholder
  const generateBlurDataURL = (width: number = 10, height: number = 10): string => {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      // Create a simple gradient blur effect
      const gradient = ctx.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, '#f3f4f6');
      gradient.addColorStop(1, '#e5e7eb');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
    }
    
    return canvas.toDataURL();
  };

  const actualBlurDataURL = blurDataURL || 
    (placeholder === 'blur' && typeof window !== 'undefined' 
      ? generateBlurDataURL() 
      : undefined);
      
  const nextPlaceholder = placeholder === 'blur' && actualBlurDataURL ? 'blur' : 'empty';

  return (
    <div ref={imgRef} className={className}>
      {shouldLoad ? (
        <Image
          src={src}
          alt={alt}
          priority={actualPriority}
          loading={actualLoading}
          placeholder={nextPlaceholder}
          blurDataURL={actualBlurDataURL}
          {...props}
          style={{
            ...props.style,
            // @ts-ignore - fetchPriority is not in Next.js types yet but supported
            fetchPriority: actualFetchPriority,
          }}
        />
      ) : (
        // Placeholder while waiting for intersection
        <div 
          style={{ 
            width: props.width, 
            height: props.height,
            backgroundColor: '#f3f4f6',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#9ca3af',
            fontSize: '14px',
          }}
        >
          Loading...
        </div>
      )}
    </div>
  );
}

// Image preloading utility
export class ImagePreloader {
  private static instance: ImagePreloader;
  private preloadedImages: Set<string> = new Set();
  private config: ImagePriorityConfig;

  constructor(config: Partial<ImagePriorityConfig> = {}) {
    this.config = { ...defaultConfig, ...config };
  }

  static getInstance(config?: Partial<ImagePriorityConfig>): ImagePreloader {
    if (!ImagePreloader.instance) {
      ImagePreloader.instance = new ImagePreloader(config);
    }
    return ImagePreloader.instance;
  }

  preloadImage(src: string, priority: 'high' | 'low' = 'low'): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.preloadedImages.has(src)) {
        resolve();
        return;
      }

      const img = new globalThis.Image();
      
      img.onload = () => {
        this.preloadedImages.add(src);
        resolve();
      };
      
      img.onerror = () => {
        reject(new Error(`Failed to preload image: ${src}`));
      };

      // Set fetch priority if supported
      if ('fetchPriority' in img) {
        (img as any).fetchPriority = priority;
      }

      img.src = src;
    });
  }

  preloadImages(sources: string[], priority: 'high' | 'low' = 'low'): Promise<void[]> {
    return Promise.all(sources.map(src => this.preloadImage(src, priority)));
  }

  preloadCriticalImages(): Promise<void[]> {
    return this.preloadImages(this.config.criticalImages, 'high');
  }

  isPreloaded(src: string): boolean {
    return this.preloadedImages.has(src);
  }

  clearCache(): void {
    this.preloadedImages.clear();
  }
}

// Hook for image priority management
export function useImagePriority(config?: Partial<ImagePriorityConfig>) {
  const [preloader] = useState(() => ImagePreloader.getInstance(config));

  const preloadImage = (src: string, priority?: 'high' | 'low') => {
    return preloader.preloadImage(src, priority);
  };

  const preloadImages = (sources: string[], priority?: 'high' | 'low') => {
    return preloader.preloadImages(sources, priority);
  };

  const preloadCriticalImages = () => {
    return preloader.preloadCriticalImages();
  };

  return {
    preloadImage,
    preloadImages,
    preloadCriticalImages,
    isPreloaded: preloader.isPreloaded.bind(preloader),
  };
}

export default OptimizedImage;