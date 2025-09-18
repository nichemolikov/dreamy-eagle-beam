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
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { data, error } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();

        if (error) {
          console.error("Error fetching user role:", error);
          setError(error.message);
          setRole(null);
        } else if (data) {
          setRole(data.role as UserRole);
        } else {
          setRole(null); // User exists but no profile/role found
        }
      } else {
        setRole(null); // No user logged in
      }
      setIsLoading(false);
    };

    fetchUserRole();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
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