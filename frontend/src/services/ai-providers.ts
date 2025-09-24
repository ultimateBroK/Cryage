import { createGoogleGenerativeAI } from '@ai-sdk/google';
// import { createVertexAI } from '@ai-sdk/google-vertex'; // Uncomment if using Vertex AI

export const AI_PROVIDERS = {
  GOOGLE_GENERATIVE_AI: 'google-generative-ai',
  GOOGLE_VERTEX_AI: 'google-vertex-ai',
} as const;

export type AIProvider = typeof AI_PROVIDERS[keyof typeof AI_PROVIDERS];

/**
 * Configuration for different AI providers and their reasoning capabilities
 */
export const PROVIDER_CONFIG = {
  [AI_PROVIDERS.GOOGLE_GENERATIVE_AI]: {
    name: 'Google Generative AI',
    supportsIncludeThoughts: false,
    supportsReasoning: true,
    description: 'Standard Google Generative AI - reasoning through UI components only',
    models: ['gemini-2.5-flash', 'gemini-2.5-pro', 'gemini-2.5-flash-lite'],
  },
  [AI_PROVIDERS.GOOGLE_VERTEX_AI]: {
    name: 'Google Vertex AI',
    supportsIncludeThoughts: true,
    supportsReasoning: true,
    description: 'Google Vertex AI - full includeThoughts support',
    models: ['gemini-2.5-flash', 'gemini-2.5-pro', 'gemini-2.5-flash-lite'],
  },
} as const;

/**
 * Create AI provider instance based on configuration
 */
export function createAIProvider(provider: AIProvider, apiKey: string) {
  switch (provider) {
    case AI_PROVIDERS.GOOGLE_GENERATIVE_AI:
      return createGoogleGenerativeAI({ apiKey });
    
    case AI_PROVIDERS.GOOGLE_VERTEX_AI:
      // Uncomment and configure if you want to use Vertex AI
      // return createVertexAI({ 
      //   apiKey, 
      //   // Add your Vertex AI specific configuration here
      //   // projectId: 'your-project-id',
      //   // location: 'us-central1',
      // });
      throw new Error('Vertex AI provider not configured. Please set up credentials and uncomment the provider.');
    
    default:
      throw new Error(`Unsupported AI provider: ${provider}`);
  }
}

/**
 * Get stream configuration for the provider
 */
export function getStreamConfig(provider: AIProvider, model: string) {
  const config = PROVIDER_CONFIG[provider];
  
  if (!config) {
    throw new Error(`Unknown provider: ${provider}`);
  }

  const baseConfig = {
    model,
  };

  // Add provider-specific configurations
  if (provider === AI_PROVIDERS.GOOGLE_VERTEX_AI && config.supportsIncludeThoughts) {
    return {
      ...baseConfig,
      providerOptions: {
        google: {
          thinkingConfig: {
            thinkingBudget: 8192,
            includeThoughts: true,
          },
        },
      },
    };
  }

  // For providers that don't support includeThoughts, return basic config
  return baseConfig;
}

/**
 * Default provider selection based on environment or preference
 */
export function getDefaultProvider(): AIProvider {
  // You can customize this logic based on your needs
  const envProvider = process.env.AI_PROVIDER as AIProvider;
  
  if (envProvider && Object.values(AI_PROVIDERS).includes(envProvider)) {
    return envProvider;
  }
  
  // Default to Google Generative AI (most common setup)
  return AI_PROVIDERS.GOOGLE_GENERATIVE_AI;
}