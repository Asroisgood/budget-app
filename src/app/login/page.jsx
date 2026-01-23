"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home, Wallet, TrendingUp, DollarSign } from "lucide-react";

export default function LoginForm({ redirectTo = "/dashboard" }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const validate = () => {
    if (!email) return "Email harus diisi";
    // simple email regex
    const re =
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\\.,;:\s@\"]+\.)+[^<>()[\]\\.,;:\s@\"]{2,})$/i;
    if (!re.test(email)) return "Format email tidak valid";
    if (!password) return "Password harus diisi";
    if (password.length < 6) return "Password minimal 6 karakter";
    return null;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setError(body?.message || "Gagal login");
        setLoading(false);
        return;
      }

      const data = await res.json();

      router.push(redirectTo);
    } catch (err) {
      console.error(err);
      setError("Terjadi kesalahan. Coba lagi.");
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Enhanced Animated Background */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Animated gradient mesh */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-emerald-500/10 via-transparent to-blue-500/10 animate-pulse" />
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-tr from-purple-500/10 via-transparent to-pink-500/10 animate-pulse delay-1000" />
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-bl from-amber-500/10 via-transparent to-teal-500/10 animate-pulse delay-2000" />
        </div>

        {/* Floating particles */}
        <div className="absolute top-20 left-10 w-2 h-2 bg-emerald-400/30 rounded-full animate-bounce" />
        <div className="absolute top-32 right-20 w-3 h-3 bg-blue-400/30 rounded-full animate-bounce delay-500" />
        <div className="absolute bottom-40 left-32 w-2 h-2 bg-purple-400/30 rounded-full animate-bounce delay-1000" />
        <div className="absolute bottom-20 right-40 w-1 h-1 bg-pink-400/30 rounded-full animate-bounce delay-1500" />
        <div className="absolute top-1/2 left-20 w-2 h-2 bg-amber-400/30 rounded-full animate-bounce delay-700" />
        <div className="absolute top-1/3 right-32 w-1 h-1 bg-teal-400/30 rounded-full animate-bounce delay-1200" />

        {/* Large animated orbs */}
        <div className="absolute -top-40 left-1/4 w-96 h-96 -translate-x-1/2 rounded-full bg-gradient-to-r from-emerald-500/20 to-teal-500/10 blur-[200px] animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 translate-x-1/2 rounded-full bg-gradient-to-r from-blue-500/15 to-indigo-500/10 blur-[180px] animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-0 w-64 h-64 -translate-y-1/2 rounded-full bg-gradient-to-r from-purple-500/15 to-pink-500/10 blur-[160px] animate-pulse delay-500" />

        {/* Moving light beams */}
        <div className="absolute top-0 left-1/2 w-1 h-full bg-gradient-to-b from-emerald-400/10 to-transparent animate-pulse delay-500" />
        <div className="absolute top-0 right-1/3 w-1 h-full bg-gradient-to-b from-blue-400/10 to-transparent animate-pulse delay-1500" />
        <div className="absolute bottom-0 left-1/4 w-1 h-full bg-gradient-to-t from-purple-400/10 to-transparent animate-pulse delay-1000" />
      </div>

      {/* Back to Home Button - Outside card */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 z-[100]">
        <Link
          href="/"
          className="flex items-center gap-2 px-4 py-2 bg-slate-800/80 backdrop-blur border border-white/10 rounded-full text-slate-300 hover:text-white hover:bg-slate-800/90 transition-all duration-300 group shadow-lg"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform duration-300" />
          <Home className="h-4 w-4" />
          <span className="text-sm font-medium">Beranda</span>
        </Link>
      </div>

      <Card className="w-full max-w-md mx-auto bg-slate-900/90 border border-white/10 backdrop-blur-xl shadow-2xl shadow-emerald-500/20 relative overflow-hidden">
        {/* Card decoration */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-emerald-500/20 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-blue-500/15 to-transparent rounded-full blur-2xl" />

        <CardHeader className="relative">
          <CardTitle className="text-center text-white text-2xl font-bold">
            <div className="flex items-center justify-center gap-3">
              <div className="p-3 bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 rounded-xl border border-emerald-500/20">
                <Wallet className="h-6 w-6 text-emerald-400" />
              </div>
              <span>Login</span>
            </div>
          </CardTitle>
          <p className="text-center text-slate-400 text-sm mt-3">
            Masuk ke akun budget kamu
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-slate-200">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@contoh.com"
                required
                className="mt-1 bg-slate-800/50 border-white/20 text-slate-200 placeholder:text-slate-500 focus:border-emerald-500 focus:bg-slate-800/70"
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-slate-200">
                Password
              </Label>
              <div className="relative mt-1">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan password"
                  required
                  className="bg-slate-800/50 border-white/20 text-slate-200 placeholder:text-slate-500 focus:border-emerald-500 focus:bg-slate-800/70"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-slate-400 hover:text-slate-200"
                  aria-label={
                    showPassword ? "Sembunyikan password" : "Tampilkan password"
                  }
                >
                  {showPassword ? (
                    // fallback icon if you don't have Icons
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10a9.96 9.96 0 012.175-5.625M9.88 9.88l4.24 4.24M2 2l20 20"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {error && <p className="text-sm text-red-400">{error}</p>}

            <div className="flex items-center justify-between">
              <Button
                type="submit"
                disabled={loading}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                {loading ? "Loading..." : "Masuk"}
              </Button>

              <a
                href="/forgot-password"
                className="text-sm text-slate-400 hover:text-slate-200"
              >
                Lupa password?
              </a>
            </div>

            <p className="text-sm text-slate-400">
              Belum punya akun?{" "}
              <Link
                href="/register"
                className="text-emerald-400 hover:text-emerald-300"
              >
                Daftar di sini
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
