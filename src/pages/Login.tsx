/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";

import { useNavigate } from "@tanstack/react-router";

import { useAuth } from "../contexts/AuthContext";

export default function Login() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const handleGoogleSignIn = async () => {
    if (loading) return; // Prevent multiple clicks

    try {
      setLoading(true);
      setError("");
      await signIn();
      // Redirect to admin page after successful login
      navigate({ to: "/admin" });
    } catch (error: any) {
      // Ignore cancelled popup errors (user closed popup)
      if (
        error.code === "auth/cancelled-popup-request" ||
        error.code === "auth/popup-closed-by-user"
      ) {
        setError("");
      } else {
        setError(error.message || "Đăng nhập thất bại. Vui lòng thử lại.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-2">Admin Login</h2>
          <p className="text-gray-600">
            Đăng nhập với tài khoản Google được ủy quyền
          </p>
        </div>

        <div className="bg-white shadow-lg rounded-lg p-8">
          <div className="space-y-6">
            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors duration-200"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" className="mr-3">
                <path
                  fill="#4285F4"
                  d="M19.6 10.23c0-.82-.1-1.42-.25-2.05H10v3.72h5.5c-.15.96-.74 2.31-2.04 3.22v2.45h3.16c1.89-1.73 2.98-4.3 2.98-7.34z"
                />
                <path
                  fill="#34A853"
                  d="M13.46 15.13c-.83.59-1.96 1-3.46 1-2.64 0-4.88-1.74-5.68-4.15H1.07v2.52C2.72 17.75 6.09 20 10 20c2.7 0 4.96-.89 6.62-2.42l-3.16-2.45z"
                />
                <path
                  fill="#FBBC05"
                  d="M3.99 10c0-.69.12-1.35.32-1.97V5.51H1.07A9.973 9.973 0 000 10c0 1.61.39 3.14 1.07 4.49l3.24-2.52c-.2-.62-.32-1.28-.32-1.97z"
                />
                <path
                  fill="#EA4335"
                  d="M10 3.88c1.88 0 3.13.81 3.85 1.48l2.84-2.76C14.96.99 12.7 0 10 0 6.09 0 2.72 2.25 1.07 5.51l3.24 2.52C5.12 5.62 7.36 3.88 10 3.88z"
                />
              </svg>
              {loading ? "Đang đăng nhập..." : "Đăng nhập với Google"}
            </button>

            {error && (
              <div className="w-full p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            <p className="text-sm text-gray-600 text-center">
              Chỉ admin được ủy quyền mới có thể truy cập
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
