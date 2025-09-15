import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable compiler optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },

  // Enable bundle analyzer conditionally
  ...(process.env.ANALYZE === 'true' && {
    webpack: (config: any) => {
      if (typeof window === 'undefined') {
        // Server-side: Import bundle analyzer dynamically
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const { BundleAnalyzerPlugin } = require('@next/bundle-analyzer')();
        config.plugins = config.plugins || [];
        config.plugins.push(
          new BundleAnalyzerPlugin({
            analyzerMode: 'server',
            openAnalyzer: true,
          })
        );
      }
      return config;
    },
  }),

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
    ],
  },

  // Production optimizations
  ...(process.env.NODE_ENV === "production" && {
    output: "standalone",
  }),
};

export default nextConfig;
