/**
 * Common Components Index
 * 
 * Centralized exports for common components to improve maintainability
 * and reduce import path complexity.
 */

export { PageTransitionWrapper } from "./page-transition-wrapper";
export { ErrorBoundary, useErrorHandler } from "./error-boundary";
export { Idle } from "./idle";
export { MotionDiv, Presence } from "./motion";
export { OptimizedImage } from "./optimized-image";

// Loading skeletons
export {
  ThreadLoadingSkeleton,
  DashboardLoadingSkeleton,
  SidebarLoadingSkeleton,
  ComponentLoadingSkeleton,
  AuroraLoadingSkeleton,
  SidebarContainerLoadingSkeleton
} from "./loading-skeletons";