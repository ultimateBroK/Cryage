"use client";

import React, { useCallback } from "react";
import { AssistantRuntimeProvider } from "@assistant-ui/react";
import { useChatRuntime } from "@assistant-ui/react-ai-sdk";
import dynamic from "next/dynamic";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  SettingsSidebarProvider,
  SettingsSidebarInset,
} from "@/components/ui/settings-sidebar";
import { Separator } from "@/components/ui/separator";
import { ThreadTitleProvider } from "@/lib/thread-title-context";
import { Idle } from "@/components/idle";
import { MainLayoutWithTabState } from "@/components/main-layout-with-tab-state";
import { useNotifications } from "@/hooks/use-notifications";
import { useAppShortcuts } from "@/hooks/use-keyboard-shortcuts";

// Thread is now imported in MainLayout component

// Defer Aurora (and its ogl dep) to browser idle to keep first load JS small
const Aurora = dynamic(
  () => import("@/blocks/Backgrounds/Aurora/Aurora"),
  { ssr: false, loading: () => <div className="absolute inset-0" /> }
);

const AppSidebar = dynamic(
  () => import("@/components/app-sidebar").then(m => ({ default: m.AppSidebar })), 
  { ssr: false, loading: () => <div className="w-64 border-r" /> }
);

const Settings = dynamic(
  () => import("@/components/ui/settings"),
  { ssr: false, loading: () => <div className="w-10 h-10" /> }
);

const SettingsSidebarPanel = dynamic(
  () => import("@/components/ui/settings").then(m => ({ default: m.SettingsSidebarPanel })),
  { ssr: false, loading: () => null }
);

const ThemeToggle = dynamic(
  () => import("@/components/ui/theme-toggle"), 
  { ssr: false, loading: () => <div className="w-10 h-10" /> }
);

// Simple app name display instead of breadcrumb
const AppHeader = () => {
  return (
    <div className="flex items-center space-x-2">
      <span className="text-base sm:text-lg font-semibold text-foreground">Cryage</span>
      <span className="text-xs sm:text-sm text-muted-foreground hidden sm:inline">• Crypto agent</span>
    </div>
  );
};

const API_KEY_STORAGE_KEY = "gemini-api-key";

// Separate header component for better code organization
const HeaderSection: React.FC = () => {
  return (
    <header className="flex h-14 sm:h-16 shrink-0 items-center gap-2 border-b px-2 sm:px-4">
      <SidebarTrigger />
      <Separator orientation="vertical" className="mr-2 h-4" />
      <AppHeader />
      <div className="ml-auto flex items-center gap-1 sm:gap-2">
        <Settings />
        <ThemeToggle />
      </div>
    </header>
  );
};

export const Assistant = () => {
  const runtime = useChatRuntime();
  const [activeTab, setActiveTab] = React.useState("chat");
  const { unreadNotifications } = useNotifications();

  // Separate counts for different types
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
              <div className="pointer-events-none absolute inset-0 z-10 blur-3xl opacity-45 dark:opacity-40 mix-blend-multiply dark:mix-blend-screen brightness-[1.15] dark:brightness-[1.2] saturate-125 contrast-[1.1]">
                <Idle delayMs={1200}>
                  <Aurora colorStops={["#00ffbb", "#10b981", "#00ffbb"]} amplitude={1.0} blend={0.42} speed={1.15} />
                </Idle>
              </div>
              <AppSidebar activeTab={activeTab} />
               <SidebarInset>
                 <HeaderSection />
                  <SettingsSidebarInset>
                    <MainLayoutWithTabState
                      onTabChange={setActiveTab}
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
