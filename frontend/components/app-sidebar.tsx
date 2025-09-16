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
  SidebarRail,
} from "@/components/ui/sidebar"
import { ContextualSidebar } from "./ContextualSidebar"

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  activeTab?: string;
}

export function AppSidebar({ activeTab = "chat", ...props }: AppSidebarProps) {
  const collapsibleMode = activeTab === "chat" ? "offcanvas" : "icon" as const;
  return (
    <Sidebar collapsible={collapsibleMode} {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" tooltip="Cryage" asChild>
                <Link href="#" onClick={(e) => e.preventDefault()}>
                  <div className="flex aspect-square size-8 items-center justify-center">
                    <CryageLogo size={32} />
                  </div>
                  <div className="flex flex-col gap-0.5 leading-none group-data-[collapsible=icon]:hidden">
                    <span className="font-semibold text-lg">Cryage</span>
                    <span className="text-xs text-muted-foreground">Crypto agent</span>
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

      <SidebarRail />
    </Sidebar>
  )
}
