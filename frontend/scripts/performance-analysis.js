#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Comprehensive performance analysis tool
 * Phân tích bundle size, performance, và đưa ra recommendations
 */

console.log('🚀 Cryage Performance Analysis Report\n');

// Check if build exists
const buildDir = path.join(process.cwd(), '.next');
if (!fs.existsSync(buildDir)) {
  console.log('❌ Build not found. Please run "bun run build" first.');
  process.exit(1);
}

// Analyze build manifest
function analyzeBuildManifest() {
  const manifestPath = path.join(buildDir, 'build-manifest.json');
  
  if (!fs.existsSync(manifestPath)) {
    console.log('⚠️  Build manifest not found');
    return;
  }

  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  
  console.log('📦 Bundle Analysis:');
  console.log(`   • Pages: ${Object.keys(manifest.pages).length}`);
  console.log(`   • Total static files: ${manifest.rootMainFiles?.length || 0}`);
  
  // Analyze pages
  const pages = manifest.pages;
  Object.keys(pages).forEach(page => {
    const chunks = pages[page];
    console.log(`   • ${page}: ${chunks.length} chunks`);
  });
  console.log();
}

// Analyze static files
function analyzeStaticFiles() {
  const staticDir = path.join(buildDir, 'static');
  if (!fs.existsSync(staticDir)) {
    console.log('⚠️  Static directory not found');
    return;
  }

  console.log('📁 Static Files Analysis:');
  
  const jsDir = path.join(staticDir, 'chunks');
  const cssDir = path.join(staticDir, 'css');
  
  let totalJSSize = 0;
  let totalCSSSize = 0;
  let jsFiles = 0;
  let cssFiles = 0;

  // Analyze JS chunks
  if (fs.existsSync(jsDir)) {
    const files = fs.readdirSync(jsDir);
    files.forEach(file => {
      if (file.endsWith('.js')) {
        const filePath = path.join(jsDir, file);
        const stats = fs.statSync(filePath);
        totalJSSize += stats.size;
        jsFiles++;
      }
    });
  }

  // Analyze CSS files
  if (fs.existsSync(cssDir)) {
    const files = fs.readdirSync(cssDir);
    files.forEach(file => {
      if (file.endsWith('.css')) {
        const filePath = path.join(cssDir, file);
        const stats = fs.statSync(filePath);
        totalCSSSize += stats.size;
        cssFiles++;
      }
    });
  }

  console.log(`   • JavaScript: ${jsFiles} files, ${formatBytes(totalJSSize)}`);
  console.log(`   • CSS: ${cssFiles} files, ${formatBytes(totalCSSSize)}`);
  console.log(`   • Total: ${formatBytes(totalJSSize + totalCSSSize)}`);
  console.log();

  return { totalJSSize, totalCSSSize, jsFiles, cssFiles };
}

// Performance recommendations
function performanceRecommendations(bundleStats) {
  console.log('💡 Performance Recommendations:');
  
  const recommendations = [];
  
  if (bundleStats.totalJSSize > 1024 * 1024) { // > 1MB
    recommendations.push('🚨 JavaScript bundle > 1MB - Consider more aggressive code splitting');
  } else if (bundleStats.totalJSSize > 512 * 1024) { // > 512KB
    recommendations.push('⚠️  JavaScript bundle > 512KB - Review dynamic imports');
  } else {
    recommendations.push('✅ JavaScript bundle size is good');
  }

  if (bundleStats.totalCSSSize > 100 * 1024) { // > 100KB
    recommendations.push('🎨 CSS bundle > 100KB - Consider CSS code splitting');
  } else {
    recommendations.push('✅ CSS bundle size is good');
  }

  if (bundleStats.jsFiles > 20) {
    recommendations.push('📦 Many JS chunks - This can increase network overhead');
  }

  recommendations.forEach(rec => console.log(`   ${rec}`));
  console.log();
}

// Check for common performance issues
function checkPerformanceIssues() {
  console.log('🔍 Performance Checks:');
  
  const checks = [
    {
      name: 'Next.js Image Optimization',
      check: () => {
        const nextConfigPath = path.join(process.cwd(), 'next.config.ts');
        if (fs.existsSync(nextConfigPath)) {
          const content = fs.readFileSync(nextConfigPath, 'utf8');
          return content.includes('images:') && content.includes('formats');
        }
        return false;
      },
      message: 'Image optimization configured'
    },
    {
      name: 'Bundle Analysis',
      check: () => {
        const packageJsonPath = path.join(process.cwd(), 'package.json');
        if (fs.existsSync(packageJsonPath)) {
          const content = fs.readFileSync(packageJsonPath, 'utf8');
          return content.includes('@next/bundle-analyzer');
        }
        return false;
      },
      message: 'Bundle analyzer available'
    },
    {
      name: 'Dynamic Imports',
      check: () => {
        const componentsDir = path.join(process.cwd(), 'components');
        if (fs.existsSync(componentsDir)) {
          const files = fs.readdirSync(componentsDir, { recursive: true });
          const jsFiles = files.filter(file => file.endsWith('.tsx') || file.endsWith('.ts'));
          
          let dynamicImports = 0;
          jsFiles.forEach(file => {
            const filePath = path.join(componentsDir, file);
            const content = fs.readFileSync(filePath, 'utf8');
            const matches = content.match(/dynamic\s*\(/g);
            if (matches) dynamicImports += matches.length;
          });
          
          return dynamicImports > 0;
        }
        return false;
      },
      message: 'Dynamic imports implemented'
    }
  ];

  checks.forEach(check => {
    const result = check.check();
    const icon = result ? '✅' : '❌';
    console.log(`   ${icon} ${check.message}`);
  });
  console.log();
}

// Show optimization tips
function showOptimizationTips() {
  console.log('🎯 Quick Optimization Tips:');
  console.log('   • Use "bun run dev" for fastest development (Turbopack)');
  console.log('   • Use "bun run build:analyze" to analyze bundle size');
  console.log('   • Monitor Web Vitals in browser DevTools');
  console.log('   • Use Next.js Image component for all images');
  console.log('   • Implement proper error boundaries');
  console.log('   • Use React.memo() for expensive components');
  console.log('   • Enable HTTP/2 Push for critical resources');
  console.log();
}

// Utility functions
function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

// Generate performance score
function generatePerformanceScore(bundleStats) {
  let score = 100;
  
  // Bundle size penalty
  if (bundleStats.totalJSSize > 1024 * 1024) score -= 30;
  else if (bundleStats.totalJSSize > 512 * 1024) score -= 15;
  
  if (bundleStats.totalCSSSize > 100 * 1024) score -= 10;
  
  // Too many chunks penalty
  if (bundleStats.jsFiles > 20) score -= 10;
  
  const grade = score >= 90 ? 'Excellent' : score >= 70 ? 'Good' : score >= 50 ? 'Fair' : 'Poor';
  
  console.log('🏆 Performance Score:');
  console.log(`   📊 Score: ${score}/100 (${grade})`);
  console.log(`   🎯 Target: Keep JavaScript < 512KB, CSS < 50KB for best performance`);
  console.log();
}

// Main execution
function main() {
  analyzeBuildManifest();
  const bundleStats = analyzeStaticFiles();
  
  if (bundleStats) {
    performanceRecommendations(bundleStats);
    generatePerformanceScore(bundleStats);
  }
  
  checkPerformanceIssues();
  showOptimizationTips();
  
  console.log('✨ Analysis complete! Run this script after each build to track improvements.');
}

main();
