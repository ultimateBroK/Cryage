"use client";

import dynamic from "next/dynamic";
import { ErrorBoundary } from "@/components/common/error-boundary";

const Assistant = dynamic(() => import("./assistant").then(m => ({ default: m.Assistant })), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center min-h-screen">Loading...</div>
});

/**
 * Home Page Component
 * 
 * Main entry point for the application. Wraps the Assistant component
 * with error boundaries for better error handling and user experience.
 */
export default function Home() {
  return (
    <ErrorBoundary>
      <Assistant />
    </ErrorBoundary>
  );
}
