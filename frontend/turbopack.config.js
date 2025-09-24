/**
 * Turbopack configuration for ultra-fast development builds
 * This config optimizes Turbopack for sub-8 second compilation times
 */

module.exports = {
  // Optimize resolve for faster module loading
  resolve: {
    alias: {
      '@': './src',
      '@/components': './src/components',
      '@/lib': './src/lib',
      '@/utils': './src/utils',
      '@/types': './src/types',
    },
    // Prioritize main fields for faster resolution
    mainFields: ['browser', 'module', 'main'],
    // Cache module resolution
    symlinks: false,
  },

  // Loader optimizations
  loaders: {
    // Optimize SVG loading
    '*.svg': {
      loader: '@svgr/webpack',
      options: {
        memo: true,
        svgo: false, // Skip SVGO for faster processing
      },
    },
    // Fast TypeScript compilation
    '*.ts': {
      loader: 'swc-loader',
      options: {
        jsc: {
          parser: {
            syntax: 'typescript',
            tsx: true,
          },
          target: 'es2022',
          loose: true,
          externalHelpers: false,
        },
        module: {
          type: 'es6',
        },
      },
    },
    '*.tsx': {
      loader: 'swc-loader',
      options: {
        jsc: {
          parser: {
            syntax: 'typescript',
            tsx: true,
          },
          transform: {
            react: {
              runtime: 'automatic',
              development: true,
              refresh: true,
            },
          },
          target: 'es2022',
          loose: true,
          externalHelpers: false,
        },
        module: {
          type: 'es6',
        },
      },
    },
  },

  // Module rules for optimal processing
  rules: {
    // Fast CSS processing (skip PostCSS for dev)
    '*.css': {
      loaders: ['style-loader', 'css-loader'],
    },
    // Optimize image loading
    '*.{png,jpg,jpeg,gif,webp,avif}': {
      loader: 'next-image-loader',
      options: {
        isServer: false,
      },
    },
  },

  // Experimental features for speed
  experimental: {
    // Enable faster CSS processing
    turboCss: true,
    // Faster bundle analysis
    turboTrace: true,
    // Skip unnecessary plugins in dev
    minimalMode: true,
  },

  // Memory optimizations
  memory: {
    // Limit memory usage for faster GC
    maxMemory: 1024, // 1GB limit
    // Aggressive garbage collection
    gcLevel: 2,
  },

  // Cache configuration
  cache: {
    // Use filesystem cache
    type: 'filesystem',
    // Cache location
    cacheDirectory: '.next/cache/turbopack',
    // Cache max age
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    // Compression
    compression: 'gzip',
  },
};