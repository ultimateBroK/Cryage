import dynamic from "next/dynamic";
import type { ComponentType } from "react";
import { 
  ThreadLoadingSkeleton, 
  DashboardLoadingSkeleton, 
  SidebarLoadingSkeleton,
  ComponentLoadingSkeleton,
  AuroraLoadingSkeleton,
  SidebarContainerLoadingSkeleton
} from "@/components/common/loading-skeletons";

/**
 * Centralized dynamic imports with proper SSR handling and loading states
 * This ensures consistent loading behavior and easier maintenance
 */

// Aurora background component (commented out)
// export const Aurora = dynamic(
//   () => import("@/components/ui/layout/aurora"),
//   { 
//     ssr: false, 
//     loading: AuroraLoadingSkeleton
//   }
// );

// Light Rays background component
export const LightRays = dynamic(
  () => import("@/components/ui/layout/light-rays"),
  { 
    ssr: false, 
    loading: AuroraLoadingSkeleton
  }
);

// Navigation components
export const AppSidebar = dynamic(
  () => import("@/components/features/navigation/app-sidebar").then(m => ({ default: m.AppSidebar })), 
  { 
    ssr: false, 
    loading: SidebarContainerLoadingSkeleton
  }
);

// Settings components
export const Settings = dynamic(
  () => import("@/components/ui/forms/settings"),
  { 
    ssr: false, 
    loading: () => <ComponentLoadingSkeleton />
  }
);

export const SettingsSidebarPanel = dynamic(
  () => import("@/components/ui/forms/settings").then(m => ({ default: m.SettingsSidebarPanel })),
  { 
    ssr: false, 
    loading: () => null 
  }
);

// Theme toggle
export const ThemeToggle = dynamic(
  () => import("@/components/ui/navigation/theme-toggle"), 
  { 
    ssr: false, 
    loading: () => <ComponentLoadingSkeleton />
  }
);

// Main layout components
export const Thread = dynamic(
  () => import("@/components/features/chat/thread").then(m => ({ default: m.Thread })),
  { 
    ssr: false, 
    loading: ThreadLoadingSkeleton
  }
);

export const CryptoDashboard = dynamic(
  () => import("@/components/features/crypto/crypto-dashboard").then(m => ({ default: m.CryptoDashboard })),
  { 
    ssr: false, 
    loading: DashboardLoadingSkeleton
  }
);

// Sidebar components
export const ThreadList = dynamic(
  () => import("@/components/features/chat/thread-list").then(m => ({ default: m.ThreadList })), 
  { 
    ssr: false, 
    loading: SidebarLoadingSkeleton
  }
);


/**
 * Utility function to create dynamic imports with consistent configuration
 */
export function createDynamicImport<P extends object = Record<string, unknown>>(
  importFn: () => Promise<{ default: ComponentType<P> }>,
  loadingComponent?: ComponentType,
  options: { ssr?: boolean } = {}
): ComponentType<P> {
  const LoadingComp = loadingComponent ?? ComponentLoadingSkeleton;
  return dynamic<P>(importFn, {
    ssr: options.ssr ?? false,
    loading: () => <LoadingComp />,
  });
}
