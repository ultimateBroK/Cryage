import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateText } from "ai";
import { createHash } from "crypto";

interface Message {
  role: string;
  content: string;
}

interface CacheEntry {
  title: string;
  timestamp: number;
  expiresAt: number;
}

// In-memory cache with TTL (Time To Live)
const titleCache = new Map<string, CacheEntry>();
const CACHE_TTL = 1000 * 60 * 60; // 1 hour
const MAX_CACHE_SIZE = 1000;

// Cache cleanup utility
function cleanupCache() {
  const now = Date.now();
  for (const [key, entry] of titleCache.entries()) {
    if (now > entry.expiresAt) {
      titleCache.delete(key);
    }
  }
  
  // If cache is too large, remove oldest entries
  if (titleCache.size > MAX_CACHE_SIZE) {
    const entries = Array.from(titleCache.entries())
      .sort((a, b) => a[1].timestamp - b[1].timestamp);
    const toDelete = entries.slice(0, titleCache.size - MAX_CACHE_SIZE);
    toDelete.forEach(([key]) => titleCache.delete(key));
  }
}

// Optimized title sanitization with memoization
const sanitizeCache = new Map<string, string>();

function sanitizeTitle(raw: string, maxChars = 80): string {
  if (!raw) return "New Chat";
  
  // Check cache first
  const cacheKey = `${raw.slice(0, 200)}_${maxChars}`;
  const cached = sanitizeCache.get(cacheKey);
  if (cached) return cached;

  // Take first line and clean up basic formatting
  let title = raw.split(/\r?\n/)[0]
    .replace(/^\s*["'`]|["'`]\s*$/g, "") // strip surrounding quotes
    .replace(/\s+/g, " ") // normalize whitespace
    .trim();

  // Only truncate if really necessary, preserving meaning
  if (title.length > maxChars) {
    // Try to cut at a word boundary near the limit
    const cutIndex = title.lastIndexOf(" ", maxChars);
    if (cutIndex > maxChars * 0.7) {
      title = title.slice(0, cutIndex);
    } else {
      // If no good word boundary, cut at char limit
      title = title.slice(0, maxChars - 3) + "...";
    }
  }

  // Keep natural capitalization, only capitalize first word if all lowercase
  if (title === title.toLowerCase()) {
    title = title.charAt(0).toUpperCase() + title.slice(1);
  }

  const result = title || "New Chat";
  
  // Cache result (limit cache size)
  if (sanitizeCache.size > 500) {
    const firstKey = sanitizeCache.keys().next().value;
    if (firstKey) sanitizeCache.delete(firstKey);
  }
  sanitizeCache.set(cacheKey, result);
  
  return result;
}

export async function POST(request: Request) {
  const startTime = Date.now();
  
  try {
    // Early validation and parsing
    if (!request.body) {
      return Response.json({ title: "New Chat", error: "No request body" }, { status: 400 });
    }

    const { messages, apiKey, model }: { messages: Message[]; apiKey?: string; model?: string } = await request.json();

    // Input validation
    if (!apiKey?.trim()) {
      return Response.json({ title: "New Chat", error: "API key required" }, { status: 400 });
    }

    if (!Array.isArray(messages) || messages.length === 0) {
      return Response.json({ title: "New Chat", error: "Messages required" }, { status: 400 });
    }

    // Optimized message filtering - single pass
    const userMessages: Message[] = [];
    const assistantMessages: Message[] = [];
    
    for (const msg of messages) {
      if (!msg.content?.trim()) continue; // Skip empty messages
      if (msg.role === "user") userMessages.push(msg);
      else if (msg.role === "assistant") assistantMessages.push(msg);
    }

    if (userMessages.length === 0) {
      return Response.json({ title: "New Chat", error: "No user messages found" }, { status: 400 });
    }

    // Optimized context building
    const firstUserMessage = userMessages[0];
    const firstAssistantMessage = assistantMessages[0];
    const isMultiTurn = userMessages.length > 1;
    
    // Create cache key for this conversation context
    const contextHash = createHash('md5')
      .update(JSON.stringify({
        first: firstUserMessage.content.slice(0, 200),
        firstAssistant: firstAssistantMessage?.content.slice(0, 200) || '',
        latest: isMultiTurn ? userMessages[userMessages.length - 1].content.slice(0, 200) : '',
        model: model || 'gemini-2.5-flash'
      }))
      .digest('hex');

    // Check cache first
    cleanupCache();
    const cachedEntry = titleCache.get(contextHash);
    if (cachedEntry && Date.now() < cachedEntry.expiresAt) {
      return Response.json({ 
        title: cachedEntry.title, 
        cached: true,
        responseTime: Date.now() - startTime 
      });
    }

    // Build optimized context (limit content length for performance)
    const contextParts: string[] = [
      `First user: ${firstUserMessage.content.slice(0, 500)}`
    ];
    
    if (firstAssistantMessage) {
      contextParts.push(`First assistant: ${firstAssistantMessage.content.slice(0, 300)}`);
    }
    
    // Add latest context only if significantly different
    if (isMultiTurn) {
      const latestUserMessage = userMessages[userMessages.length - 1];
      const latestAssistantMessage = assistantMessages[assistantMessages.length - 1];
      
      if (latestUserMessage.content !== firstUserMessage.content) {
        contextParts.push(`Latest user: ${latestUserMessage.content.slice(0, 300)}`);
      }
      
      if (latestAssistantMessage && latestAssistantMessage !== firstAssistantMessage) {
        contextParts.push(`Latest assistant: ${latestAssistantMessage.content.slice(0, 200)}`);
      }
    }

    const conversationContext = contextParts.join('\n');

    // Optimized AI prompt
    const prompt = `Create a concise title for this conversation:

${conversationContext}

Requirements: 3-8 words, descriptive, natural capitalization. Return only the title.`;

    // Create AI instance and generate title
    const google = createGoogleGenerativeAI({ apiKey });
    
    const [result] = await Promise.all([
      generateText({
        model: google(model || "gemini-2.5-flash"),
        prompt,
        temperature: 0.3,
      })
    ]);

    const title = sanitizeTitle(result.text);

    // Cache the result
    titleCache.set(contextHash, {
      title,
      timestamp: Date.now(),
      expiresAt: Date.now() + CACHE_TTL
    });

    return Response.json({ 
      title,
      cached: false,
      responseTime: Date.now() - startTime
    });
    
  } catch (error) {
    const responseTime = Date.now() - startTime;
    console.error("Error generating title:", error, { responseTime });
    
    // Return more specific error info in development
    const isDev = process.env.NODE_ENV === 'development';
    return Response.json({ 
      title: "New Chat",
      error: isDev ? (error as Error).message : "Generation failed",
      responseTime
    }, { status: 500 });
  }
}
