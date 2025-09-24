"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";

// Agent status types
export type AgentStatus = "idle" | "thinking" | "error";

interface AgentStatusContextValue {
  status: AgentStatus;
  setStatus: (s: AgentStatus) => void;
}

const AgentStatusContext = createContext<AgentStatusContextValue | undefined>(undefined);

export const AgentStatusProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [status, setStatus] = useState<AgentStatus>("idle");

  // Optional: listen to visibility change to reset stale thinking state
  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === "visible" && status === "thinking") {
        // Avoid being stuck in thinking state if tab was backgrounded mid-stream
        setStatus("idle");
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, [status]);

  const value = { status, setStatus: useCallback((s: AgentStatus) => setStatus(s), []) };
  return <AgentStatusContext.Provider value={value}>{children}</AgentStatusContext.Provider>;
};

export function useAgentStatus(): AgentStatusContextValue {
  const ctx = useContext(AgentStatusContext);
  if (!ctx) throw new Error("useAgentStatus must be used within AgentStatusProvider");
  return ctx;
}
