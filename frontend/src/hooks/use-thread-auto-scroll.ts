import { useEffect, useRef } from 'react';
import { useScrollIsolation } from './use-scroll-isolation';

/**
 * Hook for auto-scrolling the main thread viewport
 * Specifically designed for chat threads with streaming content
 */
export function useThreadAutoScroll() {
  const scrollStateRef = useRef({
    isScrolling: false,
    userInterrupted: false,
    lastMessageCount: 0
  });
  
  const { canChatScroll, isReasoningAnimating } = useScrollIsolation();

  useEffect(() => {
    const viewport = document.querySelector('[data-viewport="true"]') as HTMLElement;
    if (!viewport) return;

    const scrollState = scrollStateRef.current;

    const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
      if (scrollState.isScrolling || !canChatScroll()) return;
      
      scrollState.isScrolling = true;
      requestAnimationFrame(() => {
        if (viewport && !scrollState.userInterrupted && canChatScroll()) {
          viewport.scrollTo({
            top: viewport.scrollHeight,
            behavior
          });
        }
        scrollState.isScrolling = false;
      });
    };

    // Track user interaction to prevent unwanted auto-scroll
    const handleUserScroll = () => {
      if (scrollState.isScrolling) return;
      
      const threshold = 100; // pixels from bottom
      const { scrollTop, scrollHeight, clientHeight } = viewport;
      const isNearBottom = (scrollHeight - (scrollTop + clientHeight)) <= threshold;
      
      // Mark as interrupted if user scrolled up significantly
      scrollState.userInterrupted = !isNearBottom;
    };

    // Reset interruption when user scrolls back to bottom
    const handleScrollEnd = () => {
      setTimeout(() => {
        const { scrollTop, scrollHeight, clientHeight } = viewport;
        const isAtBottom = (scrollHeight - (scrollTop + clientHeight)) <= 10;
        if (isAtBottom) {
          scrollState.userInterrupted = false;
        }
      }, 100);
    };

    // Optimized observer for new messages or content changes
    let lastObserverTime = 0;
    const OBSERVER_THROTTLE_MS = 8; // ~120fps for mutations
    
    const observer = new MutationObserver((mutations) => {
      try {
        // Completely block auto-scroll during reasoning animations
        if (isReasoningAnimating()) {
          return;
        }
        
        const now = Date.now();
        if (now - lastObserverTime < OBSERVER_THROTTLE_MS) return;
        lastObserverTime = now;

        let shouldScroll = false;

        // Use a more efficient approach to check mutations
        for (const mutation of mutations) {
          // Skip mutations that are from reasoning components
          if (mutation.target && (mutation.target as Element).closest) {
            const target = mutation.target as Element;
            const isReasoningElement = target.closest('[data-reasoning]') || 
                                     target.closest('[role="status"]') ||
                                     target.closest('.reasoning-content');
            if (isReasoningElement) {
              continue; // Skip reasoning-related mutations
            }
          }
          
          // Check for new message elements
          if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
            // Quick check for message-related elements
            for (let i = 0; i < mutation.addedNodes.length; i++) {
              const node = mutation.addedNodes[i];
              if (node.nodeType === Node.ELEMENT_NODE) {
                const element = node as Element;
                // Skip reasoning elements
                if (element.hasAttribute('data-reasoning') || 
                    element.getAttribute('role') === 'status' ||
                    element.classList.contains('reasoning-content')) {
                  continue;
                }
                // Use more efficient selectors for message elements
                if (element.hasAttribute('data-role') || 
                    element.querySelector('[data-role]')) {
                  shouldScroll = true;
                  break;
                }
              }
            }
            if (shouldScroll) break;
          }
          
          // Check for text content changes in existing messages
          if (mutation.type === 'characterData' && mutation.target.textContent !== mutation.oldValue) {
            const target = mutation.target;
            let elementToCheck: Element | null = null;
            
            // Handle different node types safely
            try {
              if (target && target.nodeType === Node.ELEMENT_NODE) {
                elementToCheck = target as Element;
              } else if (target && target.nodeType === Node.TEXT_NODE) {
                elementToCheck = (target as Text).parentElement;
              }
              
              if (elementToCheck && elementToCheck.closest) {
                const isInMessage = elementToCheck.closest('[data-role]');
                if (isInMessage) {
                  shouldScroll = true;
                  break;
                }
              }
            } catch (error) {
              // Silently ignore errors from mutation observer edge cases
              console.debug('Thread auto-scroll: ignoring mutation observer error', error);
            }
          }
        }

        if (shouldScroll && !scrollState.userInterrupted && !isReasoningAnimating()) {
          scrollToBottom();
        }
      } catch (error) {
        // Fail silently but log in development
        console.debug('Thread auto-scroll: mutation observer error', error);
      }
    });

    observer.observe(viewport, {
      childList: true,
      subtree: true,
      characterData: true
    });

    // Add scroll listeners
    viewport.addEventListener('scroll', handleUserScroll, { passive: true });
    viewport.addEventListener('scrollend', handleScrollEnd, { passive: true });

    // Fallback for browsers that don't support scrollend
    let scrollTimeout: NodeJS.Timeout;
    const handleScrollWithTimeout = () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(handleScrollEnd, 150);
      handleUserScroll();
    };

    // Type-safe check for scrollend support
    const hasScrollEnd = 'onscrollend' in HTMLElement.prototype;
    if (!hasScrollEnd) {
      viewport.addEventListener('scroll', handleScrollWithTimeout, { passive: true });
    }

    // Initial scroll to bottom
    scrollToBottom('auto');

    return () => {
      observer.disconnect();
      viewport.removeEventListener('scroll', handleUserScroll);
      viewport.removeEventListener('scrollend', handleScrollEnd);
      viewport.removeEventListener('scroll', handleScrollWithTimeout);
      clearTimeout(scrollTimeout);
    };
  }, [canChatScroll]);

  return {
    /**
     * Force scroll to bottom
     */
    forceScrollToBottom: () => {
      scrollStateRef.current.userInterrupted = false;
      const viewport = document.querySelector('[data-viewport="true"]') as HTMLElement;
      if (viewport) {
        viewport.scrollTo({
          top: viewport.scrollHeight,
          behavior: 'smooth'
        });
      }
    },
    
    /**
     * Reset user interruption state
     */
    resetInterruption: () => {
      scrollStateRef.current.userInterrupted = false;
    }
  };
}