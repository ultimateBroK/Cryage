"use client";

import { useState } from 'react';
import { Button } from './button';
import { useScrollIsolation } from '@/hooks/use-scroll-isolation';

/**
 * Test component to verify scroll isolation is working correctly
 * This component should be removed in production
 */
export function ScrollIsolationTest() {
  const [chatStatus, setChatStatus] = useState('enabled');
  const [reasoningStatus, setReasoningStatus] = useState('enabled');
  
  const {
    canChatScroll,
    canReasoningScroll,
    enableChatScroll,
    disableChatScroll,
    enableReasoningScroll,
    disableReasoningScroll
  } = useScrollIsolation();

  const handleToggleChat = () => {
    if (canChatScroll()) {
      disableChatScroll();
      setChatStatus('disabled');
    } else {
      enableChatScroll();
      setChatStatus('enabled');
    }
  };

  const handleToggleReasoning = () => {
    if (canReasoningScroll()) {
      disableReasoningScroll();
      setReasoningStatus('disabled');
    } else {
      enableReasoningScroll();
      setReasoningStatus('enabled');
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-background/90 backdrop-blur-sm border rounded-lg p-4 space-y-2">
      <h3 className="text-sm font-semibold">Scroll Isolation Test</h3>
      
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-xs">Chat Scroll:</span>
          <span className={`text-xs px-2 py-1 rounded ${
            canChatScroll() ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {chatStatus}
          </span>
          <Button size="sm" variant="outline" onClick={handleToggleChat}>
            Toggle
          </Button>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-xs">Reasoning Scroll:</span>
          <span className={`text-xs px-2 py-1 rounded ${
            canReasoningScroll() ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {reasoningStatus}
          </span>
          <Button size="sm" variant="outline" onClick={handleToggleReasoning}>
            Toggle
          </Button>
        </div>
      </div>
      
      <p className="text-xs text-muted-foreground">
        Use this to test scroll isolation between chat and reasoning
      </p>
    </div>
  );
}
