import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query"; // Import useQuery and useQueryClient

type UserRole = "client" | "admin" | null;

export function useUserRole() {
  const queryClient = useQueryClient(); // Initialize queryClient

  const { data: role, isLoading, error } = useQuery<UserRole, Error>({
    queryKey: ["userRole"], // Define a clear query key for the user's role
    queryFn: async () => {
      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (userError) {
        console.error("Error getting user in useUserRole queryFn:", userError);
        throw userError; // Let react-query handle the error state
      }

      if (user) {
        console.log("User found in useUserRole queryFn:", user.id);
        const { data, error: profileError } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();

        if (profileError) {
          console.error("Error fetching user role from profiles in useUserRole queryFn:", profileError);
          // If no profile, or error, assume null role
          return null;
        } else if (data) {
          console.log("Fetched role in useUserRole queryFn:", data.role);
          return data.role as UserRole;
        } else {
          console.log("No profile data found for user in useUserRole queryFn, setting role to null.");
          return null;
        }
      } else {
        console.log("No user logged in in useUserRole queryFn, setting role to null.");
        return null; // No user logged in
      }
    },
    staleTime: 5 * 60 * 1000, // Role doesn't change often, can be stale for 5 minutes
    cacheTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
    refetchOnWindowFocus: false, // Don't refetch on window focus unless explicitly invalidated
  });

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log("Auth state changed in useUserRole listener:", _event, session);
      // Invalidate the query cache to trigger a re-fetch of the role
      queryClient.invalidateQueries({ queryKey: ["userRole"] });
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [queryClient]); // Depend on queryClient

  return { role, isLoading, error };
}