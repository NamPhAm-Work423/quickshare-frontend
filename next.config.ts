import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: [],
  },
  // Allow cross-origin requests for development
  allowedDevOrigins: ['192.168.1.8'],
  // External packages for server components 
  serverExternalPackages: [],
  // Add cache control headers to prevent outdated versions on mobile
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate',
          },
          {
            key: 'Pragma',
            value: 'no-cache',
          },
          {
            key: 'Expires',
            value: '0',
          },
        ],
      },
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
  // Generate unique build IDs to force cache invalidation
  generateBuildId: async () => {
    return `build-${Date.now()}`;
  },
};

export default nextConfig;

