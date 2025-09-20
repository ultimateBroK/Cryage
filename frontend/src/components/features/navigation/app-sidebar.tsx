import * as React from "react"
import {
  Sidebar,
  SidebarContent,
} from "@/components/ui/sidebar"
import { ContextualSidebar } from "./contextual-sidebar"

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  activeTab?: string;
}

export function AppSidebar({ activeTab = "chat", ...props }: AppSidebarProps) {
  const collapsibleMode = (activeTab === "chat" || activeTab === "dashboard") ? "offcanvas" : "icon" as const;
  return (
    <Sidebar collapsible={collapsibleMode} className="border-0 bg-background/60 backdrop-blur-md" {...props}>
      <SidebarContent className="p-0 pt-2">
        <div className="group-data-[collapsible=icon]:hidden">
          <ContextualSidebar activeTab={activeTab} />
        </div>
      </SidebarContent>
    </Sidebar>
  )
}
