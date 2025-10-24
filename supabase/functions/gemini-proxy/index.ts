import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const DAILY_LIMIT = 200; // Generous limit for family use

// Initialize Supabase client with service role key
const getSupabaseClient = () => {
  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  return createClient(supabaseUrl, supabaseServiceKey);
};

const checkAndIncrementUsage = async (userId: string): Promise<{ allowed: boolean; count: number; limit: number }> => {
  const supabase = getSupabaseClient();
  const today = new Date().toISOString().split('T')[0];

  // Try to get or create today's usage record
  const { data: usage, error: fetchError } = await supabase
    .from('api_usage')
    .select('*')
    .eq('user_id', userId)
    .eq('reset_date', today)
    .maybeSingle();

  if (fetchError) {
    console.error('Error fetching usage:', fetchError);
    throw new Error('Failed to check rate limit');
  }

  // If no record exists, create one
  if (!usage) {
    const { error: insertError } = await supabase
      .from('api_usage')
      .insert({
        user_id: userId,
        request_count: 1,
        reset_date: today,
      });

    if (insertError) {
      console.error('Error creating usage record:', insertError);
      throw new Error('Failed to track usage');
    }

    return { allowed: true, count: 1, limit: DAILY_LIMIT };
  }

  // Check if limit exceeded
  if (usage.request_count >= DAILY_LIMIT) {
    return { allowed: false, count: usage.request_count, limit: DAILY_LIMIT };
  }

  // Increment the counter
  const { error: updateError } = await supabase
    .from('api_usage')
    .update({ request_count: usage.request_count + 1 })
    .eq('id', usage.id);

  if (updateError) {
    console.error('Error updating usage:', updateError);
    throw new Error('Failed to update usage');
  }

  return { allowed: true, count: usage.request_count + 1, limit: DAILY_LIMIT };
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

    // Extract user ID from JWT
    const token = authHeader.replace('Bearer ', '');
    const payload = JSON.parse(atob(token.split('.')[1]));
    const userId = payload.sub || payload.user_id || 'anonymous';

    // Check rate limit using database
    const usageCheck = await checkAndIncrementUsage(userId);
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
