import type { NextConfig } from "next";

const baseConfig: NextConfig = {
  // Tối ưu trình biên dịch (SWC) - thêm các options để compile nhanh hơn
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
    // Loại bỏ React DevTools trong production
    reactRemoveProperties: process.env.NODE_ENV === "production",
    // Minify CSS trong JS
    styledComponents: true,
  },

  // Tắt x-powered-by header
  poweredByHeader: false,
  
  // Development optimizations for faster compilation
  ...(process.env.NODE_ENV === "development" && {
    eslint: {
      ignoreDuringBuilds: true,
    },
  }),

  // Tối ưu ảnh: ưu tiên AVIF, sau đó WebP; cân nhắc TTL theo đặc thù dữ liệu
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 86400, // 24h
    // Thêm domains cho external images nếu cần
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placekitten.com',
      },
    ],
    // Tối ưu kích thước ảnh
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // SWC minification is enabled by default in Next.js 15
  
  // Turbopack configuration (moved from experimental.turbo)
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
    resolveAlias: {
      '@': './src',
    },
  },
  
  // Tối ưu TypeScript checking
  typescript: {
    // Bỏ qua type checking trong build để nhanh hơn (kiểm tra riêng bằng IDE)
    ignoreBuildErrors: false,
  },

  experimental: {
    // Tối ưu tree-shaking cho các package lớn
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
      "@radix-ui/react-switch",
      "@radix-ui/react-tabs",
      "framer-motion",
      "lucide-react", // Thêm lại để tối ưu tree-shaking icons
      "class-variance-authority",
      "clsx",
      "tailwind-merge",
      "ogl",
    ],
    
    // Tối ưu CSS loading (tạm tắt vì cần critters package)
    // optimizeCss: process.env.NODE_ENV === "production",
    
    // Precompile React Server Components
    ppr: false, // Tạm tắt PPR vì còn experimental
    
    // Tối ưu font loading  
    optimizeServerReact: true,
    
    // Development-only optimizations
    ...(process.env.NODE_ENV === 'development' && {
      webpackBuildWorker: true,
    }),
  },
};

const nextConfig: NextConfig = {
  ...baseConfig,


  // Chỉ áp dụng webpack config cho production build
  ...(process.env.NODE_ENV === "production" && {
    webpack: (config: any, { dev, isServer }: any) => {
      // Tối ưu bundle splitting cho production
      if (!dev && !isServer) {
        // Cấu hình chi tiết cho splitChunks
        config.optimization.splitChunks = {
          chunks: 'all',
          minSize: 20000,
          maxSize: 244000,
          cacheGroups: {
            ...config.optimization.splitChunks.cacheGroups,
            
            // Framework code (React, Next.js)
            framework: {
              name: 'framework',
              test: /[\\/]node_modules[\\/](react|react-dom|next|scheduler)[\\/]/,
              priority: 40,
              enforce: true,
            },
            
            // UI Libraries
            ui: {
              name: 'ui-libs',
              test: /[\\/]node_modules[\\/](@radix-ui|@assistant-ui)[\\/]/,
              priority: 30,
              chunks: 'all',
            },
            
            // Animation libraries (nặng, tách riêng)
            animations: {
              name: "animations",
              test: /[\\/]node_modules[\\/](framer-motion|ogl)[\\/]/,
              priority: 25,
              chunks: "all",
            },
            
            // Utils (nhẹ, có thể gộp)
            utils: {
              name: 'utils',
              test: /[\\/]node_modules[\\/](clsx|tailwind-merge|class-variance-authority)[\\/]/,
              priority: 20,
              chunks: 'all',
            },
            
            // Icons (tree-shakable)
            icons: {
              name: 'icons',
              test: /[\\/]node_modules[\\/]lucide-react[\\/]/,
              priority: 15,
              chunks: 'all',
            },
            
            // AI SDK và related
            ai: {
              name: 'ai-sdk',
              test: /[\\/]node_modules[\\/](@ai-sdk|ai)[\\/]/,
              priority: 10,
              chunks: 'all',
            },
            
            // Default vendor chunk cho phần còn lại
            vendor: {
              name: 'vendor',
              test: /[\\/]node_modules[\\/]/,
              priority: 5,
              chunks: 'all',
              minChunks: 2,
            },
          },
        };
        
        // Tối ưu module concatenation
        config.optimization.concatenateModules = true;
        
        // Tree shaking optimization  
        config.optimization.usedExports = true;
        config.optimization.sideEffects = false;
      }
      
      // Alias để import nhanh hơn
      config.resolve.alias = {
        ...config.resolve.alias,
        '@': process.cwd(),
      };
      
      return config;
    },

    // Tối ưu cho container/Docker
    output: "standalone",
    compress: true,

    // Security & caching headers với performance optimization
    async headers() {
      return [
        {
          source: "/(.*)",
          headers: [
            // DNS & Performance optimizations
            { key: "X-DNS-Prefetch-Control", value: "on" },
            
            // Security headers
            { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
            { key: "X-Content-Type-Options", value: "nosniff" },
            { key: "X-Frame-Options", value: "DENY" },
            { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
            
            // CSP tùy biến cho crypto app
            { key: "Content-Security-Policy", value: "default-src 'self'; img-src 'self' data: https: placekitten.com; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; connect-src 'self' https: wss:; font-src 'self' data:;" },
            
            // Permissions policy
            { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
          ],
        },
        
        // Static assets caching - images, fonts, etc.
        {
          source: "/favicon.svg",
          headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
        },
        {
          source: "/:path*\\.(ico|png|jpg|jpeg|gif|webp|avif|svg)",
          headers: [
            { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
            { key: "Vary", value: "Accept, Accept-Encoding" },
          ],
        },
        
        // JavaScript và CSS chunks
        {
          source: "/_next/static/(.*)",
          headers: [
            { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
            { key: "Vary", value: "Accept-Encoding" },
          ],
        },
        
        // API routes caching
        {
          source: "/api/(.*)",
          headers: [
            { key: "Cache-Control", value: "no-cache, no-store, must-revalidate" },
            { key: "Pragma", value: "no-cache" },
            { key: "Expires", value: "0" },
          ],
        },
      ];
    },
    
    // Redirects để optimize SEO
    async redirects() {
      return [
        // Add redirects nếu cần
      ];
    },
    
    // Rewrites cho API optimization
    async rewrites() {
      return [
        // Add rewrites nếu cần optimize API calls
      ];
    },
  }),
};

const withBundleAnalyzer =
  process.env.ANALYZE === "true"
    ? require("@next/bundle-analyzer")({ enabled: true })
    : (config: NextConfig) => config;

export default withBundleAnalyzer(nextConfig);
