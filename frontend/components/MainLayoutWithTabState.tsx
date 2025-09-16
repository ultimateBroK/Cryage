"use client";

import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, BarChart3 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import dynamic from "next/dynamic";

// Dynamic imports for better performance
const Thread = dynamic(
  () => import("@/components/assistant-ui/thread").then(m => ({ default: m.Thread })),
  { ssr: false, loading: () => null }
);

const CryptoDashboard = dynamic(
  () => import("@/components/CryptoDashboard").then(m => ({ default: m.CryptoDashboard })),
  { ssr: false, loading: () => <div className="p-4">Loading dashboard...</div> }
);



interface MainLayoutWithTabStateProps {
  onTabChange: (tab: string) => void;
  unreadMessageCount?: number;
  systemNotificationCount?: number;
}

export const MainLayoutWithTabState: React.FC<MainLayoutWithTabStateProps> = ({
  onTabChange,
  unreadMessageCount = 0,
  systemNotificationCount = 0
}) => {
  const [activeTab, setActiveTab] = useState("chat");

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    onTabChange(tab);
  };

  return (
    <div className="flex-1 overflow-hidden">
      <Tabs value={activeTab} onValueChange={handleTabChange} className="h-full flex flex-col">
        <TabsList className="flex w-full max-w-md mx-auto px-2 sm:px-4 mt-2 sm:mt-3 mb-2 gap-1">
          <TabsTrigger
            value="chat"
            className="flex-1 w-full flex items-center justify-center gap-2 min-h-[40px] touch-manipulation relative"
          >
            <MessageSquare className="w-5 h-5 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline text-sm">Chat</span>
            {unreadMessageCount > 0 && (
              <Badge
                variant="destructive"
                className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
              >
                {unreadMessageCount > 9 ? '9+' : unreadMessageCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger
            value="dashboard"
            className="flex-1 w-full flex items-center justify-center gap-2 min-h-[40px] touch-manipulation relative"
          >
            <BarChart3 className="w-5 h-5 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline text-sm">Dashboard</span>
            {systemNotificationCount > 0 && (
              <Badge
                variant="secondary"
                className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
              >
                {systemNotificationCount > 9 ? '9+' : systemNotificationCount}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="chat" className="flex-1 m-0 overflow-hidden">
          <Thread />
        </TabsContent>

        <TabsContent value="dashboard" className="flex-1 m-0 overflow-hidden">
          <CryptoDashboard />
        </TabsContent>
      </Tabs>
    </div>
  );
};