"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  BarChart3,
  Bell,
  Star,
  AlertTriangle,
  Globe,
  Zap,
  Target,
  Settings
} from "lucide-react";
import dynamic from "next/dynamic";
import { MotionDiv, Presence } from "@/components/motion";

// Dynamic imports for performance with loading state
const ThreadList = dynamic(() => import("./assistant-ui/thread-list").then(m => m.ThreadList), { 
  ssr: false, 
  loading: () => (
    <div className="flex flex-col gap-2 p-3">
      {/* New Thread Button Skeleton */}
      <div className="h-9 rounded-lg border border-dashed bg-muted/20 animate-pulse" />
      {/* Thread Items Skeleton */}
      {[...Array(3)].map((_, i) => (
        <div key={i} className="h-10 rounded-lg bg-muted/20 animate-pulse" />
      ))}
    </div>
  )
});

interface ContextualSidebarProps {
  activeTab: string;
}

export const ContextualSidebar: React.FC<ContextualSidebarProps> = ({ activeTab }) => {
  let content: React.ReactNode;
  if (activeTab === 'chat') {
    content = <ChatSidebar />;
  } else if (activeTab === 'dashboard') {
    content = <DashboardSidebar />;
  } else {
    content = <SettingsSidebar />;
  }

  return (
    <Presence>
      <MotionDiv
        key={activeTab}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        className="h-full"
      >
        {content}
      </MotionDiv>
    </Presence>
  );
};

// Chat Sidebar - Thread management
const ChatSidebar: React.FC = () => {
  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Thread List */}
      <div className="flex-1 overflow-hidden p-3 will-change-transform">
        <ThreadList />
      </div>
    </div>
  );
};

// Dashboard Sidebar - Market stats and quick actions
const DashboardSidebar: React.FC = () => {
  // Mock data - in real app, this would come from API
  const marketStats = {
    globalCap: "$2.1T",
    dailyVolume: "$89.2B",
    btcDominance: "56.2%",
    fearGreedIndex: 65,
    activeAlerts: 3,
    watchlistCount: 12
  };

  const topMovers = [
    { symbol: "SOL", change: "+12.5%", price: "$145.20" },
    { symbol: "AVAX", change: "+8.3%", price: "$32.45" },
    { symbol: "DOT", change: "-5.2%", price: "$6.85" },
    { symbol: "LINK", change: "-3.8%", price: "$14.20" }
  ];

  return (
    <div className="flex flex-col h-full min-h-0 space-y-3 p-3 sm:space-y-4 sm:p-4 will-change-transform overflow-y-auto">
      {/* Market Overview */}
      <Card className="crypto-card-cyan dark:crypto-card-glass-dark dark:shadow-lg flex-shrink-0">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2 dark:text-slate-200">
            <Globe className="w-4 h-4 dark:text-blue-400" />
            Market Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground dark:text-slate-400">Global Cap</span>
            <span className="text-sm font-medium dark:text-slate-200">{marketStats.globalCap}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground dark:text-slate-400">24h Volume</span>
            <span className="text-sm font-medium dark:text-slate-200">{marketStats.dailyVolume}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground dark:text-slate-400">BTC Dominance</span>
            <span className="text-sm font-medium dark:text-slate-200">{marketStats.btcDominance}</span>
          </div>
          <Separator />
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground dark:text-slate-400">Fear & Greed</span>
            <Badge variant={marketStats.fearGreedIndex > 70 ? "default" : marketStats.fearGreedIndex > 30 ? "secondary" : "destructive"} className="dark:bg-orange-600 dark:text-white">
              {marketStats.fearGreedIndex}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Top Movers */}
      <Card className="crypto-card-cyan dark:crypto-card-glass-dark dark:shadow-lg flex-shrink-0">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2 dark:text-slate-200">
            <Zap className="w-4 h-4 dark:text-yellow-400" />
            Top Movers
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {topMovers.map((mover) => (
            <div key={mover.symbol} className="flex justify-between items-center">
              <span className="text-sm font-medium dark:text-slate-200">{mover.symbol}</span>
              <div className="flex items-center gap-1">
                <span className="text-xs text-muted-foreground dark:text-slate-400">{mover.price}</span>
                <span className={`text-xs ${mover.change.startsWith('+') ? 'crypto-text-green dark:crypto-text-green-dark' : 'crypto-text-red dark:crypto-text-red-dark'}`}>
                  {mover.change}
                </span>
              </div>
            </div>
           ))}
          </CardContent>
         </Card>

       {/* Quick Actions */}
      <Card className="crypto-card-cyan dark:crypto-card-glass-dark dark:shadow-lg flex-shrink-0">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2 dark:text-slate-200">
            <Target className="w-4 h-4 dark:text-purple-400" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button variant="outline" size="sm" className="w-full justify-start dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white dark:transition-colors">
            <Bell className="w-4 h-4 mr-2 dark:text-orange-400" />
            Set Alert
          </Button>
          <Button variant="outline" size="sm" className="w-full justify-start dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white dark:transition-colors">
            <Star className="w-4 h-4 mr-2 dark:text-yellow-400" />
            Watchlist ({marketStats.watchlistCount})
          </Button>
          <Button variant="outline" size="sm" className="w-full justify-start dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white dark:transition-colors">
            <BarChart3 className="w-4 h-4 mr-2 dark:text-green-400" />
            View Charts
          </Button>
          </CardContent>
         </Card>

       {/* Active Alerts */}
      {marketStats.activeAlerts > 0 && (
        <Card className="crypto-card-cyan border-orange-200 bg-orange-50/50 dark:border-orange-600 dark:bg-orange-950/30 dark:shadow-lg flex-shrink-0">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2 text-orange-700 dark:text-orange-300">
              <AlertTriangle className="w-4 h-4 dark:text-orange-400" />
              Active Alerts ({marketStats.activeAlerts})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-xs text-orange-600 dark:text-orange-300 dark:drop-shadow-sm">
              • BTC above $45,000
            </div>
            <div className="text-xs text-orange-600 dark:text-orange-300 dark:drop-shadow-sm">
              • ETH RSI oversold
            </div>
            <div className="text-xs text-orange-600 dark:text-orange-300 dark:drop-shadow-sm">
              • SOL volume spike
            </div>
         </CardContent>
       </Card>
      )}
    </div>
  );
};

// Settings Sidebar - Quick settings access
const SettingsSidebar: React.FC = () => {
  return (
    <div className="flex flex-col h-full min-h-0 space-y-3 p-3 sm:space-y-4 sm:p-4 will-change-transform overflow-y-auto">
      <Card className="crypto-card-cyan dark:crypto-card-glass-dark dark:shadow-lg flex-shrink-0">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2 dark:text-slate-200">
            <Settings className="w-4 h-4 dark:text-gray-400" />
            Quick Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm dark:text-slate-300">Auto-refresh</span>
            <Badge variant="secondary" className="dark:bg-slate-700 dark:text-slate-300">30s</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm dark:text-slate-300">Theme</span>
            <Badge variant="outline" className="dark:border-slate-600 dark:text-slate-300">Dark</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm dark:text-slate-300">API Status</span>
            <Badge variant="default" className="dark:bg-green-600 dark:text-white">Connected</Badge>
          </div>
        </CardContent>
      </Card>

      <Card className="crypto-card-cyan dark:crypto-card-glass-dark dark:shadow-lg flex-shrink-0">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm dark:text-slate-200">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="text-xs text-muted-foreground dark:text-slate-400">
            • API key updated - 2h ago
          </div>
          <div className="text-xs text-muted-foreground dark:text-slate-400">
            • Settings exported - 1d ago
          </div>
          <div className="text-xs text-muted-foreground dark:text-slate-400">
            • Theme changed - 3d ago
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
