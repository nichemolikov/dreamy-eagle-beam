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
    console.log("admin-update-user: Service role key loaded:", !!serviceRoleKey); // Log if key is loaded

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
      console.error("admin-update-user: Error getting calling user:", userError?.message);
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
      console.error("admin-update-user: Calling user is not an admin or profile not found:", profileError?.message);
      return new Response(JSON.stringify({ error: 'Forbidden: Only administrators can perform this action' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { userId, newPassword, emailConfirmed } = await req.json();
    console.log("admin-update-user: Received update request for userId:", userId, "emailConfirmed:", emailConfirmed);

    if (!userId) {
      return new Response(JSON.stringify({ error: 'User ID is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const updateData: { password?: string; email_confirmed_at?: string | null } = {};

    if (newPassword) {
      updateData.password = newPassword;
    }

    // Set email_confirmed_at based on the boolean flag
    if (emailConfirmed !== undefined) {
      updateData.email_confirmed_at = emailConfirmed ? new Date().toISOString() : null;
      console.log("admin-update-user: Setting email_confirmed_at to:", updateData.email_confirmed_at);
    }

    if (Object.keys(updateData).length === 0) {
      return new Response(JSON.stringify({ message: 'No update data provided' }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { data: updatedUser, error: updateError } = await adminSupabase.auth.admin.updateUserById(
      userId,
      updateData
    );

    if (updateError) {
      console.error("admin-update-user: Error updating user in Supabase Auth:", updateError.message);
      return new Response(JSON.stringify({ error: updateError.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    console.log("admin-update-user: Successfully updated user in Supabase Auth:", updatedUser);

    return new Response(JSON.stringify({ message: 'User updated successfully', user: updatedUser }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error("admin-update-user: Edge Function error:", error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});