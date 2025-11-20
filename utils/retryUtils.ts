interface RetryOptions {
  maxRetries?: number;
  initialDelay?: number;
  maxDelay?: number;
  backoffMultiplier?: number;
  retryableErrors?: string[];
}

const DEFAULT_OPTIONS: Required<RetryOptions> = {
  maxRetries: 3,
  initialDelay: 1000,
  maxDelay: 30000,
  backoffMultiplier: 2,
  retryableErrors: ['503', '429', 'UNAVAILABLE', 'RESOURCE_EXHAUSTED', 'overloaded', 'rate limit', 'quota']
};

const parseRetryDelay = (error: any): number | null => {
  try {
    const errorStr = JSON.stringify(error);
    const match = errorStr.match(/"retryDelay"\s*:\s*"(\d+(?:\.\d+)?)s"/);
    if (match) {
      return Math.ceil(parseFloat(match[1]) * 1000);
    }

    const retryAfterMatch = errorStr.match(/"retry[_-]?after"\s*:\s*(\d+)/i);
    if (retryAfterMatch) {
      return parseInt(retryAfterMatch[1]) * 1000;
    }
  } catch (e) {
    // Ignore parsing errors
  }
  return null;
};

const isRetryableError = (error: any, retryableErrors: string[]): boolean => {
  const errorString = JSON.stringify(error).toLowerCase();
  return retryableErrors.some(keyword => errorString.includes(keyword.toLowerCase()));
};

const delay = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

export class RateLimitError extends Error {
  constructor(message: string, public retryAfter?: number) {
    super(message);
    this.name = 'RateLimitError';
  }
}

export async function withRetry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  let lastError: any;
  let currentDelay = opts.initialDelay;

  for (let attempt = 0; attempt <= opts.maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      const isLastAttempt = attempt === opts.maxRetries;
      const shouldRetry = isRetryableError(error, opts.retryableErrors);

      if (isLastAttempt || !shouldRetry) {
        const errorStr = JSON.stringify(error);
        if (errorStr.includes('429') || errorStr.includes('RESOURCE_EXHAUSTED') || errorStr.includes('quota')) {
          const retryDelay = parseRetryDelay(error);
          throw new RateLimitError(
            'API rate limit exceeded. Please try again in a moment or use a different model.',
            retryDelay || 10000
          );
        }
        throw error;
      }

      const suggestedDelay = parseRetryDelay(error);
      const waitTime = suggestedDelay
        ? Math.min(suggestedDelay, opts.maxDelay)
        : Math.min(currentDelay, opts.maxDelay);

      console.warn(
        `Request failed (attempt ${attempt + 1}/${opts.maxRetries + 1}). ` +
        `Retrying in ${waitTime}ms...`,
        error
      );

      await delay(waitTime);

      if (!suggestedDelay) {
        currentDelay = Math.min(currentDelay * opts.backoffMultiplier, opts.maxDelay);
      }
    }
  }

  throw lastError;
}
