"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function RegisterPage({ redirectTo = "/dashboard" }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const validate = () => {
    if (name && name.trim().length < 2) return "Nama minimal 2 karakter";
    if (!email) return "Email harus diisi";
    const re =
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|\".+\")@(([^<>()[\]\\.,;:\s@\"]+\.)+[^<>()[\]\\.,;:\s@\"]{2,})$/i;
    if (!re.test(email)) return "Format email tidak valid";
    if (!password) return "Password harus diisi";
    if (password.length < 6) return "Password minimal 6 karakter";
    if (password !== confirmPassword) return "Konfirmasi password tidak cocok";
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
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim() || undefined,
          email,
          password,
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setError(body?.message || "Gagal registrasi");
        setLoading(false);
        return;
      }

      await res.json();
      router.push(redirectTo);
    } catch (err) {
      console.error(err);
      setError("Terjadi kesalahan. Coba lagi.");
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-slate-950">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-emerald-500/20 blur-[120px]" />
        <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-amber-400/20 blur-[140px]" />
        <div className="absolute left-0 top-1/3 h-40 w-40 rounded-full bg-sky-400/20 blur-[90px]" />
      </div>

      <Card className="w-full max-w-md mx-auto bg-slate-900/95 border border-white/10 backdrop-blur shadow-2xl shadow-emerald-500/10">
        <CardHeader>
          <CardTitle className="text-center text-white">Buat Akun</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name" className="text-slate-200">
                Nama (opsional)
              </Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nama kamu"
                className="mt-1 bg-slate-800/50 border-white/20 text-slate-200 placeholder:text-slate-500 focus:border-emerald-500 focus:bg-slate-800/70"
              />
            </div>

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

            <div>
              <Label htmlFor="confirmPassword" className="text-slate-200">
                Konfirmasi Password
              </Label>
              <Input
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Ulangi password"
                required
                className="mt-1 bg-slate-800/50 border-white/20 text-slate-200 placeholder:text-slate-500 focus:border-emerald-500 focus:bg-slate-800/70"
              />
            </div>

            {error && <p className="text-sm text-red-400">{error}</p>}

            <div className="flex items-center justify-between">
              <Button
                type="submit"
                disabled={loading}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                {loading ? "Loading..." : "Daftar"}
              </Button>
              <Link
                href="/login"
                className="text-sm text-slate-400 hover:text-slate-200"
              >
                Sudah punya akun?
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
