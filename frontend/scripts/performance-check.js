#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔍 Running comprehensive performance analysis...\n');

// 1. Bundle Analysis
console.log('📦 Analyzing bundle size...');
try {
  execSync('bun run build:analyze', { stdio: 'inherit' });
  console.log('✅ Bundle analysis completed\n');
} catch (error) {
  console.error('❌ Bundle analysis failed:', error.message);
}

// 2. Check for duplicate dependencies
console.log('🔍 Checking for duplicate dependencies...');
try {
  const lockfile = fs.readFileSync(path.join(__dirname, '../bun.lock'), 'utf8');
  const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, '../package.json'), 'utf8'));
  
  // Check for common duplicates
  const potentialDuplicates = [
    'framer-motion', 'motion',
    'react', '@types/react',
    'lucide-react'
  ];
  
  const deps = Object.keys(packageJson.dependencies || {});
  const devDeps = Object.keys(packageJson.devDependencies || {});
  const allDeps = [...deps, ...devDeps];
  
  const duplicates = [];
  for (const dep of potentialDuplicates) {
    const matches = allDeps.filter(d => d.includes(dep.split('/').pop()));
    if (matches.length > 1) {
      duplicates.push({ pattern: dep, matches });
    }
  }
  
  if (duplicates.length > 0) {
    console.log('⚠️  Potential duplicate dependencies found:');
    duplicates.forEach(({ pattern, matches }) => {
      console.log(`   ${pattern}: ${matches.join(', ')}`);
    });
  } else {
    console.log('✅ No obvious duplicate dependencies found');
  }
} catch (error) {
  console.error('❌ Dependency check failed:', error.message);
}

// 3. Check bundle size recommendations
console.log('\n📊 Bundle size recommendations:');
console.log('   • Target: < 200KB First Load JS');
console.log('   • Current: Check .next/analyze/ reports');
console.log('   • Large dependencies to watch: framer-motion, @assistant-ui/react, ogl');

// 4. Performance tips
console.log('\n🚀 Performance optimization tips:');
console.log('   • Use dynamic imports for heavy components');
console.log('   • Implement code splitting at route level');
console.log('   • Optimize images (WebP/AVIF format)');
console.log('   • Use React.memo for expensive components');
console.log('   • Minimize "use client" directives');
console.log('   • Consider lazy loading for Aurora background');

console.log('\n✨ Performance analysis completed!');
