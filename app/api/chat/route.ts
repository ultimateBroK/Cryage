// import { openai } from "@ai-sdk/openai";
// import { createOllama } from 'ollama-ai-provider-v2';
import { createGoogleGenerativeAI } from '@ai-sdk/google';

import {
  streamText,
  UIMessage,
  convertToModelMessages,
} from "ai";

export async function POST(req: Request) {
  const { messages, apiKey }: { messages: UIMessage[]; apiKey?: string } = await req.json();

  if (!apiKey) {
    return new Response('API key is required', { status: 400 });
  }

  const google = createGoogleGenerativeAI({
    apiKey: apiKey,
  });
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