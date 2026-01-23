"use client";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Link from "next/link";

export function ErrorPage({
  title = "Terjadi Kesalahan",
  message = "Maaf, terjadi kesalahan yang tidak terduga.",
  showRetry = true,
  showHome = true,
  onRetry,
}) {
  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-slate-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-red-600">{title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-sm text-slate-600">{message}</p>
          <div className="flex flex-col gap-2">
            {showRetry && (
              <Button
                onClick={onRetry || (() => window.location.reload())}
                className="w-full"
              >
                Coba Lagi
              </Button>
            )}
            {showHome && (
              <Button variant="outline" asChild className="w-full">
                <Link href="/">Kembali ke Beranda</Link>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
