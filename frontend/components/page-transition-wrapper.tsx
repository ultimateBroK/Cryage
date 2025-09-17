"use client";

import { ReactNode, useEffect, useState } from "react";
import { usePathname } from "next/navigation";

interface PageTransitionWrapperProps {
  children: ReactNode;
}

export function PageTransitionWrapper({ children }: PageTransitionWrapperProps) {
  const pathname = usePathname();
  const [fm, setFm] = useState<null | typeof import('framer-motion')>(null);

  useEffect(() => {
    // Lazy load framer-motion for page transitions
    import('framer-motion').then(setFm);
  }, []);

  // If framer-motion hasn't loaded, render without animation
  if (!fm) {
    return <div className="min-h-screen">{children}</div>;
  }

  const AnimatePresence = fm.AnimatePresence;
  const MotionDiv = fm.motion.div;

  return (
    <AnimatePresence mode="wait">
      <MotionDiv
        key={pathname}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{
          duration: 0.3,
          ease: [0.25, 0.46, 0.45, 0.94],
        }}
        className="min-h-screen"
      >
        {children}
      </MotionDiv>
    </AnimatePresence>
  );
}
