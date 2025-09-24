import { useEffect, useRef } from 'react';

/**
 * Hook to isolate scroll behavior between different components
 * Prevents scroll conflicts between chat and reasoning
 */
export function useScrollIsolation() {
  const isolationRef = useRef({
    chatScrollEnabled: true,
    reasoningScrollEnabled: true,
    lastScrollTime: 0,
    reasoningAnimating: false,
    chatScrollPosition: 0
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
      
      setReasoningAnimating: (animating: boolean) => {
        isolation.reasoningAnimating = animating;
        // Disable chat scroll during reasoning animations
        if (animating) {
          const viewport = document.querySelector('[data-viewport="true"]') as HTMLElement;
          if (viewport) {
            isolation.chatScrollPosition = viewport.scrollTop;
          }
          isolation.chatScrollEnabled = false;
        }
      },
      
      restoreChatScrollAfterReasoning: () => {
        setTimeout(() => {
          isolation.reasoningAnimating = false;
          isolation.chatScrollEnabled = true;
          
          // Optionally restore scroll position if it changed during reasoning
          const viewport = document.querySelector('[data-viewport="true"]') as HTMLElement;
          if (viewport && isolation.chatScrollPosition > 0) {
            const currentScroll = viewport.scrollTop;
            const scrollDiff = Math.abs(currentScroll - isolation.chatScrollPosition);
            
            // If scroll changed significantly during reasoning animation
            if (scrollDiff > 100) {
              viewport.scrollTo({
                top: isolation.chatScrollPosition,
                behavior: 'smooth'
              });
            }
          }
        }, 100);
      },
      
      canChatScroll: () => isolation.chatScrollEnabled && !isolation.reasoningAnimating,
      canReasoningScroll: () => isolation.reasoningScrollEnabled,
      isReasoningAnimating: () => isolation.reasoningAnimating,
      
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
    canChatScroll: () => isolationRef.current.chatScrollEnabled && !isolationRef.current.reasoningAnimating,
    canReasoningScroll: () => isolationRef.current.reasoningScrollEnabled,
    enableChatScroll: () => { isolationRef.current.chatScrollEnabled = true; },
    disableChatScroll: () => { isolationRef.current.chatScrollEnabled = false; },
    enableReasoningScroll: () => { isolationRef.current.reasoningScrollEnabled = true; },
    disableReasoningScroll: () => { isolationRef.current.reasoningScrollEnabled = false; },
    setReasoningAnimating: (animating: boolean) => {
      isolationRef.current.reasoningAnimating = animating;
      if (animating) {
        const viewport = document.querySelector('[data-viewport="true"]') as HTMLElement;
        if (viewport) {
          isolationRef.current.chatScrollPosition = viewport.scrollTop;
        }
        isolationRef.current.chatScrollEnabled = false;
      }
    },
    restoreChatScrollAfterReasoning: () => {
      setTimeout(() => {
        isolationRef.current.reasoningAnimating = false;
        isolationRef.current.chatScrollEnabled = true;
      }, 100);
    },
    isReasoningAnimating: () => isolationRef.current.reasoningAnimating
  };
}
