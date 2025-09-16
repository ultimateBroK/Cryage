#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');

console.log('🔍 Analyzing bundle size...\n');

try {
  // Build the project with bundle analysis enabled
  console.log('📦 Building project with bundle analysis...');
  execSync('bun run build:analyze', { stdio: 'inherit' });
  
  console.log('\n✨ Bundle analysis completed successfully!');
  console.log('📋 Reports saved to .next/analyze/ directory');
  
} catch (error) {
  console.error('❌ Bundle analysis failed:', error.message);
  process.exit(1);
}
