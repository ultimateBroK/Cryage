/**
 * Gentle scroll prevention utilities
 * Prevents unwanted auto-scroll without causing visual shaking
 */

let gentlePreventionActive = false;
let savedScrollPosition = 0;
let viewportElement: HTMLElement | null = null;
let restoreTimer: NodeJS.Timeout | null = null;

/**
 * Gentle scroll prevention that avoids window shaking
 * Only prevents significant scroll changes, allows minor adjustments
 */
export function preventScrollGently(duration: number = 400): () => void {
  if (gentlePreventionActive) return () => {}; // Already active
  
  const viewport = document.querySelector('[data-viewport="true"]') as HTMLElement;
  if (!viewport) return () => {};
  
  viewportElement = viewport;
  savedScrollPosition = viewport.scrollTop;
  gentlePreventionActive = true;
  
  // Don't apply CSS class to avoid visual shaking - rely only on JS
  
  // Use a more gentle approach with mutation observer instead of aggressive event blocking
  const observer = new MutationObserver(() => {
    if (!gentlePreventionActive || !viewportElement) return;
    
    // Only restore if scroll changed significantly (more than 20px)
    const currentScroll = viewportElement.scrollTop;
    const scrollDiff = Math.abs(currentScroll - savedScrollPosition);
    
    if (scrollDiff > 20) {
      // Use smooth restoration to avoid jarring
      requestAnimationFrame(() => {
        if (viewportElement && gentlePreventionActive) {
          viewportElement.scrollTo({
            top: savedScrollPosition,
            behavior: 'auto' // Instant to prevent animation conflicts
          });
        }
      });
    }
  });
  
  // Monitor the viewport for changes
  observer.observe(viewport, {
    childList: true,
    subtree: true,
    attributes: false
  });
  
  // Light touch event prevention - only for direct viewport interaction
  const lightPreventScroll = (e: Event) => {
    if (e.target === viewportElement || viewportElement?.contains(e.target as Node)) {
      // Allow small scroll adjustments, prevent only large changes
      if (e.type === 'wheel') {
        const wheelEvent = e as WheelEvent;
        if (Math.abs(wheelEvent.deltaY) > 100) { // Only prevent large wheel movements
          e.preventDefault();
        }
      }
    }
  };
  
  viewport.addEventListener('wheel', lightPreventScroll, { passive: false });
  
  // Auto-cleanup
  const cleanup = () => {
    gentlePreventionActive = false;
    observer.disconnect();
    if (viewport) {
      viewport.removeEventListener('wheel', lightPreventScroll);
    }
    if (restoreTimer) {
      clearTimeout(restoreTimer);
      restoreTimer = null;
    }
    viewportElement = null;
  };
  
  restoreTimer = setTimeout(cleanup, duration);
  
  return cleanup;
}

/**
 * Check if gentle prevention is active
 */
export function isGentlyPrevented(): boolean {
  return gentlePreventionActive;
}

/**
 * Force cleanup gentle prevention
 */
export function forceCleanupGentlePrevention(): void {
  if (restoreTimer) {
    clearTimeout(restoreTimer);
    restoreTimer = null;
  }
  gentlePreventionActive = false;
  viewportElement = null;
}