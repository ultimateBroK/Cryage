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
  /**
   * Whether to use more aggressive scrolling for streaming content
   */
  aggressiveMode?: boolean;
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
    fallbackInterval = 150,
    aggressiveMode = false
  } = options;

  const scrollStateRef = useRef({
    isScrolling: false,
    lastScrollHeight: 0,
    userScrolledUp: false,
    lastScrollTime: 0
  });

  useEffect(() => {
    if (!enabled || !element) return;

    const scrollState = scrollStateRef.current;
    scrollState.lastScrollHeight = element.scrollHeight;

    const scrollToBottom = () => {
      if (scrollState.isScrolling) return;
      
      const now = Date.now();
      // Throttle scroll operations to 60fps max
      if (now - scrollState.lastScrollTime < 16) return;
      scrollState.lastScrollTime = now;
      
      scrollState.isScrolling = true;

      requestAnimationFrame(() => {
        if (element) {
          const currentScrollHeight = element.scrollHeight;
          const scrollTop = element.scrollTop;
          const clientHeight = element.clientHeight;
          const isNearBottom = (currentScrollHeight - (scrollTop + clientHeight)) <= threshold;

          // Only auto-scroll if user hasn't manually scrolled up or if content height changed
          // In aggressive mode, always scroll regardless of user interaction
          if (aggressiveMode || !scrollState.userScrolledUp || isNearBottom || scrollState.lastScrollHeight !== currentScrollHeight) {
            element.scrollTo({
              top: currentScrollHeight,
              behavior: behavior
            });
            if (!aggressiveMode) {
              scrollState.userScrolledUp = false;
            }
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

    // Set up mutation observer with real-time optimized debouncing
    let debounceTimer: NodeJS.Timeout;
    let lastMutationTime = 0;
    const MUTATION_THROTTLE_MS = aggressiveMode ? 4 : 8; // 240fps for aggressive, 120fps for normal
    
    const mutationObserver = new MutationObserver((mutations) => {
      if (!enabled || !element) return;

      const now = Date.now();
      if (now - lastMutationTime < MUTATION_THROTTLE_MS) return;
      lastMutationTime = now;

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
        // For aggressive mode, use immediate scroll with minimal debounce
        if (aggressiveMode) {
          debounceTimer = setTimeout(scrollToBottom, Math.min(debounceDelay, 4));
        } else {
          debounceTimer = setTimeout(scrollToBottom, debounceDelay);
        }
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
          // For aggressive mode, use immediate scroll
          if (aggressiveMode) {
            requestAnimationFrame(scrollToBottom);
          } else {
            scrollToBottom();
          }
          lastKnownHeight = currentHeight;
        }
      }
    }, aggressiveMode ? Math.min(fallbackInterval, 16) : fallbackInterval);

    // ResizeObserver for layout changes with real-time optimization
    const resizeObserver = new ResizeObserver(() => {
      if (enabled && element) {
        // For aggressive mode, use immediate scroll
        if (aggressiveMode) {
          requestAnimationFrame(scrollToBottom);
        } else {
          scrollToBottom();
        }
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
  }, [enabled, element, behavior, threshold, debounceDelay, fallbackInterval, aggressiveMode]);

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