"use client";

import { useEffect, useCallback, useState } from 'react';

interface PerformanceMetrics {
  loadTime: number;
  firstContentfulPaint: number | null;
  largestContentfulPaint: number | null;
  firstInputDelay: number | null;
  cumulativeLayoutShift: number | null;
  timeToInteractive: number | null;
}

/**
 * Hook để monitor Web Vitals và performance metrics
 * Giúp tối ưu performance dựa trên dữ liệu thực tế
 */
export function usePerformance() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    loadTime: 0,
    firstContentfulPaint: null,
    largestContentfulPaint: null,
    firstInputDelay: null,
    cumulativeLayoutShift: null,
    timeToInteractive: null,
  });

  const [isLoading, setIsLoading] = useState(true);

  // Measure Core Web Vitals
  const measureWebVitals = useCallback(() => {
    if (typeof window === 'undefined') return;

    // Basic load time
    const navigationTiming = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (navigationTiming) {
      const loadTime = navigationTiming.loadEventEnd - navigationTiming.fetchStart;
      setMetrics(prev => ({ ...prev, loadTime }));
    }

    // Web Vitals using Performance Observer
    if ('PerformanceObserver' in window) {
      // First Contentful Paint (FCP)
      try {
        const fcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const fcpEntry = entries.find(entry => entry.name === 'first-contentful-paint');
          if (fcpEntry) {
            setMetrics(prev => ({ ...prev, firstContentfulPaint: fcpEntry.startTime }));
            fcpObserver.disconnect();
          }
        });
        fcpObserver.observe({ entryTypes: ['paint'] });
      } catch {
        console.warn('FCP measurement not supported');
      }

      // Largest Contentful Paint (LCP)
      try {
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          if (lastEntry) {
            setMetrics(prev => ({ ...prev, largestContentfulPaint: lastEntry.startTime }));
          }
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      } catch {
        console.warn('LCP measurement not supported');
      }

      // First Input Delay (FID)
      try {
        const fidObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries() as (PerformanceEntry & { processingStart?: number })[];
          entries.forEach((entry) => {
            if (entry.processingStart && entry.startTime) {
              const fid = entry.processingStart - entry.startTime;
              setMetrics(prev => ({ ...prev, firstInputDelay: fid }));
            }
          });
        });
        fidObserver.observe({ entryTypes: ['first-input'] });
      } catch {
        console.warn('FID measurement not supported');
      }

      // Cumulative Layout Shift (CLS)
      try {
        let clsValue = 0;
        const clsObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries() as (PerformanceEntry & { 
            value?: number; 
            size?: number; 
            hadRecentInput?: boolean;
            processingStart?: number;
          })[]
          entries.forEach((entry) => {
            if (!entry.hadRecentInput && entry.value) {
              clsValue += entry.value;
            }
          });
          setMetrics(prev => ({ ...prev, cumulativeLayoutShift: clsValue }));
        });
        clsObserver.observe({ entryTypes: ['layout-shift'] });
      } catch {
        console.warn('CLS measurement not supported');
      }
    }

    setIsLoading(false);
  }, []);

  // Log performance metrics (development only)
  const logMetrics = useCallback(() => {
    if (process.env.NODE_ENV === 'development') {
      console.group('🚀 Performance Metrics');
      console.log('Load Time:', `${metrics.loadTime.toFixed(2)}ms`);
      console.log('First Contentful Paint:', metrics.firstContentfulPaint ? `${metrics.firstContentfulPaint.toFixed(2)}ms` : 'N/A');
      console.log('Largest Contentful Paint:', metrics.largestContentfulPaint ? `${metrics.largestContentfulPaint.toFixed(2)}ms` : 'N/A');
      console.log('First Input Delay:', metrics.firstInputDelay ? `${metrics.firstInputDelay.toFixed(2)}ms` : 'N/A');
      console.log('Cumulative Layout Shift:', metrics.cumulativeLayoutShift ? metrics.cumulativeLayoutShift.toFixed(4) : 'N/A');
      console.groupEnd();
      
      // Performance score
      const score = calculatePerformanceScore(metrics);
      console.log(`📊 Performance Score: ${score.score}/100 (${score.grade})`);
    }
  }, [metrics]);

  // Get performance recommendations
  const getRecommendations = useCallback(() => {
    const recommendations: string[] = [];

    if (metrics.loadTime > 3000) {
      recommendations.push('🐌 Load time > 3s - Consider code splitting and lazy loading');
    }

    if (metrics.firstContentfulPaint && metrics.firstContentfulPaint > 1800) {
      recommendations.push('🎨 FCP > 1.8s - Optimize critical resources and inline critical CSS');
    }

    if (metrics.largestContentfulPaint && metrics.largestContentfulPaint > 2500) {
      recommendations.push('📏 LCP > 2.5s - Optimize images and reduce server response time');
    }

    if (metrics.firstInputDelay && metrics.firstInputDelay > 100) {
      recommendations.push('⌨️  FID > 100ms - Reduce JavaScript execution time');
    }

    if (metrics.cumulativeLayoutShift && metrics.cumulativeLayoutShift > 0.1) {
      recommendations.push('📐 CLS > 0.1 - Add size attributes to images and avoid dynamic content');
    }

    return recommendations;
  }, [metrics]);

  useEffect(() => {
    // Đo performance sau khi page load
    if (document.readyState === 'complete') {
      measureWebVitals();
    } else {
      window.addEventListener('load', measureWebVitals);
      return () => window.removeEventListener('load', measureWebVitals);
    }
  }, [measureWebVitals]);

  return {
    metrics,
    isLoading,
    logMetrics,
    getRecommendations,
  };
}

// Calculate performance score based on Web Vitals
function calculatePerformanceScore(metrics: PerformanceMetrics): { score: number; grade: string } {
  let score = 100;

  // Load time scoring
  if (metrics.loadTime > 5000) score -= 30;
  else if (metrics.loadTime > 3000) score -= 15;
  else if (metrics.loadTime > 1000) score -= 5;

  // FCP scoring
  if (metrics.firstContentfulPaint) {
    if (metrics.firstContentfulPaint > 3000) score -= 25;
    else if (metrics.firstContentfulPaint > 1800) score -= 10;
  }

  // LCP scoring
  if (metrics.largestContentfulPaint) {
    if (metrics.largestContentfulPaint > 4000) score -= 25;
    else if (metrics.largestContentfulPaint > 2500) score -= 10;
  }

  // FID scoring
  if (metrics.firstInputDelay) {
    if (metrics.firstInputDelay > 300) score -= 15;
    else if (metrics.firstInputDelay > 100) score -= 5;
  }

  // CLS scoring
  if (metrics.cumulativeLayoutShift) {
    if (metrics.cumulativeLayoutShift > 0.25) score -= 15;
    else if (metrics.cumulativeLayoutShift > 0.1) score -= 5;
  }

  const grade = score >= 90 ? 'Excellent' : score >= 70 ? 'Good' : score >= 50 ? 'Needs Improvement' : 'Poor';

  return { score: Math.max(0, score), grade };
}
