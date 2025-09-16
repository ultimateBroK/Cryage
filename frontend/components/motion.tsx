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

export function MotionDiv({ children, ...rest }: MotionDivProps) {
  const [fm, setFm] = useState<null | typeof import('framer-motion')>(null);

  useEffect(() => {
    let mounted = true;
    import('framer-motion').then((m) => {
      if (mounted) setFm(m);
    });
    return () => {
      mounted = false;
    };
  }, []);

  if (!fm) return <div {...rest}>{children}</div>;
  const MotionDivImpl = fm.motion.div as unknown as (props: MotionDivProps) => React.ReactElement;
  return <MotionDivImpl {...rest}>{children as ReactNode}</MotionDivImpl>;
}

interface PresenceProps {
  children: ReactNode;
  initial?: boolean;
}

export function Presence({ children, initial = false }: PresenceProps) {
  const [fm, setFm] = useState<null | typeof import('framer-motion')>(null);
  useEffect(() => {
    let mounted = true;
    import('framer-motion').then((m) => {
      if (mounted) setFm(m);
    });
    return () => {
      mounted = false;
    };
  }, []);
  if (!fm) return <Fragment>{children}</Fragment>;
  const AnimatePresence = fm.AnimatePresence as unknown as (props: { children: ReactNode; initial?: boolean }) => React.ReactElement;
  return <AnimatePresence initial={initial}>{children}</AnimatePresence>;
}


