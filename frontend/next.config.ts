import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable compiler optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },

  // Performance optimizations
  poweredByHeader: false,
  
  // Image optimization
  images: {
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 86400, // 24 hours
  },

  experimental: {
    // Optimize package imports for faster compilation (Next.js 15 compatible)
    optimizePackageImports: [
      "@assistant-ui/react",
      "@assistant-ui/react-ai-sdk", 
      "@assistant-ui/react-markdown",
      "@radix-ui/react-dialog",
      "@radix-ui/react-label",
      "@radix-ui/react-select",
      "@radix-ui/react-separator",
      "@radix-ui/react-slot",
      "@radix-ui/react-tooltip",
      "lucide-react",
      "framer-motion",
      "class-variance-authority",
      "clsx",
      "tailwind-merge",
      "ogl", // Aurora WebGL library
    ],
    
  },

  // Production optimizations
  ...(process.env.NODE_ENV === "production" && {
    output: "standalone",
    compress: true,
    
    // Headers for better caching
    async headers() {
      return [
        {
          source: '/(.*)',
          headers: [
            {
              key: 'X-DNS-Prefetch-Control',
              value: 'on'
            },
            {
              key: 'Strict-Transport-Security',
              value: 'max-age=63072000; includeSubDomains; preload'
            },
            {
              key: 'X-Content-Type-Options',
              value: 'nosniff'
            },
            {
              key: 'X-Frame-Options',
              value: 'DENY'
            },
            {
              key: 'Referrer-Policy',
              value: 'origin-when-cross-origin'
            }
          ]
        },
        {
          source: '/favicon.svg',
          headers: [
            {
              key: 'Cache-Control',
              value: 'public, max-age=31536000, immutable'
            }
          ]
        }
      ];
    },
  }),
};

// Conditionally wrap with bundle analyzer
const withBundleAnalyzer = process.env.ANALYZE === 'true' 
  ? require('@next/bundle-analyzer')({
      enabled: true,
    })
  : (config: NextConfig) => config;

export default withBundleAnalyzer(nextConfig);
