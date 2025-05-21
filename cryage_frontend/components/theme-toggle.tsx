"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { useThemeStore } from "@/store/theme-store"
import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  const { theme, setTheme } = useThemeStore()
  const { setTheme: setNextTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Sync zustand state with next-themes when component mounts
  useEffect(() => {
    setMounted(true)
    setNextTheme(theme)
  }, [theme, setNextTheme])

  // Ensure we're not rendering during SSR to avoid hydration mismatch
  if (!mounted) {
    return null
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => {
        const newTheme = theme === "dark" ? "light" : "dark"
        setTheme(newTheme)
      }}
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        <Moon className="h-[1.2rem] w-[1.2rem]" />
      ) : (
        <Sun className="h-[1.2rem] w-[1.2rem]" />
      )}
    </Button>
  )
}
