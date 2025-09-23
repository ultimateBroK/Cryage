import { useEffect, useRef } from 'react';

/**
 * Hook to isolate scroll behavior between different components
 * Prevents scroll conflicts between chat and reasoning
 */
export function useScrollIsolation() {
  const isolationRef = useRef({
    chatScrollEnabled: true,
    reasoningScrollEnabled: true,
    lastScrollTime: 0
  });

  useEffect(() => {
    const isolation = isolationRef.current;
    
    // Throttle scroll operations to prevent conflicts
    const throttledScroll = (callback: () => void, delay: number = 16) => {
      const now = Date.now();
      if (now - isolation.lastScrollTime < delay) return;
      
      isolation.lastScrollTime = now;
      requestAnimationFrame(callback);
    };

    // Provide scroll control methods
    const scrollControls = {
      enableChatScroll: () => {
        isolation.chatScrollEnabled = true;
      },
      
      disableChatScroll: () => {
        isolation.chatScrollEnabled = false;
      },
      
      enableReasoningScroll: () => {
        isolation.reasoningScrollEnabled = true;
      },
      
      disableReasoningScroll: () => {
        isolation.reasoningScrollEnabled = false;
      },
      
      canChatScroll: () => isolation.chatScrollEnabled,
      canReasoningScroll: () => isolation.reasoningScrollEnabled,
      
      throttledScroll
    };

    // Store controls in a global reference for access by other hooks
    (window as unknown as { __scrollControls?: typeof scrollControls }).__scrollControls = scrollControls;

    return () => {
      // Cleanup
      delete (window as unknown as { __scrollControls?: typeof scrollControls }).__scrollControls;
    };
  }, []);

  return {
    canChatScroll: () => isolationRef.current.chatScrollEnabled,
    canReasoningScroll: () => isolationRef.current.reasoningScrollEnabled,
    enableChatScroll: () => { isolationRef.current.chatScrollEnabled = true; },
    disableChatScroll: () => { isolationRef.current.chatScrollEnabled = false; },
    enableReasoningScroll: () => { isolationRef.current.reasoningScrollEnabled = true; },
    disableReasoningScroll: () => { isolationRef.current.reasoningScrollEnabled = false; }
  };
}
