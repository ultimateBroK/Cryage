"use client"

import * as React from "react"
import { SettingsIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { useIsMobile } from "@/hooks/use-mobile"
import { Button } from "@/components/ui/button"
import { TooltipProvider } from "@/components/ui/tooltip"

const SETTINGS_SIDEBAR_COOKIE_NAME = "settings_sidebar_state"
const SETTINGS_SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7
const SETTINGS_SIDEBAR_WIDTH = "25rem"

type SettingsSidebarContextProps = {
  open: boolean
  setOpen: (open: boolean) => void
  openMobile: boolean
  setOpenMobile: (open: boolean) => void
  isMobile: boolean
  toggleSidebar: () => void
}

const SettingsSidebarContext = React.createContext<SettingsSidebarContextProps | null>(null)

function useSettingsSidebar() {
  const context = React.useContext(SettingsSidebarContext)
  if (!context) {
    throw new Error("useSettingsSidebar must be used within a SettingsSidebarProvider.")
  }

  return context
}

function SettingsSidebarProvider({
  defaultOpen = false,
  open: openProp,
  onOpenChange: setOpenProp,
  className,
  style,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  defaultOpen?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
}) {
  const isMobile = useIsMobile()
  const [openMobile, setOpenMobile] = React.useState(false)

  // This is the internal state of the settings sidebar.
  const [_open, _setOpen] = React.useState(defaultOpen)
  const open = openProp ?? _open
  const setOpen = React.useCallback(
    (value: boolean | ((value: boolean) => boolean)) => {
      const openState = typeof value === "function" ? value(open) : value
      if (setOpenProp) {
        setOpenProp(openState)
      } else {
        _setOpen(openState)
      }

      // This sets the cookie to keep the sidebar state.
      document.cookie = `${SETTINGS_SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SETTINGS_SIDEBAR_COOKIE_MAX_AGE}`
    },
    [setOpenProp, open]
  )

  // Helper to toggle the sidebar.
  const toggleSidebar = React.useCallback(() => {
    return isMobile ? setOpenMobile((open) => !open) : setOpen((open) => !open)
  }, [isMobile, setOpen, setOpenMobile])

  const contextValue = React.useMemo<SettingsSidebarContextProps>(
    () => ({
      open,
      setOpen,
      isMobile,
      openMobile,
      setOpenMobile,
      toggleSidebar,
    }),
    [open, setOpen, isMobile, openMobile, setOpenMobile, toggleSidebar]
  )

  return (
    <SettingsSidebarContext.Provider value={contextValue}>
      <TooltipProvider delayDuration={0}>
        <div
          data-slot="settings-sidebar-wrapper"
          style={
            {
              "--settings-sidebar-width": SETTINGS_SIDEBAR_WIDTH,
              ...style,
            } as React.CSSProperties
          }
          className={cn(
            "group/settings-sidebar-wrapper flex min-h-svh w-full",
            className
          )}
          {...props}
        >
          {children}
        </div>
      </TooltipProvider>
    </SettingsSidebarContext.Provider>
  )
}

function SettingsSidebar({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  const { isMobile, openMobile, setOpenMobile, open, setOpen } = useSettingsSidebar()

  if (isMobile) {
    return (
      <React.Fragment>
        {/* Overlay */}
        <div
          data-slot="settings-sidebar-overlay"
          className={cn(
            "fixed inset-0 z-40 bg-black/50 transition-opacity duration-200 ease-linear",
            openMobile ? "opacity-100" : "opacity-0 pointer-events-none"
          )}
          onClick={() => setOpenMobile(false)}
        />

        {/* Sidebar */}
        <div
          data-slot="settings-sidebar"
          data-mobile="true"
          className={cn(
            "fixed inset-y-0 right-0 z-50 bg-background text-foreground flex flex-col border-l shadow-lg transition-transform duration-200 ease-linear",
            openMobile ? "translate-x-0" : "translate-x-full",
            "w-(--settings-sidebar-width)",
            className
          )}
          onClick={(e) => e.stopPropagation()}
          {...props}
        >
          {children}
        </div>
      </React.Fragment>
    )
  }

  return (
    <React.Fragment>
      {/* Overlay for desktop */}
      <div
        data-slot="settings-sidebar-overlay"
        className={cn(
          "fixed inset-0 z-40 bg-black/50 transition-opacity duration-200 ease-linear hidden md:block",
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setOpen(false)}
      />

      {/* Sidebar overlay */}
      <div
        data-slot="settings-sidebar-container"
        className={cn(
          "fixed inset-y-0 z-50 h-svh w-(--settings-sidebar-width) transition-transform duration-200 ease-linear",
          "right-0",
          open ? "translate-x-0" : "translate-x-full",
          "border-l shadow-lg",
          className
        )}
        onClick={(e) => e.stopPropagation()}
        {...props}
      >
        <div
          data-sidebar="settings-sidebar"
          data-slot="settings-sidebar-inner"
          className="bg-background flex h-full w-full flex-col border-l"
        >
          {children}
        </div>
      </div>
    </React.Fragment>
  )
}

function SettingsSidebarTrigger({
  className,
  onClick,
  ...props
}: React.ComponentProps<typeof Button>) {
  const { toggleSidebar } = useSettingsSidebar()

  return (
    <Button
      data-sidebar="settings-trigger"
      data-slot="settings-sidebar-trigger"
      variant="ghost"
      size="icon"
      className={cn("size-7", className)}
      onClick={(event) => {
        onClick?.(event)
        toggleSidebar()
      }}
      {...props}
    >
      <SettingsIcon />
      <span className="sr-only">Toggle Settings</span>
    </Button>
  )
}

function SettingsSidebarContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="settings-sidebar-content"
      className={cn(
        "flex min-h-0 flex-1 flex-col gap-2 overflow-auto p-4",
        className
      )}
      {...props}
    />
  )
}

function SettingsSidebarHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="settings-sidebar-header"
      className={cn("flex flex-col gap-2 p-4 pb-2", className)}
      {...props}
    />
  )
}

function SettingsSidebarInset({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="settings-sidebar-inset"
      className={cn(
        "relative flex w-full flex-1 flex-col min-h-0",
        className
      )}
      {...props}
    />
  )
}

export {
  SettingsSidebar,
  SettingsSidebarContent,
  SettingsSidebarHeader,
  SettingsSidebarInset,
  SettingsSidebarProvider,
  SettingsSidebarTrigger,
  useSettingsSidebar,
}
