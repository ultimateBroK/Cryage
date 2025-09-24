import type { FC } from "react";
import { useEffect, useState } from "react";
import {
  ThreadListItemPrimitive,
  ThreadListPrimitive,
  useThreadListItem,
} from "@assistant-ui/react";
import { useThreadTitle } from "@/stores/thread-title-context";
import { Trash2Icon, PlusIcon } from "lucide-react";

import { Button, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui";
import { TooltipIconButton } from "./tooltip-icon-button";
import { MotionDiv, Presence } from "@/components/common/motion";

export const ThreadList: FC = () => {
  return (
    <TooltipProvider delayDuration={300}>
      <ThreadListPrimitive.Root className="flex flex-col items-stretch gap-2">
        <div className="mb-2">
          <ThreadListNew />
        </div>
        <ThreadListItems />
      </ThreadListPrimitive.Root>
    </TooltipProvider>
  );
};

const ThreadListNew: FC = () => {
  return (
    <ThreadListPrimitive.New asChild>
      <Button className="flex items-center justify-start gap-2 rounded-lg px-3 py-2 text-start text-muted-foreground hover:text-foreground border-dashed w-full h-auto" variant="outline">
        <PlusIcon className="size-4" />
        New Chat
      </Button>
    </ThreadListPrimitive.New>
  );
};

const ThreadListItems: FC = () => {
  return <ThreadListPrimitive.Items components={{ ThreadListItem }} />;
};

const ThreadListItem: FC = () => {
  return (
    <Presence>
      <MotionDiv
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15 }}
        layout
      >
        <ThreadListItemPrimitive.Root className="group data-active:bg-muted hover:bg-muted/50 focus-visible:bg-muted focus-visible:ring-ring flex items-center rounded-lg transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 mb-1">
          <ThreadListItemPrimitive.Trigger className="flex-grow px-3 py-2.5 text-start min-w-0">
            <ThreadListItemTitle />
          </ThreadListItemPrimitive.Trigger>
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <ThreadListItemArchive />
          </div>
        </ThreadListItemPrimitive.Root>
      </MotionDiv>
    </Presence>
  );
};

const ThreadListItemTitle: FC = () => {
  const { getTitle } = useThreadTitle();
  const item = useThreadListItem();
  const [currentTitle, setCurrentTitle] = useState<string | null>(null);

  useEffect(() => {
    const id = item?.id;
    if (!id) return;
    setCurrentTitle(getTitle(id));
  }, [item?.id, getTitle]);

  const displayTitle = currentTitle || "New Chat";
  const fallbackTitle = <ThreadListItemPrimitive.Title fallback="New Chat" />;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <p className="text-sm font-medium text-foreground truncate cursor-pointer">
          {currentTitle ? displayTitle : fallbackTitle}
        </p>
      </TooltipTrigger>
      <TooltipContent side="right" className="max-w-xs break-words">
        <p className="text-xs">{currentTitle ? displayTitle : "New Chat"}</p>
      </TooltipContent>
    </Tooltip>
  );
};

const ThreadListItemArchive: FC = () => {
  return (
    <ThreadListItemPrimitive.Archive asChild>
      <TooltipIconButton
        className="hover:text-red-500 hover:bg-red-500/10 p-2 text-muted-foreground flex-shrink-0 size-8 transition-colors duration-200 hover:scale-105"
        variant="ghost"
        tooltip="Delete thread"
      >
        <Trash2Icon className="size-4" />
      </TooltipIconButton>
    </ThreadListItemPrimitive.Archive>
  );
};
