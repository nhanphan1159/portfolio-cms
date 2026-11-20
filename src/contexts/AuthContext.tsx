import React, { createContext, useContext, useEffect, useState } from "react";
import type { User } from "firebase/auth";

import { authService } from "@/services/authService";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadingFallback = window.setTimeout(() => {
      setLoading(false);
    }, 5000);

    void authService.getRedirectResult().catch((error) => {
      console.error("Redirect authentication failed:", error);
    });

    const unsubscribe = authService.onAuthStateChange((authUser) => {
      setUser(authUser);
      setLoading(false);
      window.clearTimeout(loadingFallback);

      // If user is logged in but not admin, sign them out
      if (authUser && !authService.isAdmin(authUser)) {
        authService.signOut().then(() => {
          alert("Bạn không có quyền truy cập. Chỉ admin mới có thể đăng nhập.");
        });
      }
    });

    return () => {
      window.clearTimeout(loadingFallback);
      unsubscribe();
    };
  }, []);

  const signIn = async () => {
    try {
      const authUser = await authService.signInWithGoogle();
      if (!authUser) {
        throw new Error("Đăng nhập Google không trả về thông tin tài khoản.");
      }

      // Check if user is admin
      if (!authService.isAdmin(authUser)) {
        await authService.signOut();
        throw new Error(
          "Bạn không có quyền truy cập. Chỉ admin mới có thể đăng nhập."
        );
      }
      setUser(authUser);
      setLoading(false);
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
