import { ReactNode } from "react";

/**
 * Component prop interfaces for better type safety and maintainability
 */

export interface MainLayoutProps {
  activeTab: string;
  onTabChange?: (tab: string) => void;
  unreadMessageCount?: number;
  systemNotificationCount?: number;
}

export interface HeaderSectionProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  unreadMessageCount: number;
  systemNotificationCount: number;
}

export interface PageTransitionWrapperProps {
  children: ReactNode;
}

export interface ContextualSidebarProps {
  activeTab: string;
}

export interface AppSidebarProps {
  activeTab?: string;
}

export interface LoadingSkeletonProps {
  width?: string;
  height?: string;
  className?: string;
}

export interface DynamicImportOptions {
  ssr?: boolean;
  loading?: () => React.ReactElement;
}

/**
 * Tab types for better type safety
 */
export type TabType = "chat" | "dashboard" | "settings";

/**
 * Notification types
 */
export interface Notification {
  id: string;
  type: "message" | "system";
  message: string;
  timestamp: Date;
  read: boolean;
}

/**
 * Thread types
 */
export interface Thread {
  id: string;
  title: string;
  lastMessage?: string;
  timestamp: Date;
  unreadCount: number;
}

/**
 * API Key storage interface
 */
export interface ApiKeyStorage {
  key: string;
  provider: "gemini" | "openai" | "anthropic";
  timestamp: Date;
}
