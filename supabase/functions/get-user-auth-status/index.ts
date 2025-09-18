import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    console.log("get-user-auth-status: Service role key loaded:", !!serviceRoleKey); // Log if key is loaded

    const adminSupabase = createClient(supabaseUrl, serviceRoleKey);

    // Verify the calling user is an authenticated admin
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Unauthorized: No Authorization header' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user: callingUser }, error: userError } = await adminSupabase.auth.getUser(token);

    if (userError || !callingUser) {
      console.error("get-user-auth-status: Error getting calling user:", userError?.message);
      return new Response(JSON.stringify({ error: 'Unauthorized: Invalid token or user not found' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Check if the calling user has 'admin' role
    const { data: profile, error: profileError } = await adminSupabase
      .from('profiles')
      .select('role')
      .eq('id', callingUser.id)
      .single();

    if (profileError || profile?.role !== 'admin') {
      console.error("get-user-auth-status: Calling user is not an admin or profile not found:", profileError?.message);
      return new Response(JSON.stringify({ error: 'Forbidden: Only administrators can perform this action' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { userId } = await req.json();
    console.log("get-user-auth-status: Received status request for userId:", userId);

    const { data: authUser, error: fetchUserError } = await adminSupabase.auth.admin.getUserById(userId);

    if (fetchUserError) {
      console.error("get-user-auth-status: Error fetching user by ID with service role key:", fetchUserError.message);
      return new Response(JSON.stringify({ error: fetchUserError.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    console.log("get-user-auth-status: Fetched authUser email_confirmed_at:", authUser?.user?.email_confirmed_at);

    return new Response(JSON.stringify({ emailConfirmed: !!authUser?.user?.email_confirmed_at }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error("get-user-auth-status: Edge Function error:", error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});