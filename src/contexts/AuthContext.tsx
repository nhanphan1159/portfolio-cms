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
    const unsubscribe = authService.onAuthStateChange((authUser) => {
      setUser(authUser);
      setLoading(false);

      // If user is logged in but not admin, sign them out
      if (authUser && !authService.isAdmin(authUser)) {
        authService.signOut().then(() => {
          alert("Bạn không có quyền truy cập. Chỉ admin mới có thể đăng nhập.");
        });
      }
    });

    return () => unsubscribe();
  }, []);

  const signIn = async () => {
    try {
      const authUser = await authService.signInWithGoogle();

      // Check if user is admin
      if (!authService.isAdmin(authUser)) {
        await authService.signOut();
        throw new Error(
          "Bạn không có quyền truy cập. Chỉ admin mới có thể đăng nhập."
        );
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
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
