"use client";

import React, { useCallback } from "react";
import { AssistantRuntimeProvider } from "@assistant-ui/react";
import { useChatRuntime } from "@assistant-ui/react-ai-sdk";
import { MessageSquare, BarChart3 } from "lucide-react";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  SettingsSidebarProvider,
  SettingsSidebarInset,
} from "@/components/ui/settings-sidebar";
import { ThreadTitleProvider } from "@/lib/thread-title-context";
import { Idle } from "@/components/common/idle";
import { MainLayout } from "@/components/layouts/main-layout";
import { useNotifications } from "@/hooks/use-notifications";
import { useAppShortcuts } from "@/hooks/use-keyboard-shortcuts";
import { HeaderSectionProps, TabType } from "@/types/components";
import { 
  Aurora, 
  AppSidebar, 
  Settings, 
  SettingsSidebarPanel, 
  ThemeToggle 
} from "@/lib/dynamic-imports";

/**
 * Assistant Component
 * 
 * Main application component that provides the chat interface with AI capabilities.
 * Features tab-based navigation, dynamic imports for performance, and proper SSR handling.
 */

const API_KEY_STORAGE_KEY = "gemini-api-key";

/**
 * HeaderSection Component
 * 
 * Renders the application header with tab navigation and action buttons.
 * Includes notification badges and responsive design.
 */
const HeaderSection: React.FC<HeaderSectionProps> = ({ 
  activeTab, 
  onTabChange, 
  unreadMessageCount, 
  systemNotificationCount 
}) => {
  return (
    <header className="flex h-12 sm:h-14 shrink-0 items-center gap-2 glass-toolbar-transparent px-2 sm:px-4 sticky top-0 z-20">
      <SidebarTrigger />
      
      {/* Integrated Tab Navigation with Scale Animation */}
      <div className="flex-1 flex justify-center">
        <div className="flex items-center bg-background/40 backdrop-blur-md border border-white/15 rounded-xl p-1 gap-1">
          <button
            onClick={() => onTabChange("chat")}
            className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ease-out transform-gpu w-28 sm:w-32 ${
              activeTab === "chat" 
                ? "bg-primary text-primary-foreground shadow-lg scale-110 z-10" 
                : "text-muted-foreground hover:text-foreground hover:bg-background/60 scale-90 hover:scale-95"
            }`}
            style={{
              transformOrigin: 'center',
            }}
          >
            <MessageSquare className={`w-4 h-4 transition-all duration-300 ${activeTab === "chat" ? "scale-110" : "scale-90"}`} />
            <span className="hidden sm:inline whitespace-nowrap">Chat</span>
            {unreadMessageCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                {unreadMessageCount > 9 ? '9+' : unreadMessageCount}
              </span>
            )}
          </button>
          <button
            onClick={() => onTabChange("dashboard")}
            className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ease-out transform-gpu w-28 sm:w-32 relative ${
              activeTab === "dashboard" 
                ? "bg-primary text-primary-foreground shadow-lg scale-110 z-10" 
                : "text-muted-foreground hover:text-foreground hover:bg-background/60 scale-90 hover:scale-95"
            }`}
            style={{
              transformOrigin: 'center',
            }}
          >
            <BarChart3 className={`w-4 h-4 transition-all duration-300 ${activeTab === "dashboard" ? "scale-110" : "scale-90"}`} />
            <span className="hidden sm:inline whitespace-nowrap">Dashboard</span>
            {systemNotificationCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-secondary text-secondary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                {systemNotificationCount > 9 ? '9+' : systemNotificationCount}
              </span>
            )}
          </button>
        </div>
      </div>

      <div className="flex items-center gap-1 sm:gap-2">
        <Settings />
        <ThemeToggle />
      </div>
    </header>
  );
};

/**
 * Main Assistant Component
 * 
 * Provides the complete chat interface with AI capabilities, sidebar navigation,
 * and settings panel. Handles API key management and keyboard shortcuts.
 */
export const Assistant: React.FC = () => {
  const runtime = useChatRuntime();
  const [activeTab, setActiveTab] = React.useState<TabType>("chat");
  
  // Notification counts for header display
  const { unreadNotifications } = useNotifications();
  const unreadMessageCount = unreadNotifications.filter(n => n.type === 'message').length;
  const systemNotificationCount = unreadNotifications.filter(n => n.type === 'system').length;

  // Keyboard shortcuts
  const handleToggleSettings = useCallback(() => {
    // This would need to be implemented to toggle the settings sidebar
    console.log('Toggle settings shortcut pressed');
  }, []);

  const handleSwitchToChat = useCallback(() => {
    setActiveTab('chat');
  }, []);

  const handleSwitchToDashboard = useCallback(() => {
    setActiveTab('dashboard');
  }, []);

  const handleNewChat = useCallback(() => {
    // This would create a new chat thread
    console.log('New chat shortcut pressed');
  }, []);

  useAppShortcuts(
    handleToggleSettings,
    handleSwitchToChat,
    handleSwitchToDashboard,
    handleNewChat
  );

  // Optimized fetch override with memoization
  const setupFetchOverride = React.useCallback(() => {
    const originalFetch = window.fetch;
    let cachedApiKey: string | null = null;

    window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url;

      if (url.includes('/api/chat') || url.includes('/api/generate-title')) {
        // Cache API key to avoid localStorage calls on every request
        if (!cachedApiKey) {
          cachedApiKey = localStorage.getItem(API_KEY_STORAGE_KEY);
        }

        if (cachedApiKey && init?.body) {
          try {
            const body = JSON.parse(init.body as string);
            body.apiKey = cachedApiKey;
            init.body = JSON.stringify(body);
          } catch {
            // If parsing fails, continue with original request
          }
        }
      }

      return originalFetch(input, init);
    };

    return () => {
      window.fetch = originalFetch;
      cachedApiKey = null;
    };
  }, []);

  React.useEffect(setupFetchOverride, [setupFetchOverride]);

  return (
    <ThreadTitleProvider>
      <AssistantRuntimeProvider runtime={runtime}>
        <SidebarProvider>
          <SettingsSidebarProvider>
            <div className="flex h-dvh w-full pr-0.5 relative overflow-hidden">
              <div className="pointer-events-none absolute inset-0 z-10 blur-2xl sm:blur-3xl opacity-40 sm:opacity-45 dark:opacity-35 sm:dark:opacity-40 mix-blend-multiply dark:mix-blend-screen brightness-[1.12] sm:brightness-[1.15] dark:brightness-[1.15] sm:dark:brightness-[1.2] saturate-110 sm:saturate-125 contrast-[1.05] sm:contrast-[1.1]">
                <Idle delayMs={1200}>
                  <Aurora colorStops={["#00ffbb", "#10b981", "#00ffbb"]} amplitude={0.8} blend={0.38} speed={1.0} />
                </Idle>
              </div>
              <AppSidebar activeTab={activeTab} />
               <SidebarInset>
                 <HeaderSection 
                   activeTab={activeTab}
                   onTabChange={(tab: string) => setActiveTab(tab as TabType)}
                   unreadMessageCount={unreadMessageCount}
                   systemNotificationCount={systemNotificationCount}
                 />
                  <SettingsSidebarInset>
                  <MainLayout
                    activeTab={activeTab}
                    onTabChange={(tab: string) => setActiveTab(tab as TabType)}
                    unreadMessageCount={unreadMessageCount}
                    systemNotificationCount={systemNotificationCount}
                  />
                  </SettingsSidebarInset>
               </SidebarInset>
              <SettingsSidebarPanel />
            </div>
          </SettingsSidebarProvider>
        </SidebarProvider>
      </AssistantRuntimeProvider>
    </ThreadTitleProvider>
  );
};

