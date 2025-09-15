"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

interface ThreadTitleContextType {
  titles: Record<string, string>;
  setTitle: (threadId: string, title: string) => void;
  getTitle: (threadId: string) => string | null;
}

const ThreadTitleContext = createContext<ThreadTitleContextType | null>(null);

export function ThreadTitleProvider({ children }: { children: ReactNode }) {
  const [titles, setTitles] = useState<Record<string, string>>(() => {
    // Load titles from localStorage on initial load
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("thread-titles");
        return stored ? JSON.parse(stored) : {};
      } catch {
        return {};
      }
    }
    return {};
  });

  const setTitle = (threadId: string, title: string) => {
    setTitles(prev => {
      const updated = { ...prev, [threadId]: title };
      
      // Persist to localStorage
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("thread-titles", JSON.stringify(updated));
        } catch (error) {
          console.warn("Failed to save thread titles to localStorage:", error);
        }
      }
      
      return updated;
    });
  };

  const getTitle = (threadId: string) => {
    return titles[threadId] || null;
  };

  return (
    <ThreadTitleContext.Provider value={{ titles, setTitle, getTitle }}>
      {children}
    </ThreadTitleContext.Provider>
  );
}

export function useThreadTitle() {
  const context = useContext(ThreadTitleContext);
  if (!context) {
    throw new Error("useThreadTitle must be used within ThreadTitleProvider");
  }
  return context;
}
