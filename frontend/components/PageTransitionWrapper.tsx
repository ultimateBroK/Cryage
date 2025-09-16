"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Presence } from "./motion";
import { MotionDiv } from "./motion";

interface PageTransitionWrapperProps {
  children: ReactNode;
}

export function PageTransitionWrapper({ children }: PageTransitionWrapperProps) {
  const pathname = usePathname();

  return (
    <Presence>
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
    </Presence>
  );
}