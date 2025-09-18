import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

type UserRole = "client" | "admin" | null;

export function useUserRole() {
  const [role, setRole] = useState<UserRole>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserRole = async () => {
      setIsLoading(true);
      setError(null);
      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (userError) {
        console.error("Error getting user in useUserRole:", userError);
        setError(userError.message);
        setRole(null);
        setIsLoading(false);
        return;
      }

      if (user) {
        console.log("User found in useUserRole:", user.id);
        const { data, error } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();

        if (error) {
          console.error("Error fetching user role from profiles:", error);
          setError(error.message);
          setRole(null);
        } else if (data) {
          console.log("Fetched role:", data.role);
          setRole(data.role as UserRole);
        } else {
          console.log("No profile data found for user, setting role to null.");
          setRole(null); // User exists but no profile/role found
        }
      } else {
        console.log("No user logged in, setting role to null.");
        setRole(null); // No user logged in
      }
      setIsLoading(false);
    };

    fetchUserRole();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log("Auth state changed:", _event, session);
      if (session) {
        fetchUserRole(); // Re-fetch role on auth state change (e.g., login/logout)
      } else {
        setRole(null);
        setIsLoading(false);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return { role, isLoading, error };
}