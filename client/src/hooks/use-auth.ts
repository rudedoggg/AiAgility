import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { User } from "@shared/models/auth";
import { supabase } from "@/lib/supabase";
import { API_BASE_URL } from "@/lib/config";

async function fetchAppUser(): Promise<User | null> {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  if (!token) return null;

  const res = await fetch(`${API_BASE_URL}/api/auth/user`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (res.status === 401 || res.status === 404) return null;
  if (!res.ok) throw new Error(`${res.status}: ${res.statusText}`);
  return res.json();
}

async function syncUser(): Promise<void> {
  const { data } = await supabase.auth.getSession();
  const session = data.session;
  if (!session) return;

  const supabaseUser = session.user;
  const meta = supabaseUser.user_metadata || {};

  try {
    await fetch(`${API_BASE_URL}/api/auth/sync`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session.access_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: supabaseUser.email || null,
        firstName: meta.first_name || meta.full_name?.split(" ")[0] || null,
        lastName: meta.last_name || meta.full_name?.split(" ").slice(1).join(" ") || null,
        profileImageUrl: meta.avatar_url || meta.picture || null,
      }),
    });
  } catch (err) {
    console.warn("Failed to sync user profile:", err);
  }
}

export function useAuth() {
  const queryClient = useQueryClient();

  const { data: user, isLoading } = useQuery<User | null>({
    queryKey: ["/api/auth/user"],
    queryFn: fetchAppUser,
    retry: false,
    staleTime: 0,
    gcTime: 0,
    refetchOnWindowFocus: true,
    refetchOnMount: "always",
  });

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event) => {
        if (event === "SIGNED_IN") {
          await syncUser();
          queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
        }
        if (event === "SIGNED_OUT") {
          queryClient.setQueryData(["/api/auth/user"], null);
          queryClient.clear();
        }
      },
    );

    return () => subscription.unsubscribe();
  }, [queryClient]);

  const logout = async (): Promise<void> => {
    await supabase.auth.signOut();
    queryClient.setQueryData(["/api/auth/user"], null);
    queryClient.clear();
  };

  return {
    user: user ?? null,
    isLoading,
    isAuthenticated: !!user,
    logout,
  };
}
