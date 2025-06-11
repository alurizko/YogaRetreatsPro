import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";

let authStateCache: { user: any; checked: boolean } = { user: null, checked: false };

export function useAuth() {
  const [authState, setAuthState] = useState(authStateCache);

  const { data: user, isLoading, error } = useQuery({
    queryKey: ["/api/auth/user"],
    retry: false,
    staleTime: 10 * 60 * 1000, // 10 minutes
    refetchInterval: false,
    refetchOnWindowFocus: false,
    enabled: !authState.checked,
    queryFn: async () => {
      try {
        const res = await fetch("/api/auth/user", {
          credentials: "include",
        });
        if (res.status === 401) {
          return null;
        }
        if (!res.ok) {
          throw new Error(`${res.status}: ${res.statusText}`);
        }
        return await res.json();
      } catch (error) {
        return null;
      }
    },
  });

  useEffect(() => {
    if (!isLoading) {
      const newState = { user, checked: true };
      authStateCache = newState;
      setAuthState(newState);
    }
  }, [user, isLoading]);

  return {
    user: authState.user,
    isLoading: !authState.checked && isLoading,
    isAuthenticated: !!authState.user,
    isUnauthenticated: authState.checked && !authState.user,
  };
}
