"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { env } from "@/config/env";
import {
  clearTokens,
  getTokens,
  setAccessToken,
  setTokens,
  type Tokens,
} from "@/lib/auth/tokens";
import {
  fetchCurrentUser,
  logoutSession,
  refreshAccessToken,
} from "@/lib/auth/api";
import type { components } from "@/lib/api/generated/schema";

type User = components["schemas"]["UserRead"];
type AuthStatus = "loading" | "authenticated" | "unauthenticated";

type AuthContextValue = {
  user: User | null;
  status: AuthStatus;
  login: () => void;
  logout: () => Promise<void>;
  completeLogin: (tokens: Tokens, user: User) => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<AuthStatus>("loading");

  useEffect(() => {
    let cancelled = false;

    async function validateSession() {
      const tokens = getTokens();
      if (!tokens) {
        setStatus("unauthenticated");
        return;
      }

      try {
        const me = await fetchCurrentUser();
        if (cancelled) return;
        setUser(me);
        setStatus("authenticated");
      } catch {
        try {
          const refreshed = await refreshAccessToken(tokens.refreshToken);
          setAccessToken(refreshed.access_token);
          const me = await fetchCurrentUser();
          if (cancelled) return;
          setUser(me);
          setStatus("authenticated");
        } catch {
          if (cancelled) return;
          clearTokens();
          setUser(null);
          setStatus("unauthenticated");
        }
      }
    }

    validateSession();

    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(() => {
    // eslint-disable-next-line @next/next/no-location-assign-relative-destination -- redirect cross-origin pro backend OAuth, não uma rota interna do Next
    window.location.href = `${env.apiBaseUrl}/auth/google/login`;
  }, []);

  const logout = useCallback(async () => {
    const tokens = getTokens();
    if (tokens) {
      try {
        await logoutSession(tokens.refreshToken);
      } catch {
        // best-effort — segue limpando a sessão local mesmo se a chamada falhar
      }
    }
    clearTokens();
    setUser(null);
    setStatus("unauthenticated");
  }, []);

  const completeLogin = useCallback((newTokens: Tokens, newUser: User) => {
    setTokens(newTokens);
    setUser(newUser);
    setStatus("authenticated");
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, status, login, logout, completeLogin }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth precisa ser usado dentro de um AuthProvider");
  }
  return ctx;
}
