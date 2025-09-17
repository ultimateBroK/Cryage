"use client";

import { Fragment, type ReactNode, useEffect, useState } from "react";
import type React from "react";

type MotionDivProps = React.ComponentPropsWithoutRef<'div'> & {
  initial?: unknown;
  animate?: unknown;
  exit?: unknown;
  transition?: unknown;
  layout?: boolean;
};

export function MotionDiv({ children, initial, animate, exit, transition, layout, ...domProps }: MotionDivProps) {
  const [fm, setFm] = useState<null | typeof import('framer-motion')>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    // Check for reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleChange);

    let mounted = true;
    import('framer-motion').then((m) => {
      if (mounted) setFm(m);
    });

    return () => {
      mounted = false;
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  // If reduced motion is preferred, render static div
  if (reducedMotion) {
    return <div {...domProps}>{children}</div>;
  }

  if (!fm) return <div {...domProps}>{children}</div>;
  const MotionDivImpl = fm.motion.div as unknown as (props: MotionDivProps) => React.ReactElement;
  return (
    <MotionDivImpl
      initial={initial}
      animate={animate}
      exit={exit}
      transition={transition}
      layout={layout}
      {...domProps}
    >
      {children as ReactNode}
    </MotionDivImpl>
  );
}

interface PresenceProps {
  children: ReactNode;
  initial?: boolean;
}

export function Presence({ children, initial = false }: PresenceProps) {
  const [fm, setFm] = useState<null | typeof import('framer-motion')>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    // Check for reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleChange);

    let mounted = true;
    import('framer-motion').then((m) => {
      if (mounted) setFm(m);
    });

    return () => {
      mounted = false;
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  // If reduced motion is preferred, render without AnimatePresence
  if (reducedMotion) {
    return <Fragment>{children}</Fragment>;
  }

  if (!fm) return <Fragment>{children}</Fragment>;
  const AnimatePresence = fm.AnimatePresence as unknown as (props: { children: ReactNode; initial?: boolean }) => React.ReactElement;
  return <AnimatePresence initial={initial}>{children}</AnimatePresence>;
}


