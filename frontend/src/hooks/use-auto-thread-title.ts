"use client";

import { useEffect, useRef } from "react";
import { useThreadRuntime } from "@assistant-ui/react";
import { useThreadTitle } from "@/stores/thread-title-context";

interface MessageContentPart {
  type: string;
  text?: string;
}

export function useAutoThreadTitle() {
  const threadRuntime = useThreadRuntime();
  const { setTitle, getTitle } = useThreadTitle();
  const hasGeneratedInitialTitle = useRef(false);
  const lastMessageCount = useRef(0);
  const lastThreadId = useRef<string | null>(null);

  useEffect(() => {
    if (!threadRuntime) return;

    const generateOrUpdateTitle = async () => {
      try {
        // Get thread messages
        const messages = threadRuntime.getState().messages;

        // Need at least one user message to generate a title
        const userMessages = messages.filter(msg => msg.role === "user");
        if (userMessages.length === 0) {
          return;
        }

        // Prepare all messages for better context - extract text content only
        const conversationMessages = messages
          .map(msg => {
            // Convert message content to string regardless of type
            let contentText: string = "";
            
            try {
              if (typeof msg.content === "string") {
                contentText = msg.content;
              } else if (Array.isArray(msg.content)) {
                // For array content, extract text parts
                contentText = msg.content
                  .filter((part: MessageContentPart) => part?.type === "text" && part?.text)
                  .map((part: MessageContentPart) => part.text || "")
                  .join(" ");
              } else if (msg.content && typeof msg.content === "object") {
                // Handle single content object
                const contentObj = msg.content as unknown as MessageContentPart;
                contentText = contentObj?.text || "[non-text content]";
              } else {
                contentText = String(msg.content || "");
              }
            } catch {
              contentText = "[content parsing error]";
            }
            
            return {
              role: msg.role,
              content: contentText.trim()
            };
          })
          .filter(msg => msg.content.length > 0);

        // Get API key and model from localStorage (same as AI Settings)
        const apiKey = typeof window !== "undefined" 
          ? localStorage.getItem("gemini-api-key") 
          : null;
        
        const selectedModel = typeof window !== "undefined" 
          ? localStorage.getItem("gemini-model") || "gemini-2.5-flash"
          : "gemini-2.5-flash";

        const response = await fetch("/api/generate-title", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            messages: conversationMessages,
            apiKey: apiKey,
            model: selectedModel,
          }),
        });

        if (!response.ok) {
          console.error("Failed to generate title");
          return;
        }

        const data = await response.json();

        // Set generated title using context, keyed by real thread id
        if (data.title && data.title !== "New Chat") {
          const threadId = threadRuntime.getState().threadId;
          if (threadId) {
            const currentTitle = getTitle(threadId);
            
            // Set title if it's new or if we have significantly more context now
            if (!currentTitle || (!hasGeneratedInitialTitle.current && userMessages.length >= 1)) {
              setTitle(threadId, data.title);
              hasGeneratedInitialTitle.current = true;
            }
            // Update title if conversation has evolved significantly (more than 4 exchanges)
            else if (userMessages.length > 2 && messages.length > lastMessageCount.current + 4) {
              setTitle(threadId, data.title);
            }
          }
        }
      } catch (error) {
        console.error("Error generating thread title:", error);
      }
    };

    // Subscribe to thread runtime changes
    const unsubscribe = threadRuntime.subscribe(() => {
      const state = threadRuntime.getState();
      const currentMessageCount = state.messages.length;
      const currentThreadId = state.threadId;

      // Check if thread ID has changed (new chat)
      if (currentThreadId !== lastThreadId.current) {
        // Reset flags for new thread
        hasGeneratedInitialTitle.current = false;
        lastMessageCount.current = 0;
        lastThreadId.current = currentThreadId;
      }

      // Generate title when AI finishes responding and we have messages
      if (!state.isRunning && currentMessageCount > 0) {
        const userMessages = state.messages.filter(msg => msg.role === "user");
        const assistantMessages = state.messages.filter(msg => msg.role === "assistant");
        
        // Initial title generation: after first assistant response
        if (!hasGeneratedInitialTitle.current && userMessages.length >= 1 && assistantMessages.length >= 1) {
          setTimeout(generateOrUpdateTitle, 1000);
        }
        // Title updates: after significant conversation growth
        else if (hasGeneratedInitialTitle.current && currentMessageCount > lastMessageCount.current + 4) {
          setTimeout(generateOrUpdateTitle, 1500);
        }
        
        lastMessageCount.current = currentMessageCount;
      }
    });

    return () => {
      unsubscribe?.();
    };
  }, [threadRuntime, setTitle, getTitle]);

  // Reset flags when thread runtime changes (fallback)
  useEffect(() => {
    hasGeneratedInitialTitle.current = false;
    lastMessageCount.current = 0;
    lastThreadId.current = null;
  }, [threadRuntime]);
}
