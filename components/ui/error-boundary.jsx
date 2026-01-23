"use client";

import React from "react";
import { Button } from "@/components/ui/button";

export function ErrorBoundary({ children, fallback }) {
  const [hasError, setHasError] = React.useState(false);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    const handleError = (error, errorInfo) => {
      console.error("ErrorBoundary caught an error:", error, errorInfo);
      setHasError(true);
      setError(error);
    };

    // For client-side errors
    const originalError = console.error;
    console.error = (...args) => {
      originalError(...args);
      if (args[0] instanceof Error) {
        handleError(args[0], { componentStack: "" });
      }
    };

    return () => {
      console.error = originalError;
    };
  }, []);

  const handleRetry = () => {
    setHasError(false);
    setError(null);
  };

  if (hasError) {
    if (fallback) {
      return fallback({ error, retry: handleRetry });
    }

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950">
        <div className="absolute inset-0">
          <div className="absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-emerald-500/20 blur-[120px]" />
          <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-red-500/20 blur-[140px]" />
        </div>
        <div className="relative z-10 w-full max-w-md p-6">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/20">
                <svg
                  className="h-8 w-8 text-red-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <h2 className="mb-2 text-2xl font-bold text-white">
                Terjadi Kesalahan
              </h2>
              <p className="mb-6 text-slate-300">
                Maaf, terjadi kesalahan yang tidak terduga. Silakan coba lagi
                atau hubungi administrator jika masalah berlanjut.
              </p>
              <div className="flex flex-col gap-3">
                <Button
                  onClick={handleRetry}
                  className="w-full bg-emerald-600 hover:bg-emerald-700"
                >
                  Coba Lagi
                </Button>
                <Button
                  variant="outline"
                  onClick={() => window.location.reload()}
                  className="w-full border-white/20 text-white hover:bg-white/10"
                >
                  Refresh Halaman
                </Button>
              </div>
              {process.env.NODE_ENV === "development" && error && (
                <details className="mt-6 text-left">
                  <summary className="cursor-pointer text-sm font-semibold text-slate-400">
                    Detail Error (Development Only)
                  </summary>
                  <div className="mt-2 overflow-auto rounded-lg bg-slate-800 p-3">
                    <pre className="text-xs text-red-400">
                      {error.toString()}
                    </pre>
                  </div>
                </details>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
