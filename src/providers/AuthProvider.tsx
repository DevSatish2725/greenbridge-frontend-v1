"use client";

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import axios from "axios";

import { setAccessToken } from "@/lib/auth.token";

import { authService } from "@/services/auth.service";

import type { AuthUser } from "@/types/auth.types";

import { useRouter } from "next/navigation";

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  accessTokenSetter: (accessToken: string) => void;

  getUserProfile: () => Promise<AuthUser | null>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();

  const accessTokenSetter = useCallback((accessToken: string) => {
    setAccessToken(accessToken);
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
      router.push("/sellers")
    } finally {
      setAccessToken(null);
      setUser(null);
    }
  }, []);

  const getUserProfile = useCallback(async (): Promise<AuthUser | null> => {
    try {
      const meResponse = await authService.getMe();

      setUser(meResponse.data);
      return meResponse.data;
    } catch (error) {
      setAccessToken(null);
      setUser(null);

      if (!axios.isAxiosError(error) || error.response?.status !== 401) {
        console.error("Failed to restore auth session", error);
      }
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function initializeAuth() {
      try {
        const meResponse = await authService.getMe();

        if (!cancelled) {
          console.log("meResponse", meResponse);
          setUser(meResponse.data);
        }
      } catch (error) {
        if (!cancelled) {
          setAccessToken(null);
          setUser(null);
        }

        if (!axios.isAxiosError(error) || error.response?.status !== 401) {
          console.error("Failed to restore auth session", error);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    initializeAuth();

    return () => {
      cancelled = true;
    };
  }, []);

  console.log("context user", user);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        isLoading,
        accessTokenSetter,
        getUserProfile,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
