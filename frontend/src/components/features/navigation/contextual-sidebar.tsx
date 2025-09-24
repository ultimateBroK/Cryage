"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle, Badge, Button } from "@/components/ui";
import {
  AlertTriangle,
  Globe,
  Settings,
  TrendingUp,
  TrendingDown,
  Activity
} from "lucide-react";
import { MotionDiv, Presence } from "@/components/common/motion";
import { ContextualSidebarProps } from "@/types/components";
import { ThreadList } from "@/services/dynamic-imports";

/**
 * ContextualSidebar Component
 * 
 * Renders different sidebar content based on the active tab.
 * Provides smooth transitions between different sidebar states.
 */
export const ContextualSidebar: React.FC<ContextualSidebarProps> = ({ activeTab }) => {
  const renderSidebarContent = (): React.ReactNode => {
    switch (activeTab) {
      case 'chat':
        return <ChatSidebar />;
      case 'dashboard':
        return <DashboardSidebar />;
      case 'settings':
        return <SettingsSidebar />;
      default:
        return <ChatSidebar />;
    }
  };

  return (
    <Presence>
      <MotionDiv
        key={activeTab}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        className="h-full sm:h-full"
      >
        {renderSidebarContent()}
      </MotionDiv>
    </Presence>
  );
};

// Chat Sidebar - Thread management
const ChatSidebar: React.FC = () => {
  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Thread List */}
      <div className="flex-1 overflow-hidden p-2 sm:p-3 will-change-transform">
        <ThreadList />
      </div>
    </div>
  );
};

// Dashboard Sidebar - Market stats and quick actions
const DashboardSidebar: React.FC = () => {
  const [showMovers, setShowMovers] = React.useState(true); // true = movers, false = losers
  
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
    { symbol: "SOL", change: "+12.5%", price: "$145.20", isPositive: true },
    { symbol: "AVAX", change: "+8.3%", price: "$32.45", isPositive: true },
    { symbol: "ADA", change: "+7.8%", price: "$0.52", isPositive: true },
    { symbol: "MATIC", change: "+6.2%", price: "$0.85", isPositive: true }
  ];

  const topLosers = [
    { symbol: "DOT", change: "-5.2%", price: "$6.85", isPositive: false },
    { symbol: "LINK", change: "-3.8%", price: "$14.20", isPositive: false },
    { symbol: "UNI", change: "-4.1%", price: "$7.25", isPositive: false },
    { symbol: "ATOM", change: "-2.9%", price: "$9.15", isPositive: false }
  ];

  const currentData = showMovers ? topMovers : topLosers;

  const getFearGreedColor = (index: number) => {
    if (index > 70) return "from-green-500 to-emerald-600";
    if (index > 50) return "from-yellow-500 to-orange-500";
    if (index > 25) return "from-orange-500 to-red-500";
    return "from-red-500 to-red-700";
  };

  const getFearGreedLabel = (index: number) => {
    if (index > 75) return "Extreme Greed";
    if (index > 55) return "Greed";
    if (index > 45) return "Neutral";
    if (index > 25) return "Fear";
    return "Extreme Fear";
  };

  return (
    <div className="flex flex-col h-full min-h-0 space-y-2 p-2 sm:p-3 will-change-transform overflow-y-auto">
      {/* Market Overview */}
      <MotionDiv
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="relative overflow-hidden bg-gradient-to-br from-blue-50/80 to-cyan-50/80 dark:from-slate-900/60 dark:to-blue-900/30 border-blue-200/60 dark:border-blue-800/40 shadow-md transition-all duration-300 group">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/3 to-cyan-500/3 dark:from-blue-400/3 dark:to-cyan-400/3" />
          <CardHeader className="py-3 relative">
          <CardTitle className="text-[13px] md:text-sm flex items-center justify-start gap-1.5 text-blue-700 dark:text-blue-300 font-medium">
              <div className="p-1 sm:p-1.5 rounded-lg bg-blue-100/80 dark:bg-blue-900/50 group-hover:scale-110 transition-transform duration-200 flex-shrink-0">
                <Globe className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600 dark:text-blue-400" />
              </div>
              <span className="truncate">Market Overview</span>
          </CardTitle>
        </CardHeader>
          <CardContent className="space-y-2 py-2 relative">
            <div className="grid grid-cols-2 gap-2">
              <div className="text-center px-2 py-2.5 rounded-lg bg-white/60 dark:bg-slate-800/30 border border-blue-100/50 dark:border-blue-800/20">
                <div className="text-xs md:text-xs text-slate-600 dark:text-slate-400 mb-0.5 truncate">Global Cap</div>
                <div className="text-sm font-bold text-blue-800 dark:text-blue-300 truncate">{marketStats.globalCap}</div>
              </div>
              <div className="text-center px-2 py-2.5 rounded-lg bg-white/60 dark:bg-slate-800/30 border border-blue-100/50 dark:border-blue-800/20">
                <div className="text-xs md:text-xs text-slate-600 dark:text-slate-400 mb-0.5 truncate">24h Volume</div>
                <div className="text-sm font-bold text-blue-800 dark:text-blue-300 truncate">{marketStats.dailyVolume}</div>
              </div>
          </div>
            <div className="flex justify-between items-center px-2 py-2.5 rounded-lg bg-white/60 dark:bg-slate-800/30 border border-blue-100/50 dark:border-blue-800/20">
              <span className="text-xs md:text-xs text-slate-600 dark:text-slate-400 truncate">BTC Dominance</span>
              <span className="text-sm font-bold text-blue-800 dark:text-blue-300">{marketStats.btcDominance}</span>
          </div>
            
            {/* Fear & Greed Index with visual indicator */}
            <div className="p-2 rounded-lg bg-white/60 dark:bg-slate-800/30 border border-blue-100/50 dark:border-blue-800/20 space-y-1.5">
          <div className="flex justify-between items-center">
                <span className="text-xs md:text-xs text-slate-600 dark:text-slate-400">Fear & Greed</span>
                <span className="text-xs md:text-xs font-medium text-slate-500 dark:text-slate-400">{getFearGreedLabel(marketStats.fearGreedIndex)}</span>
          </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1.5 sm:h-2 bg-slate-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className={`h-full bg-gradient-to-r ${getFearGreedColor(marketStats.fearGreedIndex)} transition-all duration-500`}
                    style={{ width: `${marketStats.fearGreedIndex}%` }}
                  />
          </div>
                <span className="text-sm font-bold text-slate-700 dark:text-gray-300 min-w-[20px] text-center">{marketStats.fearGreedIndex}</span>
              </div>
            </div>
          </CardContent>
         </Card>
      </MotionDiv>

      {/* Top Movers/Losers with Toggle */}
      <MotionDiv
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <Card className={`relative overflow-hidden ${showMovers 
          ? 'bg-gradient-to-br from-green-50/80 to-emerald-50/80 dark:from-slate-900/60 dark:to-green-900/30 border-green-200/60 dark:border-green-800/40' 
          : 'bg-gradient-to-br from-red-50/80 to-rose-50/80 dark:from-slate-900/60 dark:to-red-900/30 border-red-200/60 dark:border-red-800/40'
        } shadow-md transition-all duration-300 group`}>
          <div className={`absolute inset-0 ${showMovers 
            ? 'bg-gradient-to-br from-green-500/3 to-emerald-500/3 dark:from-green-400/3 dark:to-emerald-400/3' 
            : 'bg-gradient-to-br from-red-500/3 to-rose-500/3 dark:from-red-400/3 dark:to-rose-400/3'
          }`} />
          <CardHeader className="py-3 relative">
            <div className="flex items-center justify-between gap-1">
              <CardTitle className={`text-sm md:text-sm flex items-center gap-1.5 ${showMovers 
                ? 'text-green-700 dark:text-green-300' 
                : 'text-red-700 dark:text-red-300'
              } font-medium`}>
                <div className={`p-1 sm:p-1.5 rounded-lg ${showMovers 
                  ? 'bg-green-100/80 dark:bg-green-900/50' 
                  : 'bg-red-100/80 dark:bg-red-900/50'
                } group-hover:scale-110 transition-transform duration-200 flex-shrink-0`}>
                  {showMovers ? (
                    <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-green-600 dark:text-green-400" />
                  ) : (
                    <TrendingDown className="w-3 h-3 sm:w-4 sm:h-4 text-red-600 dark:text-red-400" />
                  )}
                </div>
                <span className="truncate">{showMovers ? 'Top Movers' : 'Top Losers'}</span>
          </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowMovers(!showMovers)}
                className={`h-7 px-2 text-xs md:text-xs font-medium transition-all duration-200 flex-shrink-0 ${showMovers 
                  ? 'hover:bg-green-100 dark:hover:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-200/60 dark:border-green-800/30' 
                  : 'hover:bg-red-100 dark:hover:bg-red-900/30 text-red-700 dark:text-red-400 border border-red-200/60 dark:border-red-800/30'
                }`}
              >
                Switch
              </Button>
            </div>
        </CardHeader>
          <CardContent className="space-y-2 py-2 relative">
            {currentData.map((mover, index) => (
              <MotionDiv
                key={mover.symbol}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2, delay: 0.2 + index * 0.05 }}
                className={`flex justify-between items-center px-2 py-2.5 rounded-lg transition-all duration-200 cursor-pointer group/item border ${showMovers 
                  ? 'bg-white/60 dark:bg-slate-800/30 hover:bg-green-50/80 dark:hover:bg-green-900/10 border-green-100/50 dark:border-green-800/20' 
                  : 'bg-white/60 dark:bg-slate-800/30 hover:bg-red-50/80 dark:hover:bg-red-900/10 border-red-100/50 dark:border-red-800/20'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-slate-800 dark:text-gray-200 min-w-[32px] truncate">{mover.symbol}</span>
                  {mover.isPositive ? (
                    <TrendingUp className="w-3 h-3 text-green-500 flex-shrink-0" />
                  ) : (
                    <TrendingDown className="w-3 h-3 text-red-500 flex-shrink-0" />
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs md:text-xs text-slate-600 dark:text-slate-400 min-w-[45px] text-right truncate">{mover.price}</span>
                  <span className={`text-xs md:text-xs font-semibold px-1.5 py-0.5 rounded-full min-w-[45px] text-center ${
                    mover.isPositive 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border border-green-200/50 dark:border-green-800/30' 
                      : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border border-red-200/50 dark:border-red-800/30'
                  }`}>
                    {mover.change}
                  </span>
                </div>
              </MotionDiv>
            ))}
          </CardContent>
         </Card>
      </MotionDiv>


       {/* Active Alerts */}
      <MotionDiv
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
          <Card className="relative overflow-hidden bg-gradient-to-br from-orange-50/80 to-red-50/80 dark:from-slate-900/60 dark:to-orange-900/30 border-orange-200/60 dark:border-orange-800/40 shadow-md transition-all duration-300 group">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/3 to-red-500/3 dark:from-orange-400/3 dark:to-red-400/3" />
            <CardHeader className="py-3 relative">
              <CardTitle className="text-sm md:text-sm flex items-center justify-start gap-1.5 text-orange-800 dark:text-orange-300 font-medium">
                <div className="p-1 sm:p-1.5 rounded-lg bg-orange-100/80 dark:bg-orange-900/50 group-hover:scale-110 group-hover:animate-pulse transition-all duration-200 flex-shrink-0">
                  <AlertTriangle className="w-3 h-3 sm:w-4 sm:h-4 text-orange-600 dark:text-orange-400" />
                </div>
                <span className="truncate">Active Alerts</span>
                <Badge variant="destructive" className="text-xs md:text-xs px-1.5 py-0.5 bg-orange-600 text-white dark:bg-orange-600 border border-orange-200/60 dark:border-orange-800/30 flex-shrink-0">
                  {marketStats.activeAlerts}
                </Badge>
            </CardTitle>
          </CardHeader>
            <CardContent className="space-y-2 py-2 relative">
              <MotionDiv
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2, delay: 0.4 }}
                className="flex items-center gap-2 px-2 py-2.5 rounded-lg bg-white/60 dark:bg-slate-800/30 hover:bg-orange-50/80 dark:hover:bg-orange-900/10 transition-all duration-200 cursor-pointer border border-orange-100/50 dark:border-orange-800/20"
              >
                <Activity className="w-3 h-3 sm:w-4 sm:h-4 text-green-600 dark:text-green-400 animate-pulse flex-shrink-0" />
                <span className="text-xs md:text-xs text-orange-800 dark:text-orange-300 font-medium truncate">BTC above $45,000</span>
              </MotionDiv>
              <MotionDiv
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2, delay: 0.45 }}
                className="flex items-center gap-2 px-2 py-2.5 rounded-lg bg-white/60 dark:bg-slate-800/30 hover:bg-orange-50/80 dark:hover:bg-orange-900/10 transition-all duration-200 cursor-pointer border border-orange-100/50 dark:border-orange-800/20"
              >
                <Activity className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-600 dark:text-yellow-400 animate-pulse flex-shrink-0" />
                <span className="text-xs md:text-xs text-orange-800 dark:text-orange-300 font-medium truncate">ETH RSI oversold</span>
              </MotionDiv>
              <MotionDiv
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2, delay: 0.5 }}
                className="flex items-center gap-2 px-2 py-2.5 rounded-lg bg-white/60 dark:bg-slate-800/30 hover:bg-orange-50/80 dark:hover:bg-orange-900/10 transition-all duration-200 cursor-pointer border border-orange-100/50 dark:border-orange-800/20"
              >
                <Activity className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600 dark:text-blue-400 animate-pulse flex-shrink-0" />
                <span className="text-xs md:text-xs text-orange-800 dark:text-orange-300 font-medium truncate">SOL volume spike</span>
              </MotionDiv>
         </CardContent>
       </Card>
      </MotionDiv>
    </div>
  );
};

// Settings Sidebar - Quick settings access
const SettingsSidebar: React.FC = () => {
  return (
    <div className="flex flex-col h-full min-h-0 space-y-2.5 p-2 sm:p-3 will-change-transform overflow-y-auto">
      <Card className="crypto-card-cyan dark:crypto-card-glass-dark dark:shadow-lg flex-shrink-0">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center justify-start gap-2 dark:text-slate-200">
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
