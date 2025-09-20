import React from "react";
import Link from "next/link";
import { MessageSquare, BarChart3 } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Brand } from "@/components/ui/brand";
import { Settings } from "@/lib/dynamic-imports";
import { HeaderSectionProps } from "@/types/components";

/**
 * AppHeader Component
 * 
 * Main application header with brand logo, tab navigation, and settings.
 * The brand logo is always visible even when sidebar is collapsed.
 * 
 * Features:
 * - Brand logo on the left (always visible)
 * - Center tab navigation with notification badges
 * - Settings button on the right
 * - Fully responsive design
 * - Glass morphism styling
 */
export const AppHeader: React.FC<HeaderSectionProps> = ({ 
  activeTab, 
  onTabChange, 
  unreadMessageCount = 0, 
  systemNotificationCount = 0 
}) => {
  return (
    <header className="flex h-14 sm:h-16 shrink-0 items-center gap-2 sm:gap-3 bg-background/40 backdrop-blur-xl border-b border-white/20 pl-2 sm:pl-4 pr-0 sticky top-0 z-20 shadow-lg">
      {/* Left side - Brand Logo + Sidebar Trigger */}
      <div className="flex items-center gap-1 sm:gap-2 min-w-0 flex-shrink-0 w-[120px] sm:w-[140px] md:w-[160px]">
        {/* Sidebar Trigger */}
        <div className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9">
          <SidebarTrigger className="h-5 w-5 sm:h-6 sm:w-6" />
        </div>
        
        {/* Brand Logo - Always visible */}
        <Link 
          href="/" 
          className="flex items-center min-w-0"
          onClick={(e) => e.preventDefault()}
        >
          <Brand 
            size="sm"
            variant="header"
            showText={true}
            showSubtext={false}
            className="min-w-0"
          />
        </Link>
      </div>
      
      {/* Center - Tab Navigation */}
      <div className="flex-1 flex justify-center items-center px-2 sm:px-4 min-w-0">
        <div className="flex items-center bg-background/60 backdrop-blur-xl border border-white/25 rounded-xl p-1 sm:p-1.5 gap-1 sm:gap-2 shadow-lg">
          <button
            onClick={() => onTabChange("chat")}
            className={`flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg text-sm sm:text-base font-medium transition-all duration-300 ease-out transform-gpu w-[80px] sm:w-[100px] md:w-[120px] relative ${
              activeTab === "chat"
                ? "bg-primary text-primary-foreground shadow-lg scale-105 z-10 ring-2 ring-primary/20"
                : "text-foreground/80 hover:text-foreground hover:bg-background/70 scale-95 hover:scale-100 backdrop-blur-sm"
            }`}
            style={{
              transformOrigin: 'center',
            }}
          >
            <MessageSquare className={`w-4 h-4 sm:w-5 sm:h-5 transition-all duration-300 flex-shrink-0 block ${activeTab === "chat" ? "scale-110" : "scale-100"}`} />
            <span className="hidden sm:inline whitespace-nowrap">Chat</span>
            {unreadMessageCount > 0 && (
              <span className="absolute -top-1 -right-1 sm:-top-1.5 sm:-right-1.5 bg-destructive text-destructive-foreground text-xs rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center animate-pulse text-[10px] sm:text-xs font-bold">
                {unreadMessageCount > 9 ? '9+' : unreadMessageCount}
              </span>
            )}
          </button>
          <button
            onClick={() => onTabChange("dashboard")}
            className={`flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg text-sm sm:text-base font-medium transition-all duration-300 ease-out transform-gpu w-[80px] sm:w-[100px] md:w-[120px] relative ${
              activeTab === "dashboard"
                ? "bg-primary text-primary-foreground shadow-lg scale-105 z-10 ring-2 ring-primary/20"
                : "text-foreground/80 hover:text-foreground hover:bg-background/70 scale-95 hover:scale-100 backdrop-blur-sm"
            }`}
            style={{
              transformOrigin: 'center',
            }}
          >
            <BarChart3 className={`w-4 h-4 sm:w-5 sm:h-5 transition-all duration-300 flex-shrink-0 block ${activeTab === "dashboard" ? "scale-110" : "scale-100"}`} />
            <span className="hidden sm:inline whitespace-nowrap">Dashboard</span>
            {systemNotificationCount > 0 && (
              <span className="absolute -top-1 -right-1 sm:-top-1.5 sm:-right-1.5 bg-secondary text-secondary-foreground text-xs rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center animate-pulse text-[10px] sm:text-xs font-bold">
                {systemNotificationCount > 9 ? '9+' : systemNotificationCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Right side - Settings */}
      <div className="flex items-center justify-end h-8 sm:h-9 flex-shrink-0 w-[120px] sm:w-[140px] md:w-[160px] pr-2 sm:pr-4">
        <div className="relative group">
          <Settings />
          {/* Settings background similar to sidebar */}
          <div className="absolute inset-0 bg-background/60 backdrop-blur-xl border border-white/25 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 -z-10 shadow-lg" />
        </div>
      </div>
    </header>
  );
};

export default AppHeader;