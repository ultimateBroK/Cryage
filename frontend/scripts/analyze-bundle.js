#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');

console.log('🔍 Analyzing bundle size...\n');

try {
  // Build the project first
  console.log('📦 Building project...');
  execSync('bun run build', { stdio: 'pipe' });
  
  // Analyze bundle
  console.log('📊 Analyzing bundle...');
  execSync('bunx @next/bundle-analyzer', { stdio: 'inherit' });
  
} catch (error) {
  console.error('❌ Bundle analysis failed:', error.message);
  process.exit(1);
}
