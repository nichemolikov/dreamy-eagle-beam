import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';

    const adminSupabase = createClient(supabaseUrl, serviceRoleKey);

    const { username } = await req.json();

    if (!username) {
      return new Response(JSON.stringify({ error: 'Username is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // 1. Find the user_id (which is 'id' in profiles) from the profiles table using the username
    const { data: profileData, error: profileError } = await adminSupabase
      .from('profiles')
      .select('id')
      .eq('username', username)
      .single();

    if (profileError || !profileData) {
      console.warn(`resolve-username-to-email: No profile found for username: ${username}`);
      return new Response(JSON.stringify({ error: 'Invalid username' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // 2. Use the user_id to get the email from auth.users
    const { data: authUser, error: authUserError } = await adminSupabase.auth.admin.getUserById(profileData.id);

    if (authUserError || !authUser?.user?.email) {
      console.error(`resolve-username-to-email: Error fetching auth user email for ID ${profileData.id}:`, authUserError?.message);
      return new Response(JSON.stringify({ error: 'Could not retrieve email for user' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ email: authUser.user.email }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error("resolve-username-to-email: Edge Function error:", error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});