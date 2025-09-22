"use client";

import { cn } from "@/lib/utils";
import { type FC } from "react";

interface TypingIndicatorProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  color?: string;
  animated?: boolean;
  label?: string;
}

export const TypingIndicator: FC<TypingIndicatorProps> = ({
  className,
  size = "md",
  color = "currentColor",
  animated = true,
  label = "Typing",
}) => {
  const sizeClasses = {
    sm: "w-1 h-1",
    md: "w-1.5 h-1.5",
    lg: "w-2 h-2",
  };

  const containerClasses = {
    sm: "gap-1",
    md: "gap-1.5",
    lg: "gap-2",
  };

  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      {label && (
        <span className={cn(
          "text-muted-foreground font-medium",
          size === "sm" && "text-xs",
          size === "md" && "text-sm",
          size === "lg" && "text-base"
        )}>
          {label}
        </span>
      )}
      <div className={cn("flex", containerClasses[size])}>
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className={cn(
              "rounded-full",
              sizeClasses[size],
              animated && "animate-typing-dots"
            )}
            style={{
              backgroundColor: color,
              animationDelay: `${i * 0.2}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default TypingIndicator;
