import { useEffect, useRef } from 'react';

export interface UseAutoScrollOptions {
  /**
   * Whether auto-scroll should be active
   */
  enabled: boolean;
  /**
   * Element to observe for content changes
   */
  element?: HTMLElement | null;
  /**
   * Scroll behavior (smooth, instant, auto)
   */
  behavior?: ScrollBehavior;
  /**
   * Threshold in pixels to consider user "at bottom"
   */
  threshold?: number;
  /**
   * Debounce delay for scroll operations in ms
   */
  debounceDelay?: number;
  /**
   * Fallback interval check frequency in ms
   */
  fallbackInterval?: number;
}

/**
 * Custom hook for auto-scrolling content as it updates
 * Particularly useful for streaming content like AI responses
 */
export function useAutoScroll(options: UseAutoScrollOptions) {
  const {
    enabled,
    element,
    behavior = 'smooth',
    threshold = 10,
    debounceDelay = 50,
    fallbackInterval = 150
  } = options;

  const scrollStateRef = useRef({
    isScrolling: false,
    lastScrollHeight: 0,
    userScrolledUp: false
  });

  useEffect(() => {
    if (!enabled || !element) return;

    const scrollState = scrollStateRef.current;
    scrollState.lastScrollHeight = element.scrollHeight;

    const scrollToBottom = () => {
      if (scrollState.isScrolling) return;
      scrollState.isScrolling = true;

      requestAnimationFrame(() => {
        if (element) {
          const currentScrollHeight = element.scrollHeight;
          const scrollTop = element.scrollTop;
          const clientHeight = element.clientHeight;
          const isNearBottom = (currentScrollHeight - (scrollTop + clientHeight)) <= threshold;

          // Only auto-scroll if user hasn't manually scrolled up or if content height changed
          if (!scrollState.userScrolledUp || isNearBottom || scrollState.lastScrollHeight !== currentScrollHeight) {
            element.scrollTo({
              top: currentScrollHeight,
              behavior: behavior
            });
            scrollState.userScrolledUp = false;
          }

          scrollState.lastScrollHeight = currentScrollHeight;
        }
        scrollState.isScrolling = false;
      });
    };

    // Initial scroll
    scrollToBottom();

    // Track user scroll behavior
    const handleUserScroll = () => {
      if (scrollState.isScrolling) return;
      
      const scrollTop = element.scrollTop;
      const clientHeight = element.clientHeight;
      const scrollHeight = element.scrollHeight;
      const isNearBottom = (scrollHeight - (scrollTop + clientHeight)) <= threshold;
      
      scrollState.userScrolledUp = !isNearBottom;
    };

    // Set up mutation observer with debouncing
    let debounceTimer: NodeJS.Timeout;
    const mutationObserver = new MutationObserver((mutations) => {
      if (!enabled || !element) return;

      const hasContentChanges = mutations.some(mutation => {
        if (mutation.type === 'childList') {
          return mutation.addedNodes.length > 0 || mutation.removedNodes.length > 0;
        }
        if (mutation.type === 'characterData') {
          return mutation.target.textContent !== mutation.oldValue;
        }
        return false;
      });

      if (hasContentChanges) {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(scrollToBottom, debounceDelay);
      }
    });

    mutationObserver.observe(element, {
      childList: true,
      subtree: true,
      characterData: true,
      characterDataOldValue: true
    });

    // Fallback interval for cases where mutation observer might miss updates
    const intervalId: NodeJS.Timeout = setInterval(() => {
    let lastKnownHeight = element.scrollHeight;

      if (enabled && element) {
        const currentHeight = element.scrollHeight;
        if (currentHeight !== lastKnownHeight) {
          scrollToBottom();
          lastKnownHeight = currentHeight;
        }
      }
    }, fallbackInterval);

    // ResizeObserver for layout changes
    const resizeObserver = new ResizeObserver(() => {
      if (enabled && element) {
        scrollToBottom();
      }
    });

    resizeObserver.observe(element);

    // Add scroll listener for user interaction tracking
    element.addEventListener('scroll', handleUserScroll, { passive: true });

    return () => {
      mutationObserver.disconnect();
      resizeObserver.disconnect();
      clearInterval(intervalId);
      clearTimeout(debounceTimer);
      element.removeEventListener('scroll', handleUserScroll);
    };
  }, [enabled, element, behavior, threshold, debounceDelay, fallbackInterval]);

  return {
    /**
     * Manually trigger scroll to bottom
     */
    scrollToBottom: () => {
      if (element) {
        element.scrollTo({
          top: element.scrollHeight,
          behavior: behavior
        });
        scrollStateRef.current.userScrolledUp = false;
      }
    },
    /**
     * Reset user scroll state (useful when content updates)
     */
    resetScrollState: () => {
      scrollStateRef.current.userScrolledUp = false;
    }
  };
}