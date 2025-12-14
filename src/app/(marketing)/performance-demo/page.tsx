'use client';

import { useState } from 'react';
import { OptimizedImage, useImagePriority } from '@/components/seo/ImagePriority';
import { usePerformanceOptimization } from '@/hooks/usePerformanceOptimization';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function PerformanceDemoPage() {
  const [metrics, setMetrics] = useState<any[]>([]);
  
  const { preloadImage, preloadImages } = useImagePriority({
    criticalImages: ['/hero-image.webp'],
    lazyLoadThreshold: 0.1,
    preloadStrategy: 'viewport',
    webpSupport: true,
    avifSupport: true,
  });

  const { 
    metrics: performanceMetrics, 
    performanceScore, 
    passesWebVitals,
    isOptimized 
  } = usePerformanceOptimization({
    reportWebVitals: true,
    preloadCriticalImages: ['/hero-image.webp', '/logo.svg'],
    preloadCriticalFonts: ['Inter'],
    prefetchRoutes: ['/use-cases/send-files-without-login'],
    lcpTarget: '.hero-image',
    onMetric: (metric) => {
      setMetrics(prev => [...prev, metric]);
      console.log('Performance metric:', metric);
    },
  });

  const handlePreloadImage = () => {
    preloadImage('/demo-image.jpg', 'high');
  };

  const handlePreloadMultiple = () => {
    preloadImages([
      '/image1.jpg',
      '/image2.jpg', 
      '/image3.jpg'
    ], 'low');
  };

  return (
    <main className="container mx-auto min-h-screen px-4 py-6 md:px-6 md:py-8">
      <div className="mx-auto max-w-4xl space-y-8">
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            Performance Optimization Demo
          </h1>
          <p className="text-muted-foreground mt-2">
            Demonstrating Core Web Vitals optimization, font preloading, and image priority system
          </p>
        </div>

        {/* Performance Metrics Display */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Core Web Vitals Metrics</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {performanceScore}
              </div>
              <div className="text-sm text-muted-foreground">Performance Score</div>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold ${passesWebVitals ? 'text-green-600' : 'text-red-600'}`}>
                {passesWebVitals ? '✓' : '✗'}
              </div>
              <div className="text-sm text-muted-foreground">Passes Web Vitals</div>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold ${isOptimized ? 'text-green-600' : 'text-orange-600'}`}>
                {isOptimized ? '✓' : '⏳'}
              </div>
              <div className="text-sm text-muted-foreground">Optimizations Applied</div>
            </div>
          </div>
          
          {/* Individual Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
            <div>
              <div className="font-medium">LCP</div>
              <div className="text-muted-foreground">
                {performanceMetrics.lcp ? `${performanceMetrics.lcp.toFixed(2)}s` : 'Measuring...'}
              </div>
            </div>
            <div>
              <div className="font-medium">CLS</div>
              <div className="text-muted-foreground">
                {performanceMetrics.cls ? performanceMetrics.cls.toFixed(3) : 'Measuring...'}
              </div>
            </div>
            <div>
              <div className="font-medium">FID</div>
              <div className="text-muted-foreground">
                {performanceMetrics.fid ? `${performanceMetrics.fid.toFixed(0)}ms` : 'Measuring...'}
              </div>
            </div>
            <div>
              <div className="font-medium">FCP</div>
              <div className="text-muted-foreground">
                {performanceMetrics.fcp ? `${performanceMetrics.fcp.toFixed(2)}s` : 'Measuring...'}
              </div>
            </div>
            <div>
              <div className="font-medium">TTFB</div>
              <div className="text-muted-foreground">
                {performanceMetrics.ttfb ? `${performanceMetrics.ttfb.toFixed(0)}ms` : 'Measuring...'}
              </div>
            </div>
          </div>
        </Card>

        {/* Image Priority System Demo */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Image Priority System</h2>
          <div className="space-y-4">
            <div className="flex gap-4">
              <Button onClick={handlePreloadImage}>
                Preload Single Image
              </Button>
              <Button onClick={handlePreloadMultiple} variant="outline">
                Preload Multiple Images
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium mb-2">High Priority Image (LCP candidate)</h3>
                <OptimizedImage
                  src="/hero-image.webp"
                  alt="Hero image with high priority"
                  width={300}
                  height={200}
                  priority="high"
                  criticalViewport={true}
                  className="hero-image rounded-lg border"
                />
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Lazy Loaded Image</h3>
                <OptimizedImage
                  src="/demo-image.jpg"
                  alt="Demo image with lazy loading"
                  width={300}
                  height={200}
                  priority="low"
                  loading="lazy"
                  placeholder="blur"
                  className="rounded-lg border"
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Font Preloading Demo */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Font Preloading Strategy</h2>
          <div className="space-y-4">
            <p className="text-muted-foreground">
              Critical fonts (Inter) are preloaded for faster rendering. 
              Font display is set to 'swap' to prevent invisible text during font load.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium mb-2">Inter Font (Preloaded)</h3>
                <p className="font-sans">
                  This text uses the Inter font family which is preloaded for optimal performance.
                  The font should render immediately without causing layout shift.
                </p>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">System Font Fallback</h3>
                <p style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                  This text uses system fonts as fallback, ensuring content is readable
                  even if custom fonts fail to load.
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Metrics Log */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Real-time Metrics Log</h2>
          <div className="max-h-64 overflow-y-auto space-y-2">
            {metrics.length === 0 ? (
              <p className="text-muted-foreground">Waiting for performance metrics...</p>
            ) : (
              metrics.map((metric, index) => (
                <div key={index} className="text-sm font-mono bg-muted p-2 rounded">
                  <span className="font-semibold">{metric.name}:</span> {metric.value.toFixed(2)}
                  {metric.name === 'CLS' ? '' : metric.name.includes('FID') ? 'ms' : 's'}
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </main>
  );
}