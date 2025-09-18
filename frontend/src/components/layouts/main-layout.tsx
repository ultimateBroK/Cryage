"use client";

import React, { useState, useEffect, Suspense } from "react";
import { MainLayoutProps, TabType } from "@/types/components";
import { Thread, CryptoDashboard } from "@/lib/dynamic-imports";
import { ThreadLoadingSkeleton, DashboardLoadingSkeleton } from "@/components/common/loading-skeletons";

/**
 * MainLayout Component
 * 
 * Handles the main content area with tab-based navigation between chat and dashboard.
 * Uses dynamic imports for better performance and proper loading states.
 * 
 * @param activeTab - Currently active tab ("chat" | "dashboard")
 * @param onTabChange - Callback function when tab changes
 * @param unreadMessageCount - Number of unread messages for notifications
 * @param systemNotificationCount - Number of system notifications
 */

const MainLayoutComponent: React.FC<MainLayoutProps> = ({ 
  activeTab = "chat", 
  onTabChange: _onTabChange, 
  unreadMessageCount: _unreadMessageCount = 0, 
  systemNotificationCount: _systemNotificationCount = 0 
}) => {
  const [preloadedTabs, setPreloadedTabs] = useState<Set<TabType>>(new Set(["chat"]));
  const [isClient, setIsClient] = useState(false);

  // Ensure we're on the client side for proper hydration
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Smart preloading strategy for better performance
  useEffect(() => {
    if (!isClient) return;
    
    const preloadDashboard = setTimeout(() => {
      if (!preloadedTabs.has("dashboard")) {
        import("@/components/features/crypto/crypto-dashboard")
          .then(() => {
            setPreloadedTabs(prev => new Set(prev).add("dashboard"));
          })
          .catch((error) => {
            console.warn("Failed to preload dashboard:", error);
          });
      }
    }, 2000);

    return () => clearTimeout(preloadDashboard);
  }, [preloadedTabs, isClient]);

  // Render appropriate content based on active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case "chat":
        return (
          <div className="flex-1 overflow-hidden">
            <Suspense fallback={<ThreadLoadingSkeleton />}>
              <Thread />
            </Suspense>
          </div>
        );
      case "dashboard":
        return (
          <div className="flex-1 overflow-hidden">
            <Suspense fallback={<DashboardLoadingSkeleton />}>
              <CryptoDashboard />
            </Suspense>
          </div>
        );
      default:
        return (
          <div className="flex-1 overflow-hidden">
            <ThreadLoadingSkeleton />
          </div>
        );
    }
  };

  // During SSR, render a simple loading state
  if (!isClient) {
    return (
      <div className="flex-1 overflow-hidden">
        <div className="h-full flex flex-col">
          <div className="flex-1 overflow-hidden">
            <ThreadLoadingSkeleton />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-hidden">
      <div className="h-full flex flex-col">
        {renderTabContent()}
      </div>
    </div>
  );
};

export const MainLayout = React.memo(MainLayoutComponent);
MainLayout.displayName = 'MainLayout';
