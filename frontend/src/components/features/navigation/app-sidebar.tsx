import * as React from "react"
import Link from "next/link"
import { CryageLogo } from "@/components/ui/cryage-logo"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { ContextualSidebar } from "./contextual-sidebar"

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  activeTab?: string;
}

export function AppSidebar({ activeTab = "chat", ...props }: AppSidebarProps) {
  const collapsibleMode = (activeTab === "chat" || activeTab === "dashboard") ? "offcanvas" : "icon" as const;
  return (
    <Sidebar collapsible={collapsibleMode} className="border-0 bg-background/60 backdrop-blur-md" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" tooltip="Cryage" asChild>
                <Link href="#" onClick={(e) => e.preventDefault()}>
                  <div className="flex items-center gap-3 w-full">
                    <div className="flex aspect-square size-8 items-center justify-center flex-shrink-0">
                      <CryageLogo size={32} />
                    </div>
                    <div className="flex items-center gap-2 group-data-[collapsible=icon]:hidden">
                      <div className="flex flex-col">
                        <span className="font-bold text-lg bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent animate-pulse">
                          Cryage
                        </span>
                        <div className="flex items-center gap-1">
                          <div className="w-1 h-1 rounded-full bg-green-400 animate-pulse"></div>
                          <span className="text-xs text-muted-foreground font-medium tracking-wide">
                            AI Crypto Agent
                          </span>
                          <div className="w-1 h-1 rounded-full bg-blue-400 animate-pulse animation-delay-500"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="p-0">
        <div className="group-data-[collapsible=icon]:hidden">
          <ContextualSidebar activeTab={activeTab} />
        </div>
      </SidebarContent>
    </Sidebar>
  )
}
