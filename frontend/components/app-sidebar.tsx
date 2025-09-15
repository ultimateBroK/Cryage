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
import dynamic from "next/dynamic"
const ThreadList = dynamic(() => import("./assistant-ui/thread-list").then(m => m.ThreadList), { ssr: false, loading: () => null })

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
                <Link href="#" onClick={(e) => e.preventDefault()}>
                  <div className="flex aspect-square size-8 items-center justify-center">
                    <CryageLogo size={32} />
                  </div>
                  <div className="flex flex-col gap-0.5 leading-none">
                    <span className="font-semibold text-lg">Cryage</span>
                    <span className="text-xs text-muted-foreground">Crypto AI Assistant</span>
                  </div>
                </Link>
              </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <ThreadList />
      </SidebarContent>

      <SidebarRail />
    </Sidebar>
  )
}
