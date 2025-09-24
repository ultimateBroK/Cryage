import React from "react";
import { MessageSquare, BarChart3 } from "lucide-react";
import { SidebarTrigger } from "@/components/ui";
import { Settings } from "@/services/dynamic-imports";
import { HeaderSectionProps } from "@/types/components";
import { useIsMobile, useDeviceType } from "@/hooks/use-mobile";

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
  const isMobile = useIsMobile();
  const deviceType = useDeviceType();

  return (
    <header className="flex h-12 sm:h-16 shrink-0 items-center gap-1.5 sm:gap-3 bg-background/40 backdrop-blur-xl border-b border-white/20 pl-1.5 sm:pl-4 pr-0 sticky top-0 z-20 shadow-lg safe-area-inset-top">
      {/* Left side - Sidebar Trigger */}
      <div className="flex items-center justify-center w-7 h-7 sm:w-9 sm:h-9 flex-shrink-0 touch-target">
        <SidebarTrigger className="h-4.5 w-4.5 sm:h-6 sm:w-6" />
      </div>
      
      {/* Center - Tab Navigation */}
      <div className="flex-1 flex justify-center items-center px-1 sm:px-4 min-w-0">
        <div className="flex items-center bg-background/60 backdrop-blur-xl border border-white/25 rounded-lg p-0.5 sm:p-1.5 gap-1 sm:gap-2 shadow-lg">
          <button
            onClick={() => onTabChange("chat")}
            className={`flex items-center justify-center gap-1 sm:gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2.5 rounded-md text-[13px] sm:text-base font-medium transition-all duration-300 ease-out transform-gpu touch-target relative ${
              isMobile ? 'w-[62px]' : deviceType === 'tablet' ? 'w-[96px]' : 'w-[120px]'
            } ${
              activeTab === "chat"
                ? "bg-primary text-primary-foreground shadow-lg scale-105 z-10 ring-2 ring-primary/20"
                : "text-foreground/80 hover:text-foreground hover:bg-background/70 scale-95 hover:scale-100 backdrop-blur-sm"
            }`}
            style={{
              transformOrigin: 'center',
            }}
          >
            <MessageSquare className={`w-4 h-4 sm:w-5 sm:h-5 transition-all duration-300 flex-shrink-0 block ${activeTab === "chat" ? "scale-110" : "scale-100"}`} />
            <span className={`whitespace-nowrap ${isMobile ? 'hidden' : 'inline'}`}>Chat</span>
            {unreadMessageCount > 0 && (
              <span className={`absolute -top-1 -right-1 sm:-top-1.5 sm:-right-1.5 bg-destructive text-destructive-foreground text-[10px] rounded-full flex items-center justify-center animate-pulse font-bold ${
                isMobile ? 'w-4 h-4 text-[9px]' : 'w-5 h-5 sm:w-6 sm:h-6'
              }`}>
                {unreadMessageCount > 9 ? '9+' : unreadMessageCount}
              </span>
            )}
          </button>
          <button
            onClick={() => onTabChange("dashboard")}
            className={`flex items-center justify-center gap-1 sm:gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2.5 rounded-md text-[13px] sm:text-base font-medium transition-all duration-300 ease-out transform-gpu touch-target relative ${
              isMobile ? 'w-[62px]' : deviceType === 'tablet' ? 'w-[96px]' : 'w-[120px]'
            } ${
              activeTab === "dashboard"
                ? "bg-primary text-primary-foreground shadow-lg scale-105 z-10 ring-2 ring-primary/20"
                : "text-foreground/80 hover:text-foreground hover:bg-background/70 scale-95 hover:scale-100 backdrop-blur-sm"
            }`}
            style={{
              transformOrigin: 'center',
            }}
          >
            <BarChart3 className={`w-4 h-4 sm:w-5 sm:h-5 transition-all duration-300 flex-shrink-0 block ${activeTab === "dashboard" ? "scale-110" : "scale-100"}`} />
            <span className={`whitespace-nowrap ${isMobile ? 'hidden' : 'inline'}`}>Dashboard</span>
            {systemNotificationCount > 0 && (
              <span className={`absolute -top-1 -right-1 sm:-top-1.5 sm:-right-1.5 bg-secondary text-secondary-foreground text-[10px] rounded-full flex items-center justify-center animate-pulse font-bold ${
                isMobile ? 'w-4 h-4 text-[9px]' : 'w-5 h-5 sm:w-6 sm:h-6'
              }`}>
                {systemNotificationCount > 9 ? '9+' : systemNotificationCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Right side - Settings */}
      <div className="flex items-center justify-center h-7 sm:h-9 flex-shrink-0 pr-1.5 sm:pr-4">
        <div className="relative group touch-target flex items-center justify-center">
          <Settings />
          {/* Settings background similar to sidebar */}
          <div className="absolute inset-0 bg-background/60 backdrop-blur-xl border border-white/25 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 -z-10 shadow-lg" />
        </div>
      </div>
    </header>
  );
};

export default AppHeader;