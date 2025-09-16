"use client";

import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, BarChart3, Settings } from "lucide-react";
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

const SettingsPanel = dynamic(
  () => import("@/components/SettingsPanel").then(m => ({ default: m.SettingsPanel })),
  { ssr: false, loading: () => <div className="p-4">Loading settings...</div> }
);

export const MainLayout = () => {
  const [activeTab, setActiveTab] = useState("chat");

  return (
    <div className="flex-1 overflow-hidden">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
        <TabsList className="grid w-full grid-cols-3 mx-4 mt-4 mb-2 bg-muted/50">
          <TabsTrigger value="chat" className="flex items-center gap-2 data-[state=active]:bg-background">
            <MessageSquare className="w-4 h-4" />
            <span className="hidden sm:inline">Chat</span>
          </TabsTrigger>
          <TabsTrigger value="dashboard" className="flex items-center gap-2 data-[state=active]:bg-background">
            <BarChart3 className="w-4 h-4" />
            <span className="hidden sm:inline">Dashboard</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2 data-[state=active]:bg-background">
            <Settings className="w-4 h-4" />
            <span className="hidden sm:inline">Settings</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="chat" className="flex-1 m-0 overflow-hidden">
          <Thread />
        </TabsContent>

        <TabsContent value="dashboard" className="flex-1 m-0 overflow-hidden">
          <CryptoDashboard />
        </TabsContent>

        <TabsContent value="settings" className="flex-1 m-0 overflow-hidden">
          <SettingsPanel />
        </TabsContent>
      </Tabs>
    </div>
  );
};