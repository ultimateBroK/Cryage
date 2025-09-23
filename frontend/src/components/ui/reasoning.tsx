"use client";

import { createContext, useContext, useEffect, useMemo, useRef, useState, type FC, type PropsWithChildren, memo } from "react";
import { PlusIcon, MinusIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useThreadRuntime } from "@assistant-ui/react";
import StarBorder from "@/blocks/Animations/StarBorder";
import {
  MarkdownTextPrimitive,
  unstable_memoizeMarkdownComponents as memoizeMarkdownComponents,
} from "@assistant-ui/react-markdown";
import { useAutoScroll } from "@/hooks/use-auto-scroll";
import { useScrollIsolation } from "@/hooks/use-scroll-isolation";
import TypingIndicator from "./typing-indicator";

// Compact markdown components to reduce vertical spacing in reasoning
const compactComponents = memoizeMarkdownComponents({
  h1: ({ className, ...props }) => (
    <h1 className={cn("mb-2 mt-2 text-lg font-semibold", className)} {...props} />
  ),
  h2: ({ className, ...props }) => (
    <h2 className={cn("mb-2 mt-2 text-base font-semibold", className)} {...props} />
  ),
  h3: ({ className, ...props }) => (
    <h3 className={cn("mb-2 mt-2 text-base font-medium", className)} {...props} />
  ),
  h4: ({ className, ...props }) => (
    <h4 className={cn("mb-1 mt-2 text-sm font-medium", className)} {...props} />
  ),
  h5: ({ className, ...props }) => (
    <h5 className={cn("my-1 text-sm font-medium", className)} {...props} />
  ),
  h6: ({ className, ...props }) => (
    <h6 className={cn("my-1 text-xs font-medium", className)} {...props} />
  ),
  p: ({ className, ...props }) => (
    <p className={cn("my-2 leading-6", className)} {...props} />
  ),
  ul: ({ className, ...props }) => (
    <ul className={cn("my-2 ml-5 list-disc [&>li]:mt-1", className)} {...props} />
  ),
  ol: ({ className, ...props }) => (
    <ol className={cn("my-2 ml-5 list-decimal [&>li]:mt-1", className)} {...props} />
  ),
  hr: ({ className, ...props }) => (
    <hr className={cn("my-2 border-b", className)} {...props} />
  ),
  pre: ({ className, ...props }) => (
    <pre className={cn("overflow-x-auto rounded-md bg-black p-3 text-white", className)} {...props} />
  ),
});

type ReasoningContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

const ReasoningContext = createContext<ReasoningContextValue | null>(null);

export const Reasoning: FC<PropsWithChildren<{ defaultOpen?: boolean; className?: string }>> = ({
  defaultOpen = false,
  className,
  children,
}) => {
  const [open, setOpen] = useState<boolean>(defaultOpen);
  const threadRuntime = useThreadRuntime();

  // Auto open while the thread is running, and close when it finishes
  useEffect(() => {
    if (!threadRuntime) return;

    // initialize
    setOpen(threadRuntime.getState().isRunning);

    const unsub = threadRuntime.subscribe(() => {
      const isRunning = threadRuntime.getState().isRunning;
      setOpen(isRunning);
    });
    return () => {
      unsub?.();
    };
  }, [threadRuntime]);
  const value = useMemo(() => ({ open, setOpen }), [open]);

  return (
    <ReasoningContext.Provider value={value}>
      <div className={cn("mt-2 text-sm", className)}>{children}</div>
    </ReasoningContext.Provider>
  );
};

export const ReasoningTrigger: FC<PropsWithChildren<{ className?: string }>> = ({ className, children }) => {
  const ctx = useContext(ReasoningContext);
  const [isDark, setIsDark] = useState<boolean>(false);
  const { disableChatScroll, enableChatScroll } = useScrollIsolation();

  useEffect(() => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    const update = () => setIsDark(root.classList.contains("dark"));
    update();
    const observer = new MutationObserver(update);
    observer.observe(root, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  if (!ctx) return null;
  const { open, setOpen } = ctx;

  const handleToggle = (event: React.MouseEvent) => {
    // Prevent any potential scroll behavior from the click event
    event.preventDefault();
    event.stopPropagation();
    
    // Temporarily disable chat scroll during reasoning toggle to prevent conflicts
    if (!open) {
      disableChatScroll();
      // Re-enable after a short delay to allow reasoning to settle
      setTimeout(() => {
        enableChatScroll();
      }, 300);
    }
    
    setOpen(!open);
  };

  return (
    <StarBorder
      as="button"
      onClick={handleToggle}
      aria-label="Toggle reasoning"
      color={isDark ? "#00d4ff" : "#06b6d4"}
      speed="3s"
      thickness={0.5}
      autoContrast={true}
      className={cn(
        "mb-1 transition-all duration-300 hover:scale-105",
        className
      )}
    >
      <div className="flex items-center justify-center gap-2 text-xs font-semibold tracking-wide">
        {open ? <MinusIcon className="size-3.5" /> : <PlusIcon className="size-3.5" />}
        <span className="bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent">
          {children ?? "Reasoning"}
        </span>
      </div>
    </StarBorder>
  );
};

export const ReasoningContent: FC<PropsWithChildren<{ markdown?: boolean; className?: string }>> = memo(({
  markdown = true,
  className,
  children,
}) => {
  const ctx = useContext(ReasoningContext);
  const threadRuntime = useThreadRuntime();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [fm, setFm] = useState<null | typeof import('framer-motion')>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [lastContentLength, setLastContentLength] = useState(0);
  const streamingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const observerRef = useRef<MutationObserver | null>(null);

  const open = ctx?.open ?? false;
  const isRunning = threadRuntime?.getState().isRunning ?? false;
  const { canReasoningScroll } = useScrollIsolation();

  // Lazy load framer-motion - load when component mounts
  useEffect(() => {
    // Small delay to ensure smooth animation on first activation
    const timer = setTimeout(() => {
      import('framer-motion').then(setFm);
    }, 50);
    return () => clearTimeout(timer);
  }, []);

  // Real-time auto-scroll for reasoning content
  const { resetScrollState } = useAutoScroll({
    enabled: isRunning && open && canReasoningScroll(),
    element: scrollRef.current,
    behavior: 'smooth',
    threshold: 1, // Very precise threshold for real-time scrolling
    debounceDelay: 8, // 120fps throttling for real-time feel
    fallbackInterval: 16, // 60fps fallback for smooth experience
    aggressiveMode: true // Aggressive mode for real-time scrolling
  });

  // Reset scroll state when reasoning opens
  useEffect(() => {
    if (open && isRunning) {
      resetScrollState();
    }
  }, [open, isRunning, resetScrollState]);

  // Real-time streaming state tracking with minimal throttling
  useEffect(() => {
    if (!isRunning || !open || !scrollRef.current) return;

    // Clear existing observer
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    // Clear existing timeout
    if (streamingTimeoutRef.current) {
      clearTimeout(streamingTimeoutRef.current);
    }

    let lastUpdateTime = 0;
    const THROTTLE_MS = 4; // 240fps for real-time feel

    const observer = new MutationObserver(() => {
      const now = Date.now();
      if (now - lastUpdateTime < THROTTLE_MS) return;
      lastUpdateTime = now;

      if (scrollRef.current) {
        const currentLength = scrollRef.current.textContent?.length || 0;
        if (currentLength > lastContentLength) {
          setIsStreaming(true);
          setLastContentLength(currentLength);
          
          // Clear previous timeout
          if (streamingTimeoutRef.current) {
            clearTimeout(streamingTimeoutRef.current);
          }
          
          // Set new timeout with very short delay for real-time responsiveness
          streamingTimeoutRef.current = setTimeout(() => {
            setIsStreaming(false);
            streamingTimeoutRef.current = null;
          }, 100); // Reduced from 200ms to 100ms
        }
      }
    });

    observerRef.current = observer;
    observer.observe(scrollRef.current, {
      childList: true,
      subtree: true,
      characterData: true
    });

    return () => {
      observer.disconnect();
      if (streamingTimeoutRef.current) {
        clearTimeout(streamingTimeoutRef.current);
      }
    };
  }, [isRunning, open, lastContentLength]);

  if (!ctx) return null;

  // If framer-motion hasn't loaded yet, render with CSS animation fallback
  if (!fm) {
    return open ? (
      <div
        className={cn(
          "w-full flex justify-center animate-smooth-fade-in",
          isRunning ? "sticky bottom-4 z-40" : "",
          className,
        )}
        role="status"
        aria-live="polite"
        style={{
          animation: "smooth-fade-in 0.4s ease-out"
        }}
      >
        <div
          ref={scrollRef}
          className={cn(
            "inline-block rounded-xl bg-background/40 backdrop-blur-md border border-white/15 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.25)] p-3 text-left mx-auto transition-all duration-400",
            isRunning ? "max-h-[40vh] overflow-y-auto scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent scroll-smooth" : "",
            isStreaming && "animate-reasoning-glow"
          )}
          style={{
            animation: "smooth-fade-in 0.4s ease-out"
          }}
        >
          {markdown ? (
            <MarkdownTextPrimitive className="aui-md" components={compactComponents} />
          ) : (
            <div>{children}</div>
          )}
          {isRunning && (
            <TypingIndicator
              className="mt-2"
              size="sm"
              label="Reasoning"
              color="currentColor"
            />
          )}
        </div>
      </div>
    ) : null;
  }

  const AnimatePresence = fm.AnimatePresence;
  const MotionDiv = fm.motion.div;

  return (
    <AnimatePresence initial={true} mode="wait">
      {open && (
        <MotionDiv
          key="reasoning-content"
          initial={{ 
            height: 0, 
            opacity: 0, 
            overflow: "hidden", 
            marginTop: 0, 
            marginBottom: 0,
            scale: 0.95
          }}
          animate={{
            height: "auto",
            opacity: 1,
            overflow: isRunning ? "hidden" : "visible",
            marginTop: 8, // mt-2
            marginBottom: 8, // mb-2
            scale: 1
          }}
          exit={{ 
            height: 0, 
            opacity: 0, 
            overflow: "hidden", 
            marginTop: 0, 
            marginBottom: 0,
            scale: 0.95
          }}
          transition={{
            duration: 0.4, // Slightly longer for smoother animation
            ease: [0.25, 0.1, 0.25, 1], // Improved easing curve for smoother feel
            layout: { duration: 0.3, ease: "easeOut" } // Slightly longer layout transitions
          }}
          layout
          className={cn(
            "w-full flex justify-center",
            isRunning ? "sticky bottom-4 z-40" : "",
            className,
          )}
          role="status"
          aria-live="polite"
        >
          <MotionDiv
            ref={scrollRef}
            className={cn(
              "inline-block rounded-xl bg-background/40 backdrop-blur-md border border-white/15 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.25)] p-3 text-left mx-auto transition-all duration-200",
              isRunning ? "max-h-[40vh] overflow-y-auto scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent scroll-smooth scrollbar-thumb-opacity-50 hover:scrollbar-thumb-opacity-75" : "",
              isStreaming && "animate-reasoning-glow"
            )}
            animate={isStreaming ? {
              scale: [1, 1.001, 1], // Very subtle scale for real-time feel
              boxShadow: [
                "0 0 8px rgba(59, 130, 246, 0.15)",
                "0 0 20px rgba(59, 130, 246, 0.25)",
                "0 0 8px rgba(59, 130, 246, 0.15)"
              ]
            } : {}}
            transition={{
              duration: 0.2, // Even faster animation for real-time feel
              ease: "easeInOut",
              repeat: isStreaming ? Infinity : 0,
              repeatType: "reverse"
            }}
          >
            {markdown ? (
              <MarkdownTextPrimitive className="aui-md" components={compactComponents} />
            ) : (
              <div>{children}</div>
            )}
            {isRunning && (
              <MotionDiv
                className="mt-2"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <TypingIndicator
                  size="sm"
                  label="Reasoning"
                  color="currentColor"
                />
              </MotionDiv>
            )}
          </MotionDiv>
        </MotionDiv>
      )}
    </AnimatePresence>
  );
});

ReasoningContent.displayName = "ReasoningContent";


