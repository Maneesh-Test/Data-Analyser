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
  maxDelay: 10000,
  backoffMultiplier: 2,
  retryableErrors: ['503', '429', 'UNAVAILABLE', 'RESOURCE_EXHAUSTED', 'overloaded', 'rate limit']
};

const isRetryableError = (error: any, retryableErrors: string[]): boolean => {
  const errorString = JSON.stringify(error).toLowerCase();
  return retryableErrors.some(keyword => errorString.includes(keyword.toLowerCase()));
};

const delay = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

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
        throw error;
      }

      console.warn(
        `Request failed (attempt ${attempt + 1}/${opts.maxRetries + 1}). ` +
        `Retrying in ${currentDelay}ms...`,
        error
      );

      await delay(currentDelay);

      currentDelay = Math.min(currentDelay * opts.backoffMultiplier, opts.maxDelay);
    }
  }

  throw lastError;
}
