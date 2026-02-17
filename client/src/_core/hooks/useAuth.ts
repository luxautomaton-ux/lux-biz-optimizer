import { useState, useEffect } from "react";
import { User as FirebaseUser } from "firebase/auth";
import { onAuthChange, logOut } from "@/lib/firebase";
import { trpc } from "@/lib/trpc";

type UseAuthOptions = {
  redirectOnUnauthenticated?: boolean;
  redirectPath?: string;
};

// Extended user type that includes database fields
export type AppUser = {
  id: number;
  firebaseUid: string;
  name: string | null;
  email: string | null;
  role: "user" | "admin";
  subscriptionTier: "free" | "starter" | "professional" | "enterprise";
  subscriptionExpiresAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  lastSignedIn: Date;
};

export function useAuth(options?: UseAuthOptions) {
  const { redirectOnUnauthenticated = false, redirectPath = "/signin" } = options ?? {};
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch full user data from database via tRPC
  const { data: dbUser, isLoading: dbLoading } = trpc.auth.me.useQuery(undefined, {
    enabled: Boolean(firebaseUser),
    retry: false,
  });

  useEffect(() => {
    const unsubscribe = onAuthChange((user) => {
      setFirebaseUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!redirectOnUnauthenticated) return;
    if (loading || dbLoading) return;
    if (firebaseUser && dbUser) return;
    if (typeof window === "undefined") return;
    if (window.location.pathname === redirectPath) return;

    window.location.href = redirectPath;
  }, [redirectOnUnauthenticated, redirectPath, loading, dbLoading, firebaseUser, dbUser]);

  const logout = async () => {
    try {
      await logOut();
      window.location.href = "/";
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return {
    user: dbUser as AppUser | null, // Return database user with role field
    firebaseUser, // Also expose Firebase user if needed
    loading: loading || dbLoading,
    error: null,
    isAuthenticated: Boolean(firebaseUser && dbUser),
    refresh: () => {}, // Firebase handles auth state automatically
    logout,
  };
}
