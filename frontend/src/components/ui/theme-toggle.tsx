"use client";

import { useEffect, useState } from "react";
import { MoonIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

const STORAGE_KEY = "theme";

export const ThemeToggle = () => {
  const [, setIsDark] = useState<boolean>(true);

  useEffect(() => {
    // Force dark mode only
    const root = document.documentElement;
    root.classList.add("dark");
    setIsDark(true);
    try {
      localStorage.setItem(STORAGE_KEY, "dark");
    } catch {}
  }, []);

  // Disabled toggle - always dark mode
  const toggle = () => {
    // Do nothing - dark mode only
  };

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      aria-label="Dark mode (always on)" 
      onClick={toggle} 
      className="rounded-full opacity-60 cursor-default"
      disabled
    >
      <MoonIcon className="size-5" />
    </Button>
  );
};

export default ThemeToggle;


