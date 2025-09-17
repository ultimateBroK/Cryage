/*
	Installed from https://reactbits.dev/ts/tailwind/
*/

import React from "react";
import { cn } from "@/lib/utils";

type StarBorderProps<T extends React.ElementType> =
  React.ComponentPropsWithoutRef<T> & {
    as?: T;
    className?: string;
    children?: React.ReactNode;
    color?: string;
    speed?: React.CSSProperties["animationDuration"];
    thickness?: number;
    innerClassName?: string;
    unstyledInner?: boolean;
  };

const StarBorder = <T extends React.ElementType = "button">({
  as,
  className = "",
  color = "white",
  speed = "6s",
  thickness = 1,
  innerClassName,
  unstyledInner = false,
  children,
  ...rest
}: StarBorderProps<T>) => {
  const Component = as || "button";

  return (
    <Component
      className={`relative inline-block overflow-hidden rounded-[20px] ${className}`}
      {...(rest as React.ComponentPropsWithoutRef<T>)}
      style={{
        padding: `${thickness}px 0`,
        ...(rest as React.ComponentPropsWithoutRef<T>).style,
      }}
    >
      <div
        className="absolute w-[300%] h-[50%] opacity-70 bottom-[-11px] right-[-250%] rounded-full z-0"
        style={{
          background: `radial-gradient(circle, ${color}, transparent 10%)`,
          animation: `star-movement-bottom linear infinite alternate`,
          animationDuration: speed,
        }}
      ></div>
      <div
        className="absolute w-[300%] h-[50%] opacity-70 top-[-10px] left-[-250%] rounded-full z-0"
        style={{
          background: `radial-gradient(circle, ${color}, transparent 10%)`,
          animation: `star-movement-top linear infinite alternate`,
          animationDuration: speed,
        }}
      ></div>
      <div
        className={cn(
          !unstyledInner &&
            "relative z-1 bg-gradient-to-b from-black to-gray-900 border border-gray-800 text-white text-center text-[16px] py-[16px] px-[26px] rounded-[20px]",
          innerClassName,
        )}
      >
        {children}
      </div>
    </Component>
  );
};

export default StarBorder;
