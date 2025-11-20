import { RateLimitError } from './retryUtils';

export const handleApiError = (error: any): string => {
  if (error instanceof RateLimitError) {
    const retrySeconds = error.retryAfter ? Math.ceil(error.retryAfter / 1000) : 10;
    return `⏱️ Rate Limit Reached\n\nYou've exceeded the free tier quota for this API. Please:\n\n1. Wait ${retrySeconds} seconds and try again\n2. Use a different AI model from the dropdown\n3. Consider upgrading your Gemini API plan for higher limits\n\nLearn more about quotas: https://ai.google.dev/gemini-api/docs/rate-limits`;
  }

  const errorStr = JSON.stringify(error);

  if (errorStr.includes('429') || errorStr.includes('RESOURCE_EXHAUSTED') || errorStr.includes('quota')) {
    return `⏱️ Rate Limit Reached\n\nYou've exceeded the free tier quota. Please:\n\n1. Wait 10-15 seconds and try again\n2. Switch to a different AI model\n3. Consider upgrading your API plan\n\nNote: Free tier has strict rate limits (15 requests/minute)`;
  }

  if (errorStr.includes('503') || errorStr.includes('UNAVAILABLE') || errorStr.includes('overloaded')) {
    return `🔄 Service Temporarily Unavailable\n\nThe AI service is currently overloaded. We'll automatically retry, but you can also:\n\n1. Wait a moment and try again\n2. Use a different model\n3. Try during off-peak hours`;
  }

  if (errorStr.includes('API key')) {
    return `🔑 API Key Issue\n\nThere's a problem with your API key. Please:\n\n1. Check your API key is correct\n2. Verify it's properly configured\n3. Ensure it has the necessary permissions`;
  }

  if (errorStr.includes('safety') || errorStr.includes('blocked')) {
    return `🛡️ Content Blocked\n\nYour request was blocked by safety filters. Please:\n\n1. Rephrase your prompt\n2. Remove any sensitive content\n3. Try a different approach`;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'An unexpected error occurred. Please try again.';
};

export const getFriendlyModelName = (modelId: string): string => {
  const modelMap: Record<string, string> = {
    'gemini-2.0-flash-exp': 'Gemini 2.0 Flash (Experimental)',
    'gemini-2.5-flash': 'Gemini 2.5 Flash',
    'gemini-2.5-pro': 'Gemini 2.5 Pro',
    'gpt-4o': 'GPT-4 Omni',
    'gpt-4o-mini': 'GPT-4 Omni Mini',
    'claude-3-5-sonnet': 'Claude 3.5 Sonnet',
    'claude-3-5-haiku': 'Claude 3.5 Haiku',
  };

  return modelMap[modelId] || modelId;
};
