import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const DAILY_LIMIT = 200;

const getSupabaseClient = () => {
  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  return createClient(supabaseUrl, supabaseServiceKey);
};

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  const startTime = Date.now();

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    const payload = JSON.parse(atob(token.split('.')[1]));
    const userId = payload.sub || payload.user_id || 'anonymous';

    const supabase = getSupabaseClient();

    // Check rate limit using RPC function
    const { data: rateLimitResult, error: rateLimitError } = await supabase
      .rpc('check_rate_limit', {
        p_user_id: userId,
        p_daily_limit: DAILY_LIMIT
      });

    if (rateLimitError) {
      console.error('Rate limit check error:', rateLimitError);
      return new Response(
        JSON.stringify({ error: 'Rate limit check failed' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!rateLimitResult.allowed) {
      return new Response(
        JSON.stringify({
          error: 'Daily rate limit exceeded',
          usage: rateLimitResult.used,
          limit: rateLimitResult.limit,
          remaining: rateLimitResult.remaining,
          reset_at: rateLimitResult.reset_at,
          message: rateLimitResult.message || `You have reached your daily limit of ${rateLimitResult.limit} requests. Please try again tomorrow or add your own API key in settings.`
        }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const apiKey = Deno.env.get('GEMINI_API_KEY');
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'API key not configured on server' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const requestBody = await req.json();
    const { endpoint, body, method = 'POST' } = requestBody;

    if (!endpoint) {
      return new Response(
        JSON.stringify({ error: 'Missing endpoint parameter' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/${endpoint}?key=${apiKey}`;

    const geminiResponse = await fetch(geminiUrl, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    const responseData = await geminiResponse.json();
    const responseTime = Date.now() - startTime;

    // Log API usage asynchronously (don't wait for it)
    supabase.rpc('insert_api_usage', {
      p_user_id: userId,
      p_endpoint: endpoint,
      p_tokens_used: 0, // You can extract this from responseData if available
      p_response_time_ms: responseTime
    }).then(({ error }) => {
      if (error) console.error('Failed to log usage:', error);
    });

    const responseHeaders = {
      ...corsHeaders,
      'Content-Type': 'application/json',
      'X-Rate-Limit-Limit': rateLimitResult.limit.toString(),
      'X-Rate-Limit-Remaining': rateLimitResult.remaining.toString(),
      'X-Rate-Limit-Used': rateLimitResult.used.toString(),
      'X-Rate-Limit-Reset': rateLimitResult.reset_at,
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
