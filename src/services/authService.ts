import type { User } from "firebase/auth";
import {
  getRedirectResult,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithCredential,
  signInWithPopup,
  signOut as firebaseSignOut,
} from "firebase/auth";

import { Capacitor } from "@capacitor/core";
import { FirebaseAuthentication } from "@capacitor-firebase/authentication";

import { auth, googleProvider } from "../config/firebase";

const ADMIN_EMAIL =
  import.meta.env.VITE_ADMIN_EMAIL || "nhanphan1159@gmail.com";

export const authService = {
  // Sign in with Google
  signInWithGoogle: async (): Promise<User | null> => {
    try {
      if (Capacitor.isNativePlatform()) {
        console.info("[Auth] Starting native Google sign-in");
        const result = await Promise.race([
          FirebaseAuthentication.signInWithGoogle({ skipNativeAuth: true }),
          new Promise<never>((_, reject) =>
            window.setTimeout(
              () => reject(new Error("Google Sign-In phản hồi quá chậm.")),
              15000
            )
          ),
        ]);
        const idToken = result.credential?.idToken;

        if (!idToken) {
          console.error(
            "[Auth] Native Google sign-in returned no ID token",
            result
          );
          throw new Error("Không nhận được Google credential.");
        }

        const credential = GoogleAuthProvider.credential(
          idToken,
          result.credential?.accessToken
        );
        console.info("[Auth] Exchanging Google credential with Firebase");
        const firebaseResult = await signInWithCredential(auth, credential);
        console.info(
          "[Auth] Firebase sign-in succeeded",
          firebaseResult.user.email
        );
        return firebaseResult.user;
      }

      const result = await signInWithPopup(auth, googleProvider);
      return result.user;
    } catch (error) {
      console.error("Error signing in with Google:", error);
      throw error;
    }
  },

  getRedirectResult: async (): Promise<User | null> => {
    try {
      const result = await getRedirectResult(auth);
      return result?.user ?? null;
    } catch (error) {
      console.error("Error completing Google redirect:", error);
      throw error;
    }
  },

  // Sign out
  signOut: async () => {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
      throw error;
    }
  },

  // Check if user is admin
  isAdmin: (user: User | null): boolean => {
    if (!user || !user.email) return false;
    return user.email.toLowerCase() === ADMIN_EMAIL.toLowerCase();
  },

  // Listen to auth state changes
  onAuthStateChange: (callback: (user: User | null) => void) => {
    return onAuthStateChanged(auth, callback);
  },

  // Get current user
  getCurrentUser: () => {
    return auth.currentUser;
  },
};
