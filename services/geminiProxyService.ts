// Service to proxy Gemini API calls through our Edge Function with rate limiting
// This allows users to use the app without their own API key, with daily limits

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const PROXY_ENDPOINT = `${SUPABASE_URL}/functions/v1/gemini-proxy`;

interface UsageInfo {
  used: number;
  remaining: number;
  limit: number;
}

// Storage for usage info
let currentUsage: UsageInfo = {
  used: 0,
  remaining: 200,
  limit: 200
};

// Get current usage info
export const getUsageInfo = (): UsageInfo => {
  return { ...currentUsage };
};

// Make a proxied request to Gemini API through our Edge Function
export const proxyGeminiRequest = async (
  endpoint: string,
  body: any,
  method: string = 'POST',
  authToken?: string
): Promise<any> => {
  try {
    // Get auth token from auth service or use provided one
    const token = authToken || localStorage.getItem('authToken') || '';

    const response = await fetch(PROXY_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        endpoint,
        body,
        method
      })
    });

    // Update usage info from response headers
    const usedHeader = response.headers.get('X-Rate-Limit-Used');
    const remainingHeader = response.headers.get('X-Rate-Limit-Remaining');
    const limitHeader = response.headers.get('X-Rate-Limit-Limit');

    if (usedHeader && remainingHeader && limitHeader) {
      currentUsage = {
        used: parseInt(usedHeader),
        remaining: parseInt(remainingHeader),
        limit: parseInt(limitHeader)
      };

      // Store in localStorage for persistence
      localStorage.setItem('apiUsage', JSON.stringify(currentUsage));
    }

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 429) {
        throw new Error(data.message || 'Daily rate limit exceeded. Please add your own API key in settings for unlimited access.');
      }
      throw new Error(data.error || 'API request failed');
    }

    return data;
  } catch (error) {
    console.error('Proxy request error:', error);
    throw error;
  }
};

// Check if user has their own API key configured
export const hasUserApiKey = (): boolean => {
  return !!(localStorage.getItem('GOOGLE_API_KEY') ||
            localStorage.getItem('GEMINI_API_KEY') ||
            localStorage.getItem('userApiKey'));
};

// Initialize usage from localStorage
const initUsage = () => {
  const stored = localStorage.getItem('apiUsage');
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      // Check if it's from today
      const storedDate = localStorage.getItem('apiUsageDate');
      const today = new Date().toISOString().split('T')[0];

      if (storedDate === today) {
        currentUsage = parsed;
      } else {
        // Reset for new day
        currentUsage = {
          used: 0,
          remaining: 200,
          limit: 200
        };
        localStorage.setItem('apiUsage', JSON.stringify(currentUsage));
        localStorage.setItem('apiUsageDate', today);
      }
    } catch (e) {
      console.error('Error parsing stored usage:', e);
    }
  }
};

// Initialize on module load
initUsage();
