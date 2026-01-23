"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, DollarSign, CreditCard } from "lucide-react";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const [summary, setSummary] = useState({
    totalIncome: 0,
    totalExpense: 0,
    balance: 0,
    transactionCount: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch("/api/dashboard");
      if (response.ok) {
        const data = await response.json();
        setSummary(data);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-white">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-slate-400">Overview budget kamu</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-slate-900/50 border-white/10 backdrop-blur">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">
              Total Pemasukan
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-emerald-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-400">
              Rp {(summary.totalIncome || 0).toLocaleString("id-ID")}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-white/10 backdrop-blur">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">
              Total Pengeluaran
            </CardTitle>
            <TrendingDown className="h-4 w-4 text-red-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-400">
              Rp {(summary.totalExpense || 0).toLocaleString("id-ID")}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-white/10 backdrop-blur">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">
              Saldo
            </CardTitle>
            <DollarSign className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${(summary.balance || 0) >= 0 ? "text-blue-400" : "text-red-400"}`}
            >
              Rp {(summary.balance || 0).toLocaleString("id-ID")}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-white/10 backdrop-blur">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">
              Total Transaksi
            </CardTitle>
            <CreditCard className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-400">
              {summary.transactionCount || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-slate-900/50 border-white/10 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-white">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <a
              href="/dashboard/transactions"
              className="block p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-emerald-500/20">
                  <TrendingUp className="h-5 w-5 text-emerald-400" />
                </div>
                <div>
                  <div className="font-medium text-white">Kelola Transaksi</div>
                  <div className="text-sm text-slate-400">
                    Lihat dan tambah transaksi baru
                  </div>
                </div>
              </div>
            </a>

            <a
              href="/dashboard/categories"
              className="block p-4 rounded-lg bg-blue-500/10 border border-blue-500/20 hover:bg-blue-500/20 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-blue-500/20">
                  <CreditCard className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <div className="font-medium text-white">Kelola Kategori</div>
                  <div className="text-sm text-slate-400">
                    Atur kategori transaksi
                  </div>
                </div>
              </div>
            </a>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-white/10 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-white">Status Budget</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-slate-300">Kesehatan Budget</span>
                <Badge
                  variant={
                    (summary.balance || 0) >= 0 ? "default" : "destructive"
                  }
                >
                  {(summary.balance || 0) >= 0 ? "Sehat" : "Defisit"}
                </Badge>
              </div>

              {(summary.totalIncome || 0) > 0 && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Rasio Pengeluaran</span>
                    <span className="text-slate-300">
                      {Math.round(
                        ((summary.totalExpense || 0) /
                          (summary.totalIncome || 1)) *
                          100,
                      )}
                      %
                    </span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        (summary.totalExpense || 0) /
                          (summary.totalIncome || 1) >
                        0.8
                          ? "bg-red-500"
                          : (summary.totalExpense || 0) /
                                (summary.totalIncome || 1) >
                              0.6
                            ? "bg-yellow-500"
                            : "bg-emerald-500"
                      }`}
                      style={{
                        width: `${Math.min(((summary.totalExpense || 0) / (summary.totalIncome || 1)) * 100, 100)}%`,
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
