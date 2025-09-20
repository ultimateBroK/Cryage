// import { openai } from "@ai-sdk/openai";
// import { createOllama } from 'ollama-ai-provider-v2';
import { createGoogleGenerativeAI } from '@ai-sdk/google';

import {
  streamText,
  UIMessage,
  convertToModelMessages,
} from "ai";

// Disable AI SDK warnings about unsupported features
if (typeof globalThis !== 'undefined') {
  (globalThis as any).AI_SDK_LOG_WARNINGS = false;
}

export async function POST(req: Request) {
  const { messages, apiKey }: { messages: UIMessage[]; apiKey?: string } = await req.json();

  if (!apiKey) {
    return new Response('API key is required', { status: 400 });
  }

  const google = createGoogleGenerativeAI({
    apiKey: apiKey,
  });
  
  // Keep the reasoning configuration - it works even with the warning
  // Warning is suppressed above, but functionality is preserved
  const result = await streamText({
    model: google("gemini-2.5-flash"),
    messages: convertToModelMessages(messages),
    providerOptions: {
      google: {
        thinkingConfig: {
          thinkingBudget: 8192,
          includeThoughts: true,
        },
      },
    },
  });

  return result.toUIMessageStreamResponse({
    sendReasoning: true,
  });  
}
