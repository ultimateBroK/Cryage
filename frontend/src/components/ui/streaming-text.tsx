"use client";

import { cn } from "@/lib/utils";
import { type FC, type PropsWithChildren, useEffect, useState, useRef } from "react";

interface StreamingTextProps extends PropsWithChildren {
  className?: string;
  isStreaming?: boolean;
  showCursor?: boolean;
  cursorBlinkSpeed?: number;
  streamingSpeed?: number;
}

export const StreamingText: FC<StreamingTextProps> = ({
  children,
  className,
  isStreaming = false,
  showCursor = true,
  cursorBlinkSpeed = 500,
  streamingSpeed = 50,
}) => {
  const [displayedText, setDisplayedText] = useState("");
  const [showCursorState, setShowCursorState] = useState(true);
  const textRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLSpanElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const lastUpdateTimeRef = useRef(0);

  // Optimized cursor blinking animation
  useEffect(() => {
    if (!showCursor || !isStreaming) return;

    const interval = setInterval(() => {
      setShowCursorState(prev => !prev);
    }, cursorBlinkSpeed);

    return () => clearInterval(interval);
  }, [showCursor, isStreaming, cursorBlinkSpeed]);

  // Optimized streaming text animation with requestAnimationFrame
  useEffect(() => {
    if (!isStreaming || !textRef.current) return;

    const fullText = textRef.current.textContent || "";
    if (displayedText.length >= fullText.length) return;

    const animate = (currentTime: number) => {
      if (currentTime - lastUpdateTimeRef.current >= streamingSpeed) {
        setDisplayedText(prev => {
          const nextLength = prev.length + 1;
          if (nextLength >= fullText.length) {
            return fullText;
          }
          return fullText.slice(0, nextLength);
        });
        lastUpdateTimeRef.current = currentTime;
      }
      
      if (displayedText.length < fullText.length) {
        animationFrameRef.current = requestAnimationFrame(animate);
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [displayedText, isStreaming, streamingSpeed]);

  // Reset when streaming stops
  useEffect(() => {
    if (!isStreaming) {
      setDisplayedText("");
      lastUpdateTimeRef.current = 0;
    }
  }, [isStreaming]);

  return (
    <div className={cn("relative", className)}>
      <div ref={textRef} className="invisible absolute">
        {children}
      </div>
      <div className="relative">
        {isStreaming ? displayedText : children}
        {isStreaming && showCursor && (
          <span
            ref={cursorRef}
            className={cn(
              "inline-block w-0.5 h-4 bg-current ml-0.5",
              showCursorState ? "opacity-100" : "opacity-0",
              "transition-opacity duration-100"
            )}
            style={{
              animation: showCursorState ? "none" : "none",
            }}
          />
        )}
      </div>
    </div>
  );
};

export default StreamingText;
