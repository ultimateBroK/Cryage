import { Assistant } from "./assistant";
import { ErrorBoundary } from "@/components/common/error-boundary";

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
