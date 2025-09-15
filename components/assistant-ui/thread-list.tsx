import type { FC } from "react";
import { useEffect, useState } from "react";
import {
  ThreadListItemPrimitive,
  ThreadListPrimitive,
  useThreadListItem,
} from "@assistant-ui/react";
import { useThreadTitle } from "@/lib/thread-title-context";
import { ArchiveIcon, PlusIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { TooltipIconButton } from "@/components/assistant-ui/tooltip-icon-button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const ThreadList: FC = () => {
  return (
    <TooltipProvider delayDuration={300}>
      <ThreadListPrimitive.Root className="flex flex-col items-stretch gap-1.5">
        <ThreadListNew />
        <ThreadListItems />
      </ThreadListPrimitive.Root>
    </TooltipProvider>
  );
};

const ThreadListNew: FC = () => {
  return (
    <ThreadListPrimitive.New asChild>
      <Button className="data-active:bg-muted hover:bg-muted flex items-center justify-start gap-1 rounded-lg px-3 py-2 text-start" variant="ghost">
        <PlusIcon />
        New Thread
      </Button>
    </ThreadListPrimitive.New>
  );
};

const ThreadListItems: FC = () => {
  return <ThreadListPrimitive.Items components={{ ThreadListItem }} />;
};

const ThreadListItem: FC = () => {
  return (
    <ThreadListItemPrimitive.Root className="data-active:bg-muted hover:bg-muted focus-visible:bg-muted focus-visible:ring-ring flex items-center rounded-lg transition-all focus-visible:outline-none focus-visible:ring-2">
      <ThreadListItemPrimitive.Trigger className="flex-grow px-3 py-2 text-start min-w-0">
        <ThreadListItemTitle />
      </ThreadListItemPrimitive.Trigger>
      <ThreadListItemArchive />
    </ThreadListItemPrimitive.Root>
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
        className="hover:text-foreground/60 p-2 text-foreground flex-shrink-0 size-8"
        variant="ghost"
        tooltip="Archive thread"
      >
        <ArchiveIcon className="size-4" />
      </TooltipIconButton>
    </ThreadListItemPrimitive.Archive>
  );
};
