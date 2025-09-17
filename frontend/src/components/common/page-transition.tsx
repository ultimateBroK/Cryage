"use client";

import { ReactNode } from "react";
import { MotionDiv } from "./motion";

interface PageTransitionProps {
  children: ReactNode;
}

export function PageTransition({ children }: PageTransitionProps) {
  return (
    <MotionDiv
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{
        duration: 0.3,
        ease: [0.25, 0.46, 0.45, 0.94], // Custom easing for smooth transition
      }}
      className="min-h-screen"
    >
      {children}
    </MotionDiv>
  );
}
