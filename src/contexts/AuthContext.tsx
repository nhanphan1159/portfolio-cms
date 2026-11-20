import React, { createContext, useContext, useEffect, useState } from "react";
import type { User } from "firebase/auth";

import { authService } from "@/services/authService";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  signIn: () => Promise<User | null>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = authService.onAuthStateChange((authUser) => {
      setUser(authUser);
      setLoading(false);

      if (authUser && !authService.isAdmin(authUser)) {
        void authService.signOut().then(() => {
          alert("Bạn không có quyền truy cập. Chỉ admin mới có thể đăng nhập.");
        });
      }
    });

    void authService.getRedirectResult().catch((error: unknown) => {
      console.error("Redirect sign-in failed:", error);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (): Promise<User | null> => {
    try {
      const authUser = await authService.signInWithGoogle();
      if (!authUser) return null;

      if (!authService.isAdmin(authUser)) {
        await authService.signOut();
        throw new Error(
          "Bạn không có quyền truy cập. Chỉ admin mới có thể đăng nhập."
        );
      }

      setUser(authUser);
      setLoading(false);
      return authUser;
    } catch (error: unknown) {
      console.error("Sign in error:", error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await authService.signOut();
    } catch (error) {
      console.error("Sign out error:", error);
      throw error;
    }
  };

  const isAdmin = authService.isAdmin(user);

  const value = {
    user,
    loading,
    isAdmin,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
