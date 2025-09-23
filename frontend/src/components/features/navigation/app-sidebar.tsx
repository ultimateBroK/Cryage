import * as React from "react"
import Link from "next/link"
import {
  Sidebar,
  SidebarContent,
} from "@/components/ui/sidebar"
import { Brand } from "@/components/ui/brand"
import { ContextualSidebar } from "./contextual-sidebar"

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  activeTab?: string;
}

export function AppSidebar({ activeTab = "chat", ...props }: AppSidebarProps) {
  const collapsibleMode = (activeTab === "chat" || activeTab === "dashboard") ? "offcanvas" : "icon" as const;
  return (
    <Sidebar collapsible={collapsibleMode} className="border-0 bg-background/60 backdrop-blur-md" {...props}>
      <SidebarContent className="p-0 flex flex-col h-full">
        {/* Brand Logo at top - sticky */}
        <div className="w-full flex-shrink-0 sticky top-0 z-10 bg-background/60 backdrop-blur-md border-b border-white/10">
          <Link 
            href="/" 
            className="flex items-center pl-4 sm:pl-6 py-4"
            onClick={(e) => e.preventDefault()}
          >
            <Brand 
              size="lg"
              variant="header"
              showText={true}
              showSubtext={true}
              className="min-w-0 scale-90"
            />
          </Link>
        </div>
        
        {/* Scrollable content area */}
        <div className="flex-1 overflow-y-auto pt-0">
          <div className="group-data-[collapsible=icon]:hidden">
            <ContextualSidebar activeTab={activeTab} />
          </div>
        </div>
      </SidebarContent>
    </Sidebar>
  )
}
