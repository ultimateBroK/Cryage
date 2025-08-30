// import { openai } from "@ai-sdk/openai";
// import { createOllama } from 'ollama-ai-provider-v2';
import { createGoogleGenerativeAI } from '@ai-sdk/google';

import {
  streamText,
  UIMessage,
  convertToModelMessages,
} from "ai";

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();
  const google = createGoogleGenerativeAI({
    apiKey: process.env.GOOGLE_API_KEY,
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