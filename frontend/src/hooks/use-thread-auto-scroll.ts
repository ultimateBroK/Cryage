import { useEffect, useRef } from 'react';

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

  useEffect(() => {
    const viewport = document.querySelector('[data-viewport="true"]') as HTMLElement;
    if (!viewport) return;

    const scrollState = scrollStateRef.current;

    const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
      if (scrollState.isScrolling) return;
      
      scrollState.isScrolling = true;
      requestAnimationFrame(() => {
        if (viewport && !scrollState.userInterrupted) {
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

    // Observer for new messages or content changes
    const observer = new MutationObserver((mutations) => {
      try {
        let shouldScroll = false;

        mutations.forEach((mutation) => {
          // Check for new message elements
          if (mutation.type === 'childList') {
            const addedElements = Array.from(mutation.addedNodes).filter(
              node => node.nodeType === Node.ELEMENT_NODE
            ) as Element[];
            
            // Look for message containers or reasoning panels
            const hasNewMessage = addedElements.some(element => {
              try {
                return element.matches('[data-role="assistant"], [data-role="user"]') ||
                       element.querySelector('[data-role="assistant"], [data-role="user"]') ||
                       element.matches('[data-role="reasoning"]') ||
                       element.querySelector('[data-role="reasoning"]');
              } catch {
                return false;
              }
            });

            if (hasNewMessage) {
              shouldScroll = true;
            }
          }
          
          // Check for text content changes in existing messages
          if (mutation.type === 'characterData' || mutation.type === 'childList') {
            const target = mutation.target;
            let elementToCheck: Element | null = null;
            
            // Handle different node types safely
            try {
              if (target && target.nodeType === Node.ELEMENT_NODE) {
                elementToCheck = target as Element;
              } else if (target && target.nodeType === Node.TEXT_NODE) {
                elementToCheck = (target as Text).parentElement;
              }
              
              if (elementToCheck && typeof elementToCheck.closest === 'function') {
                const isInMessage = elementToCheck.closest('[data-role="assistant"], [data-role="user"], [data-role="reasoning"]');
                if (isInMessage) {
                  shouldScroll = true;
                }
              }
            } catch (error) {
              // Silently ignore errors from mutation observer edge cases
              console.debug('Thread auto-scroll: ignoring mutation observer error', error);
            }
          }
        });

        if (shouldScroll && !scrollState.userInterrupted) {
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
  }, []);

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