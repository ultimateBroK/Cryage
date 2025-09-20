"use client";

import { createContext, useContext, useEffect, useMemo, useRef, useState, type FC, type PropsWithChildren } from "react";
import { PlusIcon, MinusIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useThreadRuntime } from "@assistant-ui/react";
import StarBorder from "@/blocks/Animations/StarBorder/StarBorder";
import {
  MarkdownTextPrimitive,
  unstable_memoizeMarkdownComponents as memoizeMarkdownComponents,
} from "@assistant-ui/react-markdown";
import { useAutoScroll } from "@/hooks/use-auto-scroll";

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
      <div className={cn("mt-3 text-sm", className)}>{children}</div>
    </ReasoningContext.Provider>
  );
};

export const ReasoningTrigger: FC<PropsWithChildren<{ className?: string }>> = ({ className, children }) => {
  const ctx = useContext(ReasoningContext);
  const [isDark, setIsDark] = useState<boolean>(false);

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

  return (
    <StarBorder
      as="button"
      onClick={() => setOpen(!open)}
      aria-label="Toggle reasoning"
      color={isDark ? "#00ffbb" : "#00bfa5"}
      speed="6s"
      thickness={1}
      className={cn("mb-2 backdrop-blur-md/0", className)}
      unstyledInner
      innerClassName="relative z-1 rounded-xl px-3 py-1.5 text-xs font-medium text-foreground/90 bg-background/35 backdrop-blur-md border border-black/10 dark:border-white/15 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.25)] flex items-center justify-center gap-1.5"
    >
      {open ? <MinusIcon className="size-4" /> : <PlusIcon className="size-4" />}
      <span className="font-medium">{children ?? "Reasoning"}</span>
    </StarBorder>
  );
};

export const ReasoningContent: FC<PropsWithChildren<{ markdown?: boolean; className?: string }>> = ({
  markdown = true,
  className,
  children,
}) => {
  const ctx = useContext(ReasoningContext);
  const threadRuntime = useThreadRuntime();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [fm, setFm] = useState<null | typeof import('framer-motion')>(null);

  const open = ctx?.open ?? false;
  const isRunning = threadRuntime?.getState().isRunning ?? false;

  // Lazy load framer-motion
  useEffect(() => {
    if (open) {
      import('framer-motion').then(setFm);
    }
  }, [open]);

  // Auto-scroll to bottom when content updates while running
  const { scrollToBottom, resetScrollState } = useAutoScroll({
    enabled: isRunning && open,
    element: scrollRef.current,
    behavior: 'smooth',
    threshold: 10,
    debounceDelay: 50,
    fallbackInterval: 150
  });

  // Reset scroll state when reasoning opens
  useEffect(() => {
    if (open && isRunning) {
      resetScrollState();
    }
  }, [open, isRunning, resetScrollState]);

  if (!ctx) return null;

  // If framer-motion hasn't loaded yet, render static content
  if (!fm) {
    return open ? (
      <div
        className={cn(
          "w-full flex justify-center",
          isRunning ? "sticky bottom-4 z-40" : "",
          className,
        )}
        role="status"
        aria-live="polite"
      >
        <div
          ref={scrollRef}
            className={cn(
              "inline-block rounded-xl bg-background/40 backdrop-blur-md border border-white/15 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.25)] p-3 text-left mx-auto",
              isRunning ? "max-h-[40vh] overflow-y-auto scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent scroll-smooth" : ""
            )}
        >
          {markdown ? (
            <MarkdownTextPrimitive className="aui-md" components={compactComponents} />
          ) : (
            <div>{children}</div>
          )}
        </div>
      </div>
    ) : null;
  }

  const AnimatePresence = fm.AnimatePresence;
  const MotionDiv = fm.motion.div;

  return (
    <AnimatePresence initial={false}>
      {open && (
        <MotionDiv
          initial={{ height: 0, opacity: 0, overflow: "hidden", marginTop: 0, marginBottom: 0 }}
          animate={{
            height: "auto",
            opacity: 1,
            overflow: isRunning ? "hidden" : "visible",
            marginTop: 8, // mt-2
            marginBottom: 12, // mb-3
          }}
          exit={{ height: 0, opacity: 0, overflow: "hidden", marginTop: 0, marginBottom: 0 }}
          transition={{
            duration: 0.3,
            ease: [0.4, 0.0, 0.2, 1], // Custom easing for smoother animation
            layout: { duration: 0.3 }
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
          <div
            ref={scrollRef}
            className={cn(
              "inline-block rounded-xl bg-background/40 backdrop-blur-md border border-white/15 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.25)] p-3 text-left mx-auto",
              isRunning ? "max-h-[40vh] overflow-y-auto scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent scroll-smooth" : ""
            )}
          >
            {markdown ? (
              <MarkdownTextPrimitive className="aui-md" components={compactComponents} />
            ) : (
              <div>{children}</div>
            )}
          </div>
        </MotionDiv>
      )}
    </AnimatePresence>
  );
};


