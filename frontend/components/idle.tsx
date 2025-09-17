"use client";

import { useEffect, useState, type ReactNode } from "react";

interface IdleProps {
  children: ReactNode;
  delayMs?: number;
  respectReducedMotion?: boolean;
}

export function Idle({ children, delayMs = 1000, respectReducedMotion = true }: IdleProps) {
  const [ready, setReady] = useState<boolean>(false);

  useEffect(() => {
    if (respectReducedMotion && typeof window !== "undefined") {
      const prefersReduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (prefersReduced) {
        // Skip mounting entirely for users preferring reduced motion
        return;
      }
    }

    let canceled = false;
    const fire = () => {
      if (!canceled) setReady(true);
    };

    const w = typeof window !== "undefined" ? (window as unknown as { requestIdleCallback?: (cb: () => void, opts?: { timeout?: number }) => number; cancelIdleCallback?: (id: number) => void }) : undefined;
    if (w?.requestIdleCallback) {
      const handle = w.requestIdleCallback(fire, { timeout: delayMs });
      return () => {
        canceled = true;
        if (w.cancelIdleCallback) {
          w.cancelIdleCallback(handle);
        }
      };
    }

    const timeoutId = setTimeout(fire, delayMs);
    return () => {
      canceled = true;
      clearTimeout(timeoutId);
    };
  }, [delayMs, respectReducedMotion]);

  if (!ready) return null;
  return <>{children}</>;
}


