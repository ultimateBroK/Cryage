"use client";
import {
  ThreadPrimitive,
  ComposerPrimitive,
  MessagePrimitive,
  ActionBarPrimitive,
  BranchPickerPrimitive,
  ErrorPrimitive,
  useMessagePartReasoning,
  useMessageRuntime,
  useComposerRuntime,
} from "@assistant-ui/react";
import { useAutoThreadTitle } from "@/hooks/use-auto-thread-title";
import { useThreadAutoScroll } from "@/hooks/use-thread-auto-scroll";
import { useIsMobile, useDeviceType } from "@/hooks/use-mobile";
import type { FC } from "react";
import { useState, useEffect, useCallback } from "react";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  PlusIcon,
  CopyIcon,
  CheckIcon,
  PencilIcon,
  RefreshCwIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  Square,
  SettingsIcon,
} from "lucide-react";

import { TooltipIconButton } from "./tooltip-icon-button";
import { Reasoning, ReasoningTrigger, ReasoningContent } from "@/components/ui/reasoning";
import { MotionDiv } from "@/components/common/motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MarkdownText } from "./markdown-text";
import { ToolFallback } from "./tool-fallback";
import { CryageLogo } from "@/components/ui/cryage-logo";

// Add notification system
interface NotificationState {
  show: boolean;
  message: string;
  type: 'info' | 'warning' | 'error';
}

const API_KEY_STORAGE_KEY = "gemini-api-key";

export const Thread: FC = () => {
  // Auto-generate thread titles when AI finishes responding
  useAutoThreadTitle();
  
  // Auto-scroll thread viewport as content updates
  useThreadAutoScroll();
  
  const isMobile = useIsMobile();
  const deviceType = useDeviceType();

  // Prevent unwanted scroll behavior
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      // Allow normal scrolling within the viewport
      const viewport = document.querySelector('[data-viewport="true"]');
      if (viewport && viewport.contains(e.target as Node)) {
        return;
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent page-level scrolling with arrow keys, page up/down
      if (['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End'].includes(e.key)) {
        const activeElement = document.activeElement;
        const isInChat = activeElement && (
          activeElement.getAttribute('aria-label') === 'Message input' ||
          activeElement.closest('[data-viewport="true"]')
        );
        
        if (!isInChat) {
          e.preventDefault();
        }
      }
    };

    document.addEventListener('wheel', handleWheel, { passive: true });
    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('wheel', handleWheel);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <ThreadPrimitive.Root
      // aui-thread-root
      className="bg-background flex h-full flex-col"
      style={{
        ["--thread-max-width" as string]: isMobile ? "100%" : deviceType === 'tablet' ? "48rem" : "52rem",
        ["--thread-padding-x" as string]: isMobile ? "1rem" : deviceType === 'tablet' ? "1.5rem" : "2rem",
      }}
    >
      {/* aui-thread-viewport */}
      <ThreadPrimitive.Viewport 
        className={`relative flex min-w-0 flex-1 flex-col gap-4 sm:gap-6 overflow-y-auto min-h-0 pb-2 md:pb-4 ${isMobile ? 'gap-3' : ''}`}
        data-viewport="true"
        style={{
          // Ensure viewport stays stable and scrollable
          scrollBehavior: 'smooth',
          overscrollBehavior: 'contain',
          maxHeight: '100%',
        }}
      >
        <ThreadWelcome />

        <ThreadPrimitive.Messages
          components={{
            UserMessage,
            EditComposer,
            AssistantMessage,
          }}
        />

        <ThreadPrimitive.If empty={false}>
          {/* aui-thread-viewport-spacer */}
          <MotionDiv 
            className="min-h-6 min-w-6 shrink-0"
            initial={false}
            animate={{ height: 'auto' }}
            transition={{ duration: 0.2 }}
          />
        </ThreadPrimitive.If>
      </ThreadPrimitive.Viewport>

      <Composer />
    </ThreadPrimitive.Root>
  );
};

const ThreadScrollToBottom: FC = () => {
  const [show, setShow] = useState<boolean>(false);

  useEffect(() => {
    const viewport = document.querySelector('[data-viewport="true"]') as HTMLElement | null;
    if (!viewport) return;

    const threshold = 8; // px
    const compute = () => {
      const atBottom = viewport.scrollHeight - (viewport.scrollTop + viewport.clientHeight) <= threshold;
      setShow(!atBottom);
    };

    compute();
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(compute);
    };
    viewport.addEventListener('scroll', onScroll, { passive: true });
    const resizeObserver = new ResizeObserver(() => compute());
    resizeObserver.observe(viewport);
    return () => {
      viewport.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <ThreadPrimitive.ScrollToBottom asChild>
      <TooltipIconButton
        tooltip="Scroll to bottom"
        variant="outline"
        // aui-thread-scroll-to-bottom
        className={cn(
          "dark:bg-background dark:hover:bg-accent absolute -top-12 z-10 self-center rounded-full p-4 transition-opacity disabled:invisible",
          show ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={(e) => {
          // Prevent any unwanted side effects
          e.stopPropagation();
        }}
      >
        <ArrowDownIcon />
      </TooltipIconButton>
    </ThreadPrimitive.ScrollToBottom>
  );
};

const ThreadWelcome: FC = () => {
  const isMobile = useIsMobile();
  const deviceType = useDeviceType();
  
  return (
    <ThreadPrimitive.Empty>
      {/* aui-thread-welcome-root */}
      <div className="mx-auto flex w-full max-w-[var(--thread-max-width)] flex-grow flex-col px-[var(--thread-padding-x)]">
        {/* aui-thread-welcome-center */}
        <div className="flex w-full flex-grow flex-col items-center justify-center">
          {/* aui-thread-welcome-message */}
          <div className={`flex size-full flex-col justify-center px-4 sm:px-6 md:px-8 ${isMobile ? 'mt-8' : 'md:mt-20'}`}>
            <MotionDiv
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ delay: 0.5 }}
              // aui-thread-welcome-message-motion-1
              className={`font-semibold ${isMobile ? 'text-lg' : deviceType === 'tablet' ? 'text-xl' : 'text-xl sm:text-2xl'}`}
            >
              Hello there!
            </MotionDiv>
            <MotionDiv
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ delay: 0.6 }}
              // aui-thread-welcome-message-motion-2
              className={`text-muted-foreground/65 ${isMobile ? 'text-base' : deviceType === 'tablet' ? 'text-lg' : 'text-lg sm:text-xl md:text-2xl'}`}
            >
              How can I help you today?
            </MotionDiv>
          </div>
        </div>
      </div>
    </ThreadPrimitive.Empty>
  );
};

const ThreadWelcomeSuggestions: FC = () => {
  const isMobile = useIsMobile();
  const deviceType = useDeviceType();
  
  return (
    // aui-thread-welcome-suggestions
    <div className={`grid w-full gap-2 ${isMobile ? 'grid-cols-1' : 'sm:grid-cols-2'}`}>
      {[
        {
          title: "What are the advantages",
          label: "of using Cryage?",
          action: "What are the advantages of using Cryage?",
        },
        {
          title: "Write code to",
          label: `demonstrate crypto trading`,
          action: `Write code to demonstrate crypto trading`,
        },
        {
          title: "Help me write an essay",
          label: `about crypto trading`,
          action: `Help me write an essay about crypto trading`,
        },
        {
          title: "What is the weather",
          label: "in San Francisco?",
          action: "What is the weather in crypto trading?",
        },
      ].map((suggestedAction, index) => (
        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ delay: 0.05 * index }}
          key={`suggested-action-${suggestedAction.title}-${index}`}
          // aui-thread-welcome-suggestion-display
          className={`${isMobile ? 'block' : '[&:nth-child(n+3)]:hidden sm:[&:nth-child(n+3)]:block'}`}
        >
          <ThreadPrimitive.Suggestion
            prompt={suggestedAction.action}
            method="replace"
            autoSend
            asChild
          >
            <Button
              variant="ghost"
              // aui-thread-welcome-suggestion
              className={`dark:hover:bg-accent/60 h-auto w-full flex-1 items-start justify-start gap-1 rounded-xl border px-4 py-3.5 text-left touch-target ${
                isMobile ? 'flex-col text-sm' : 'flex-wrap sm:flex-col text-sm'
              }`}
              aria-label={suggestedAction.action}
            >
              {/* aui-thread-welcome-suggestion-text-1 */}
              <span className="font-medium">{suggestedAction.title}</span>
              {/* aui-thread-welcome-suggestion-text-2 */}
              <p className="text-muted-foreground">{suggestedAction.label}</p>
            </Button>
          </ThreadPrimitive.Suggestion>
        </MotionDiv>
      ))}
    </div>
  );
};

const Composer: FC = () => {
  const [hasApiKey, setHasApiKey] = useState(false);
  const [notification, setNotification] = useState<NotificationState>({
    show: false,
    message: '',
    type: 'info'
  });
  const isMobile = useIsMobile();
  const deviceType = useDeviceType();

  // Check API key on mount and when storage changes
  useEffect(() => {
    const checkApiKey = () => {
      const apiKey = localStorage.getItem(API_KEY_STORAGE_KEY);
      setHasApiKey(!!apiKey?.trim());
    };

    checkApiKey();

    // Listen for storage changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === API_KEY_STORAGE_KEY) {
        checkApiKey();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Custom event for same-tab updates
    const handleApiKeyUpdate = () => checkApiKey();
    window.addEventListener('apiKeyUpdated', handleApiKeyUpdate);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('apiKeyUpdated', handleApiKeyUpdate);
    };
  }, []);

  // Show notification
  const showNotification = useCallback((message: string, type: NotificationState['type'] = 'warning') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification(prev => ({ ...prev, show: false }));
    }, 4000);
  }, []);

  // Handle form submission prevention
  const handleSubmit = useCallback((e: React.FormEvent) => {
    if (!hasApiKey) {
      e.preventDefault();
      e.stopPropagation();
      showNotification('Please enter your Gemini API key in Settings before sending a message.');
      
      // Focus on settings
      const settingsButton = document.querySelector('[aria-label="Open settings"]') as HTMLButtonElement;
      if (settingsButton) {
        settingsButton.click();
      }
      return false;
    }
    return true;
  }, [hasApiKey, showNotification]);

  // Handle keyboard shortcut (Enter) - global prevention
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey && !hasApiKey) {
        const composerInput = document.querySelector('[aria-label="Message input"]') as HTMLTextAreaElement;
        if (composerInput && document.activeElement === composerInput && composerInput.value.trim()) {
          e.preventDefault();
          e.stopPropagation();
          showNotification('Please enter your Gemini API key in Settings before sending a message.');
          
          // Focus on settings
          const settingsButton = document.querySelector('[aria-label="Open settings"]') as HTMLButtonElement;
          if (settingsButton) {
            settingsButton.click();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown, true); // Use capture phase
    return () => document.removeEventListener('keydown', handleKeyDown, true);
  }, [hasApiKey, showNotification]);

  return (
    <>
      {/* Notification Toast */}
      {notification.show && (
        <div className="fixed top-4 right-2 sm:right-4 left-2 sm:left-auto z-50 animate-in slide-in-from-top duration-300">
          <div className={cn(
            "rounded-lg border p-3 sm:p-4 shadow-lg backdrop-blur-sm max-w-sm mx-auto sm:mx-0",
            notification.type === 'warning' && "border-yellow-200 bg-yellow-50/90 text-yellow-800 dark:border-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200",
            notification.type === 'error' && "border-red-200 bg-red-50/90 text-red-800 dark:border-red-800 dark:bg-red-900/20 dark:text-red-200",
            notification.type === 'info' && "border-blue-200 bg-blue-50/90 text-blue-800 dark:border-blue-800 dark:bg-blue-900/20 dark:text-blue-200"
          )}>
            <div className="flex items-start gap-2">
              <SettingsIcon className="size-4 mt-0.5 flex-shrink-0" />
              <p className="text-xs sm:text-sm font-medium">{notification.message}</p>
            </div>
          </div>
        </div>
      )}

      {/* aui-composer-wrapper */}
      <div className={`bg-background relative mx-auto flex w-full max-w-[var(--thread-max-width)] flex-col gap-4 px-[var(--thread-padding-x)] pb-4 md:pb-6 mb-4 sm:mb-6 safe-area-inset-bottom ${isMobile ? 'gap-3' : ''}`}>
        <ThreadScrollToBottom />
        <ThreadPrimitive.Empty>
          <ThreadWelcomeSuggestions />
        </ThreadPrimitive.Empty>
        {/* aui-composer-root */}
        <ComposerPrimitive.Root 
          className={`focus-within:ring-offset-2 relative flex w-full flex-col rounded-2xl bg-background/40 backdrop-blur-md border border-black/10 dark:border-white/15 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.25)] focus-within:ring-2 focus-within:ring-black dark:focus-within:ring-white ${isMobile ? 'rounded-xl' : ''}`}
          onSubmit={handleSubmit}
        >
          {/* aui-composer-input */}
          <ComposerPrimitive.Input
            placeholder={hasApiKey ? "Send a message..." : "Please add API key in Settings to start chatting..."}
            className={cn(
              `bg-transparent focus:outline-primary placeholder:text-muted-foreground max-h-[40vh] w-full resize-none outline-none ${
                isMobile ? 'min-h-12 px-3 pt-2 pb-2 text-sm rounded-t-xl' : 'min-h-16 px-4 pt-2 pb-3 text-base rounded-t-2xl'
              }`,
              !hasApiKey && "cursor-not-allowed opacity-60"
            )}
            rows={1}
            autoFocus={false} // Disable autoFocus to prevent scroll issues
            aria-label="Message input"
            disabled={!hasApiKey}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey && !hasApiKey) {
                e.preventDefault();
                e.stopPropagation();
                showNotification('Please enter your Gemini API key in Settings before sending a message.');
                
                const settingsButton = document.querySelector('[aria-label="Open settings"]') as HTMLButtonElement;
                if (settingsButton) {
                  settingsButton.click();
                }
              }
            }}
          />
          <ComposerAction hasApiKey={hasApiKey} />
        </ComposerPrimitive.Root>
      </div>
    </>
  );
};

const ComposerAction: FC<{ hasApiKey: boolean }> = ({ hasApiKey }) => {
  const isMobile = useIsMobile();
  
  // Handle send attempt without API key
  const handleSendAttempt = useCallback((e: React.MouseEvent) => {
    if (!hasApiKey) {
      e.preventDefault();
      e.stopPropagation();
      
      // Focus on settings
      const settingsButton = document.querySelector('[aria-label="Open settings"]') as HTMLButtonElement;
      if (settingsButton) {
        settingsButton.click();
      }
      return false;
    }
  }, [hasApiKey]);

  return (
    <div className={`relative flex items-center justify-between border-t border-black/10 dark:border-white/10 bg-background/30 backdrop-blur-md p-2 ${isMobile ? 'rounded-b-xl' : 'rounded-b-2xl'}`}>
        <TooltipIconButton
        tooltip="Attach file"
        variant="ghost"
        // aui-composer-attachment-button
        className={`hover:bg-foreground/15 dark:hover:bg-background/50 scale-115 touch-target ${isMobile ? 'p-2.5' : 'p-3.5'}`}
        onClick={() => {}}
        disabled={!hasApiKey}
      >
        <PlusIcon className={isMobile ? 'w-4 h-4' : 'w-5 h-5'} />
      </TooltipIconButton>

      <ThreadPrimitive.If running={false}>
        <ComposerPrimitive.Send asChild>
          <Button
            type="submit"
            variant="default"
            // aui-composer-send
            className={cn(
              `rounded-full border touch-target ${isMobile ? 'size-8' : 'size-8 sm:size-9'}`,
              hasApiKey 
                ? "dark:border-muted-foreground/90 border-muted-foreground/60 hover:bg-primary/75" 
                : "border-muted-foreground/30 bg-muted-foreground/20 text-muted-foreground/60 cursor-not-allowed hover:bg-muted-foreground/20"
            )}
            aria-label={hasApiKey ? "Send message" : "API key required"}
            disabled={!hasApiKey}
            onClick={handleSendAttempt}
          >
            {/* aui-composer-send-icon */}
            <ArrowUpIcon className={isMobile ? 'size-4' : 'size-5'} />
          </Button>
        </ComposerPrimitive.Send>
      </ThreadPrimitive.If>

      <ThreadPrimitive.If running>
        <ComposerPrimitive.Cancel asChild>
          <Button
            type="button"
            variant="default"
            // aui-composer-cancel
            className={`dark:border-muted-foreground/90 border-muted-foreground/60 hover:bg-primary/75 rounded-full border ${isMobile ? 'size-8' : 'size-8'}`}
            aria-label="Stop generating"
          >
            {/* aui-composer-cancel-icon */}
            <Square className={`fill-white dark:fill-black ${isMobile ? 'size-3' : 'size-3.5 dark:size-4'}`} />
          </Button>
        </ComposerPrimitive.Cancel>
      </ThreadPrimitive.If>
    </div>
  );
};

const MessageError: FC = () => {
  return (
    <MessagePrimitive.Error>
      {/* aui-message-error-root */}
      <ErrorPrimitive.Root className="border-destructive bg-destructive/10 dark:bg-destructive/5 text-destructive mt-2 rounded-md border p-3 text-sm dark:text-red-200">
        {/* aui-message-error-message */}
        <ErrorPrimitive.Message className="line-clamp-2" />
      </ErrorPrimitive.Root>
    </MessagePrimitive.Error>
  );
};

const AssistantMessage: FC = () => {
  const isMobile = useIsMobile();
  const deviceType = useDeviceType();
  
  return (
    <MessagePrimitive.Root asChild>
      <MotionDiv
        // aui-assistant-message-root
        className={`relative mx-auto flex w-full max-w-[var(--thread-max-width)] flex-col gap-2 px-[var(--thread-padding-x)] py-4 ${isMobile ? 'py-3' : ''}`}
        initial={{ y: 5, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        data-role="assistant"
      >
        {/* Main message container */}
        <div className={`flex ${isMobile ? 'gap-3' : 'gap-4 sm:gap-6'}`}>
          {/* aui-assistant-message-avatar */}
          <div className={`ring-border bg-background flex shrink-0 items-center justify-center rounded-full ring-1 shadow-sm ${isMobile ? 'size-7' : 'size-8'}`}>
            <CryageLogo size={isMobile ? 14 : 16} />
          </div>

          {/* aui-assistant-message-content */}
          <div className={`text-foreground flex-1 leading-7 break-words overflow-hidden min-w-0 ${isMobile ? 'pr-1' : 'pr-2 sm:pr-4'}`}>
            <MessagePrimitive.Content
              components={{
                Text: MarkdownText,
                Reasoning: ReasoningMessagePart,
                tools: { Fallback: ToolFallback },
              }}
            />
            <MessageError />
          </div>
        </div>

        {/* Actions and branch picker below content */}
        <div className={`flex flex-col gap-2 ${isMobile ? 'ml-10' : 'ml-12 sm:ml-14'}`}>
          <AssistantActionBar />
          <BranchPicker className="" />
        </div>
      </MotionDiv>
    </MessagePrimitive.Root>
  );
};

const ReasoningMessagePart: FC = () => {
  const { text } = useMessagePartReasoning();
  return (
    <div className="text-muted-foreground" data-role="reasoning">
      <Reasoning>
        <ReasoningTrigger>Reasoning</ReasoningTrigger>
        <ReasoningContent markdown>
          {text}
        </ReasoningContent>
      </Reasoning>
    </div>
  );
};

const AssistantActionBar: FC = () => {
  const [copied, setCopied] = useState<boolean>(false);
  const messageRuntime = useMessageRuntime();
  const composerRuntime = useComposerRuntime();

  const fallbackCopy = (text: string) => {
    try {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      textArea.style.top = "-999999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      return true;
    } catch {
      return false;
    }
  };

  const onCopy = async () => {
    const { isEditing, text: composerValue } = composerRuntime.getState();
    const valueToCopy = isEditing ? composerValue : messageRuntime.unstable_getCopyText();
    const ok = fallbackCopy(valueToCopy);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <ActionBarPrimitive.Root
      hideWhenRunning
      // aui-assistant-action-bar-root
      className="text-muted-foreground flex gap-1 justify-start"
    >
      <TooltipIconButton tooltip="Copy" onClick={onCopy}>
        {copied ? <CheckIcon /> : <CopyIcon />}
      </TooltipIconButton>
      <ActionBarPrimitive.Reload asChild>
        <TooltipIconButton tooltip="Refresh">
          <RefreshCwIcon />
        </TooltipIconButton>
      </ActionBarPrimitive.Reload>
    </ActionBarPrimitive.Root>
  );
};

const UserMessage: FC = () => {
  const isMobile = useIsMobile();
  const deviceType = useDeviceType();
  
  return (
    <MessagePrimitive.Root asChild>
      <MotionDiv
        // aui-user-message-root
        className={`mx-auto flex w-full max-w-[var(--thread-max-width)] flex-col gap-2 px-[var(--thread-padding-x)] py-4 ${isMobile ? 'py-3' : ''}`}
        initial={{ y: 5, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        data-role="user"
      >
        {/* Main message container */}
        <div className="flex justify-end">
          {/* aui-user-message-content */}
          <div className={`bg-muted text-foreground rounded-3xl py-3 break-words overflow-hidden min-w-0 shadow-sm ${
            isMobile ? 'px-4 max-w-[90%]' : deviceType === 'tablet' ? 'px-5 max-w-[80%]' : 'px-4 sm:px-6 max-w-[85%] sm:max-w-[75%]'
          }`}>
            <MessagePrimitive.Content components={{ Text: MarkdownText }} />
          </div>
        </div>

        {/* Actions and branch picker below content */}
        <div className="flex flex-col gap-2 items-end">
          <UserActionBar />
          <BranchPicker className="justify-end" />
        </div>
      </MotionDiv>
    </MessagePrimitive.Root>
  );
};

const UserActionBar: FC = () => {
  const [copied, setCopied] = useState<boolean>(false);
  const messageRuntime = useMessageRuntime();
  const composerRuntime = useComposerRuntime();

  const fallbackCopy = (text: string) => {
    try {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      textArea.style.top = "-999999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      return true;
    } catch {
      return false;
    }
  };

  const onCopy = async () => {
    const { isEditing, text: composerValue } = composerRuntime.getState();
    const valueToCopy = isEditing ? composerValue : messageRuntime.unstable_getCopyText();
    const ok = fallbackCopy(valueToCopy);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <ActionBarPrimitive.Root
      hideWhenRunning
      // aui-user-action-bar-root
      className="text-muted-foreground flex gap-1 justify-end"
    >
      <TooltipIconButton tooltip="Copy" onClick={onCopy}>
        {copied ? <CheckIcon /> : <CopyIcon />}
      </TooltipIconButton>
      <ActionBarPrimitive.Edit asChild>
        <TooltipIconButton tooltip="Edit">
          <PencilIcon />
        </TooltipIconButton>
      </ActionBarPrimitive.Edit>
    </ActionBarPrimitive.Root>
  );
};

const EditComposer: FC = () => {
  return (
    // aui-edit-composer-wrapper
    <div className="mx-auto flex w-full max-w-[var(--thread-max-width)] flex-col gap-4 px-[var(--thread-padding-x)]">
      {/* aui-edit-composer-root */}
      <ComposerPrimitive.Root className="bg-muted ml-auto flex w-full max-w-7/8 flex-col rounded-xl">
        {/* aui-edit-composer-input */}
        <ComposerPrimitive.Input
          className="text-foreground flex min-h-[60px] w-full resize-none bg-transparent p-4 outline-none"
          autoFocus
        />

        {/* aui-edit-composer-footer */}
        <div className="mx-3 mb-3 flex items-center justify-center gap-2 self-end">
          <ComposerPrimitive.Cancel asChild>
            <Button variant="ghost" size="sm" aria-label="Cancel edit">
              Cancel
            </Button>
          </ComposerPrimitive.Cancel>
          <ComposerPrimitive.Send asChild>
            <Button size="sm" aria-label="Update message">
              Update
            </Button>
          </ComposerPrimitive.Send>
        </div>
      </ComposerPrimitive.Root>
    </div>
  );
};

const BranchPicker: FC<BranchPickerPrimitive.Root.Props> = ({
  className,
  ...rest
}) => {
  return (
    <BranchPickerPrimitive.Root
      hideWhenSingleBranch
      // aui-branch-picker-root
      className={cn(
        "text-muted-foreground inline-flex items-center text-xs",
        className,
      )}
      {...rest}
    >
      <BranchPickerPrimitive.Previous asChild>
        <TooltipIconButton tooltip="Previous">
          <ChevronLeftIcon />
        </TooltipIconButton>
      </BranchPickerPrimitive.Previous>
      {/* aui-branch-picker-state */}
      <span className="font-medium">
        <BranchPickerPrimitive.Number /> / <BranchPickerPrimitive.Count />
      </span>
      <BranchPickerPrimitive.Next asChild>
        <TooltipIconButton tooltip="Next">
          <ChevronRightIcon />
        </TooltipIconButton>
      </BranchPickerPrimitive.Next>
    </BranchPickerPrimitive.Root>
  );
};

//
