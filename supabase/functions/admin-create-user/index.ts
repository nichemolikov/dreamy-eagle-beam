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
      console.error("admin-create-user: Error getting calling user:", userError?.message);
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
      console.error("admin-create-user: Calling user is not an admin or profile not found:", profileError?.message);
      return new Response(JSON.stringify({ error: 'Forbidden: Only administrators can create users' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { email, password, username, firstName, lastName } = await req.json();

    if (!email || !password) {
      return new Response(JSON.stringify({ error: 'Email and password are required to create a user account.' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { data: newUser, error: createError } = await adminSupabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Automatically confirm email for admin-created users
      user_metadata: {
        username: username || null,
        first_name: firstName || null,
        last_name: lastName || null,
      },
    });

    if (createError) {
      console.error("admin-create-user: Error creating user:", createError.message);
      return new Response(JSON.stringify({ error: createError.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ message: 'User account created successfully', userId: newUser.user?.id }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error("admin-create-user: Edge Function error:", error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});