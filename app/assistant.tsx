"use client";

import React from "react";
import { AssistantRuntimeProvider } from "@assistant-ui/react";
import { useChatRuntime } from "@assistant-ui/react-ai-sdk";
import { Thread } from "@/components/assistant-ui/thread";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import ThemeToggle from "@/components/ui/theme-toggle";
import Settings from "@/components/ui/settings";
import Aurora from "@/blocks/Backgrounds/Aurora/Aurora";

const API_KEY_STORAGE_KEY = "gemini-api-key";


export const Assistant = () => {
  const runtime = useChatRuntime();

  // Override fetch to add API key to chat requests
  React.useEffect(() => {
    const originalFetch = window.fetch;

    window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url;

      if (url.includes('/api/chat')) {
        const apiKey = localStorage.getItem(API_KEY_STORAGE_KEY);
        if (apiKey && init?.body) {
          try {
            const body = JSON.parse(init.body as string);
            body.apiKey = apiKey;
            init.body = JSON.stringify(body);
          } catch {
            // If parsing fails, continue with original request
          }
        }
      }

      return originalFetch(input, init);
    };

    return () => {
      window.fetch = originalFetch;
    };
  }, []);

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      <SidebarProvider>
        <div className="flex h-dvh w-full pr-0.5 relative">
          <div className="pointer-events-none absolute inset-0 z-10 blur-3xl opacity-45 dark:opacity-40 mix-blend-multiply dark:mix-blend-screen brightness-[1.15] dark:brightness-[1.2] saturate-125 contrast-[1.1]">
            <Aurora colorStops={["#00ffbb", "#10b981", "#00ffbb"]} amplitude={1.0} blend={0.42} speed={1.15} />
          </div>
          <AppSidebar />
          <SidebarInset>
            <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
              <SidebarTrigger />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink href="https://www.assistant-ui.com/docs/getting-started" target="_blank" rel="noopener noreferrer">
                      Crypto Agent
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden md:block" />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Starter Template</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
              <div className="ml-auto flex items-center gap-2">
                <Settings />
                <ThemeToggle />
              </div>
            </header>
            <div className="flex-1 overflow-hidden">
              <Thread />
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </AssistantRuntimeProvider>
  );
};
