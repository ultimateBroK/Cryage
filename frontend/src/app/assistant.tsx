"use client";

import React, { useCallback } from "react";
import { AssistantRuntimeProvider } from "@assistant-ui/react";
import { useChatRuntime } from "@assistant-ui/react-ai-sdk";
import {
  SidebarInset,
  SidebarProvider,
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
import { useIsMobile, useDeviceType } from "@/hooks/use-mobile";
import { TabType } from "@/types/components";
import { AppHeader } from "@/components/features/navigation/app-header";
import { 
  LightRays, 
  AppSidebar, 
  SettingsSidebarPanel
} from "@/lib/dynamic-imports";

/**
 * Assistant Component
 * 
 * Main application component that provides the chat interface with AI capabilities.
 * Features tab-based navigation, dynamic imports for performance, and proper SSR handling.
 */

const API_KEY_STORAGE_KEY = "gemini-api-key";


/**
 * Main Assistant Component
 * 
 * Provides the complete chat interface with AI capabilities, sidebar navigation,
 * and settings panel. Handles API key management and keyboard shortcuts.
 */
export const Assistant: React.FC = () => {
  const runtime = useChatRuntime();
  const [activeTab, setActiveTab] = React.useState<TabType>("chat");
  const isMobile = useIsMobile();
  const deviceType = useDeviceType();
  
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
            <div className={`flex h-dvh w-full relative overflow-hidden ${
              isMobile 
                ? 'pr-0' 
                : deviceType === 'tablet' 
                  ? 'pr-0.5' 
                  : 'pr-0.5 sm:pr-1'
            }`}>
              <div className={`pointer-events-none absolute inset-0 z-10 ${
                isMobile 
                  ? 'blur-lg opacity-58 dark:opacity-46' 
                  : deviceType === 'tablet'
                    ? 'blur-xl sm:blur-2xl opacity-48 sm:opacity-50 dark:opacity-42 sm:dark:opacity-44'
                    : 'blur-2xl sm:blur-3xl opacity-46 sm:opacity-52 dark:opacity-40 sm:dark:opacity-46'
              } mix-blend-multiply dark:mix-blend-screen brightness-[1.12] sm:brightness-[1.15] dark:brightness-[1.15] sm:dark:brightness-[1.2] saturate-110 sm:saturate-125 contrast-[1.05] sm:contrast-[1.1]`}>
                <Idle delayMs={1200}>
                  <LightRays 
                    colorStops={["#00ffbb", "#10b981", "#00ffbb"]} 
                    amplitude={isMobile ? 0.92 : deviceType === 'tablet' ? 0.94 : 0.92} 
                    blend={isMobile ? 0.52 : deviceType === 'tablet' ? 0.48 : 0.44} 
                    raysSpeed={isMobile ? 0.8 : deviceType === 'tablet' ? 0.9 : 1.0}
                    raysOrigin="top-center"
                    lightSpread={isMobile ? 1.3 : deviceType === 'tablet' ? 1.25 : 1.2}
                    rayLength={isMobile ? 2.8 : deviceType === 'tablet' ? 2.6 : 2.5}
                    pulsating={true}
                    followMouse={!isMobile}
                    mouseInfluence={isMobile ? 0.1 : deviceType === 'tablet' ? 0.12 : 0.15}
                  />
                </Idle>
              </div>
              <AppSidebar activeTab={activeTab} />
               <SidebarInset>
                 <AppHeader 
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

