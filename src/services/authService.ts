import type { User } from "firebase/auth";
import {
  getRedirectResult,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithCredential,
  signInWithPopup,
  signInWithRedirect,
  signOut as firebaseSignOut,
} from "firebase/auth";

import { Capacitor } from "@capacitor/core";
import { FirebaseAuthentication } from "@capacitor-firebase/authentication";

import { auth, googleProvider } from "../config/firebase";

const withTimeout = <T>(
  operation: Promise<T>,
  timeoutMs: number,
  message: string
) =>
  new Promise<T>((resolve, reject) => {
    const timeoutId = window.setTimeout(
      () => reject(new Error(message)),
      timeoutMs
    );

    operation.then(
      (value) => {
        window.clearTimeout(timeoutId);
        resolve(value);
      },
      (error: unknown) => {
        window.clearTimeout(timeoutId);
        reject(error);
      }
    );
  });

const isIosBrowser = () =>
  !Capacitor.isNativePlatform() &&
  (/iPhone|iPad|iPod/.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1));

const ADMIN_EMAIL =
  import.meta.env.VITE_ADMIN_EMAIL || "nhanphan1159@gmail.com";

export const authService = {
  // Sign in with Google
  signInWithGoogle: async (): Promise<User | null> => {
    try {
      if (Capacitor.isNativePlatform()) {
        console.info("[Auth] Starting native Google sign-in");
        const result = await withTimeout(
          FirebaseAuthentication.signInWithGoogle({ skipNativeAuth: true }),
          120_000,
          "Google Sign-In chưa phản hồi. Hãy kiểm tra kết nối mạng và thử lại."
        );
        const idToken = result.credential?.idToken;

        if (!idToken) {
          throw new Error("Google Sign-In không trả về ID token.");
        }

        console.info("[Auth] Exchanging Google credential with Firebase");
        const credential = GoogleAuthProvider.credential(
          idToken,
          result.credential?.accessToken
        );
        const firebaseResult = await withTimeout(
          signInWithCredential(auth, credential),
          30_000,
          "Firebase chưa phản hồi sau khi Google xác thực. Hãy kiểm tra mạng rồi thử lại."
        );
        console.info("[Auth] Firebase sign-in succeeded");
        return firebaseResult.user;
      }

      if (isIosBrowser()) {
        await signInWithRedirect(auth, googleProvider);
        return null;
      }

      const result = await signInWithPopup(auth, googleProvider);
      return result.user;
    } catch (error) {
      console.error("Error signing in with Google:", error);
      throw error;
    }
  },

  getRedirectResult: async (): Promise<User | null> => {
    const result = await getRedirectResult(auth);
    return result?.user ?? null;
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
