import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

// Simple in-memory rate limiting (resets when function restarts)
const userUsage = new Map<string, { count: number; resetDate: string }>();

const DAILY_LIMIT = 200; // Generous limit for family use

const resetIfNeeded = (userId: string) => {
  const today = new Date().toISOString().split('T')[0];
  const usage = userUsage.get(userId);

  if (!usage || usage.resetDate !== today) {
    userUsage.set(userId, { count: 0, resetDate: today });
  }
};

const checkAndIncrementUsage = (userId: string): { allowed: boolean; count: number; limit: number } => {
  resetIfNeeded(userId);
  const usage = userUsage.get(userId)!;

  if (usage.count >= DAILY_LIMIT) {
    return { allowed: false, count: usage.count, limit: DAILY_LIMIT };
  }

  usage.count++;
  userUsage.set(userId, usage);
  return { allowed: true, count: usage.count, limit: DAILY_LIMIT };
};

Deno.serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    // Get user ID from JWT
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Extract user ID from JWT (simple extraction, assumes valid JWT)
    const token = authHeader.replace('Bearer ', '');
    const payload = JSON.parse(atob(token.split('.')[1]));
    const userId = payload.sub || payload.user_id || 'anonymous';

    // Check rate limit
    const usageCheck = checkAndIncrementUsage(userId);
    if (!usageCheck.allowed) {
      return new Response(
        JSON.stringify({
          error: 'Daily rate limit exceeded',
          usage: usageCheck.count,
          limit: usageCheck.limit,
          message: `You have reached your daily limit of ${usageCheck.limit} requests. Please try again tomorrow or add your own API key in settings.`
        }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get Gemini API key from environment
    const apiKey = Deno.env.get('GEMINI_API_KEY');
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'API key not configured on server' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse request body
    const requestBody = await req.json();
    const { endpoint, body, method = 'POST' } = requestBody;

    if (!endpoint) {
      return new Response(
        JSON.stringify({ error: 'Missing endpoint parameter' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Proxy request to Gemini API
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/${endpoint}?key=${apiKey}`;

    const geminiResponse = await fetch(geminiUrl, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    const responseData = await geminiResponse.json();

    // Add usage info to response headers
    const responseHeaders = {
      ...corsHeaders,
      'Content-Type': 'application/json',
      'X-Rate-Limit-Limit': DAILY_LIMIT.toString(),
      'X-Rate-Limit-Remaining': (DAILY_LIMIT - usageCheck.count).toString(),
      'X-Rate-Limit-Used': usageCheck.count.toString(),
    };

    return new Response(
      JSON.stringify(responseData),
      { status: geminiResponse.status, headers: responseHeaders }
    );

  } catch (error) {
    console.error('Error in gemini-proxy:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
