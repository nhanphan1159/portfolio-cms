import { useEffect, useState } from "react";

import { useNavigate } from "@tanstack/react-router";

import { useAuth } from "../contexts/AuthContext";

export default function Login() {
  const { signIn, user, loading: authLoading, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (!authLoading && user && isAdmin) {
      navigate({ to: "/admin/about", replace: true });
    }
  }, [authLoading, user, isAdmin, navigate]);

  const handleGoogleSignIn = async () => {
    if (loading) return; // Prevent multiple clicks

    let timeoutId: number | undefined;

    try {
      setLoading(true);
      setError("");
      timeoutId = window.setTimeout(() => {
        setLoading(false);
        setError(
          "Đăng nhập Google đang treo. Hãy mở lại app hoặc kiểm tra kết nối mạng."
        );
      }, 20000);

      await signIn();
      if (timeoutId) window.clearTimeout(timeoutId);
      navigate({ to: "/admin/about", replace: true });
    } catch (caughtError: unknown) {
      if (timeoutId) window.clearTimeout(timeoutId);
      const authError = caughtError as { code?: string; message?: string };
      if (
        authError.code === "auth/cancelled-popup-request" ||
        authError.code === "auth/popup-closed-by-user"
      ) {
        setError("");
      } else {
        setError(authError.message || "Đăng nhập thất bại. Vui lòng thử lại.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-[100dvh] overflow-hidden bg-[#eef3f8] px-4 py-6 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute -left-28 top-[-9rem] h-80 w-80 rounded-full bg-cyan-200/50 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-24 h-96 w-96 rounded-full bg-blue-300/40 blur-3xl" />

      <section className="relative mx-auto grid min-h-[calc(100dvh-3rem)] max-w-6xl overflow-hidden rounded-[2rem] border border-white/70 bg-white shadow-[0_24px_80px_rgba(30,64,175,0.14)] lg:grid-cols-[1.08fr_0.92fr]">
        <div className="relative hidden overflow-hidden bg-slate-950 p-12 text-white lg:flex lg:flex-col lg:justify-between">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(56,189,248,0.24),transparent_28%),radial-gradient(circle_at_85%_75%,rgba(59,130,246,0.22),transparent_32%)]" />
          <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(255,255,255,.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.08)_1px,transparent_1px)] [background-size:32px_32px]" />

          <div className="relative">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-lg font-bold backdrop-blur">
              PC
            </div>
          </div>

          <div className="relative max-w-md">
            <p className="mb-5 text-sm font-semibold uppercase tracking-[0.24em] text-cyan-300">
              Portfolio workspace
            </p>
            <h1 className="text-5xl font-semibold leading-[1.08] tracking-tight">
              Quản lý portfolio
              <span className="block text-slate-400">
                trong một không gian.
              </span>
            </h1>
            <p className="mt-6 max-w-sm text-base leading-7 text-slate-300">
              Cập nhật nội dung, dự án và kinh nghiệm một cách nhanh chóng.
            </p>
          </div>

          <div className="relative flex items-center gap-3 text-sm text-slate-400">
            <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_16px_rgba(52,211,153,0.8)]" />
            Hệ thống CMS đang hoạt động
          </div>
        </div>

        <div className="flex items-center justify-center px-6 py-10 sm:px-12 lg:px-16">
          <div className="w-full max-w-sm">
            <div className="mb-10 lg:hidden">
              <div className="mb-6 flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-sm font-bold text-white">
                PC
              </div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
                Portfolio CMS
              </p>
            </div>

            <div className="mb-8">
              <h2 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                Chào mừng trở lại
              </h2>
              <p className="mt-3 leading-7 text-slate-500">
                Đăng nhập bằng tài khoản Google được phân quyền quản trị.
              </p>
            </div>

            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="group flex h-14 w-full items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 text-[15px] font-semibold text-slate-800 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-blue-600" />
              ) : (
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                >
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
              )}
              {loading ? "Đang đăng nhập..." : "Tiếp tục với Google"}
            </button>

            {error && (
              <div className="mt-4 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700">
                {error}
              </div>
            )}

            <div className="mt-8 flex items-center gap-3">
              <div className="h-px flex-1 bg-slate-100" />
              <span className="text-xs font-medium text-slate-400">
                QUYỀN TRUY CẬP
              </span>
              <div className="h-px flex-1 bg-slate-100" />
            </div>

            <p className="mt-5 text-center text-sm leading-6 text-slate-400">
              Chỉ tài khoản admin được phép sử dụng CMS.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
