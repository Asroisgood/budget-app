"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  CreditCard,
  Calendar,
} from "lucide-react";
import { useEffect, useState } from "react";
import { formatCurrency } from "@/lib/format";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Skeleton Component
const SkeletonCard = ({ className = "" }) => (
  <Card
    className={`bg-slate-900/50 border-white/10 backdrop-blur ${className}`}
  >
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <div className="h-4 bg-slate-700 rounded w-20 animate-pulse"></div>
      <div className="h-4 w-4 bg-slate-700 rounded animate-pulse"></div>
    </CardHeader>
    <CardContent>
      <div className="animate-pulse">
        <div className="h-8 bg-slate-700 rounded w-32 mb-2"></div>
        <div className="h-3 bg-slate-700 rounded w-24"></div>
      </div>
    </CardContent>
  </Card>
);

const SkeletonQuickActions = () => (
  <div className="bg-slate-900/50 border border-white/10 backdrop-blur rounded-xl p-6">
    <div className="animate-pulse">
      <div className="h-6 bg-slate-700 rounded w-32 mb-4"></div>
      <div className="space-y-3">
        <div className="p-4 rounded-lg bg-slate-800/50 border border-white/10">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-slate-700">
              <div className="h-5 w-5 bg-slate-600 rounded"></div>
            </div>
            <div className="flex-1">
              <div className="h-4 bg-slate-700 rounded w-32 mb-2"></div>
              <div className="h-3 bg-slate-700 rounded w-48"></div>
            </div>
          </div>
        </div>
        <div className="p-4 rounded-lg bg-slate-800/50 border border-white/10">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-slate-700">
              <div className="h-5 w-5 bg-slate-600 rounded"></div>
            </div>
            <div className="flex-1">
              <div className="h-4 bg-slate-700 rounded w-32 mb-2"></div>
              <div className="h-3 bg-slate-700 rounded w-48"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const SkeletonRecentTransactions = () => (
  <div className="bg-slate-900/50 border border-white/10 backdrop-blur rounded-xl p-6">
    <div className="animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <div className="h-6 bg-slate-700 rounded w-40"></div>
        <div className="h-6 bg-slate-700 rounded w-20"></div>
      </div>
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 border border-white/10"
          >
            <div className="flex-1">
              <div className="h-4 bg-slate-700 rounded w-48 mb-2"></div>
              <div className="h-3 bg-slate-700 rounded w-32"></div>
            </div>
            <div className="text-right">
              <div className="h-4 bg-slate-700 rounded w-24 mb-1"></div>
              <div className="h-3 bg-slate-700 rounded w-16"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const SkeletonLoader = () => (
  <div className="space-y-6">
    {/* Header */}
    <div>
      <div className="h-10 bg-slate-700 rounded w-32 mb-2"></div>
      <div className="h-4 bg-slate-700 rounded w-48"></div>
    </div>

    {/* Summary Cards */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
    </div>

    {/* Quick Actions & Recent Transactions */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <SkeletonQuickActions />
      <SkeletonRecentTransactions />
    </div>
  </div>
);

export default function DashboardPage() {
  const [summary, setSummary] = useState({
    totalIncome: 0,
    totalExpense: 0,
    balance: 0,
    transactionCount: 0,
    recentTransactions: [],
    monthlyData: [],
    categoryBreakdown: [],
    period: "this-month",
    dateRange: { start: "", end: "" },
  });
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("this-month");

  // Helper function to get period label
  const getPeriodLabel = (periodValue) => {
    const labels = {
      "this-month": "Bulan Ini",
      "last-month": "Bulan Lalu",
      "this-quarter": "Quarter Ini",
      "this-year": "Tahun Ini",
      "all-time": "Semua Waktu",
    };
    return labels[periodValue] || "Bulan Ini";
  };

  // Format date range for display
  const formatDateRange = (start, end) => {
    if (!start || !end) return "";
    const startDate = new Date(start).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    const endDate = new Date(end).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    return `${startDate} - ${endDate}`;
  };

  useEffect(() => {
    fetchDashboardData();
  }, [period]); // Re-fetch when period changes

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/dashboard?period=${period}`);
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
    return <SkeletonLoader />;
  }

  // Calculate percentages
  const total = summary.totalIncome + summary.totalExpense;
  let incomePercentage = 0;
  let expensePercentage = 0;

  if (total > 0) {
    incomePercentage = ((summary.totalIncome / total) * 100).toFixed(1);
    expensePercentage = ((summary.totalExpense / total) * 100).toFixed(1);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
          <p className="text-slate-400">Overview budget kamu</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-40 bg-slate-800 border-white/20 text-slate-200">
              <SelectValue placeholder="Pilih periode" />
            </SelectTrigger>
            <SelectContent className="bg-slate-900 border-white/20">
              <SelectItem
                value="this-month"
                className="text-slate-200 hover:bg-slate-700"
              >
                Bulan Ini
              </SelectItem>
              <SelectItem
                value="last-month"
                className="text-slate-200 hover:bg-slate-700"
              >
                Bulan Lalu
              </SelectItem>
              <SelectItem
                value="this-quarter"
                className="text-slate-200 hover:bg-slate-700"
              >
                Quarter Ini
              </SelectItem>
              <SelectItem
                value="this-year"
                className="text-slate-200 hover:bg-slate-700"
              >
                Tahun Ini
              </SelectItem>
              <SelectItem
                value="all-time"
                className="text-slate-200 hover:bg-slate-700"
              >
                Semua Waktu
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Time Context Info Bar */}
      <div className="bg-slate-800/50 border border-white/10 rounded-lg p-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-emerald-400" />
            <span className="text-slate-200">
              Menampilkan data:{" "}
              <span className="font-semibold">{getPeriodLabel(period)}</span>
            </span>
            {summary.dateRange?.start && summary.dateRange?.end && (
              <span className="text-sm text-slate-400 hidden sm:inline">
                (
                {formatDateRange(
                  summary.dateRange.start,
                  summary.dateRange.end,
                )}
                )
              </span>
            )}
          </div>
          <div className="text-sm text-slate-400">
            {summary.transactionCount} transaksi
          </div>
        </div>
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
              {formatCurrency(summary.totalIncome || 0)}
            </div>
            <div className="text-xs text-slate-400 mt-1">
              {total > 0 ? `${incomePercentage}% dari total` : "Tidak ada data"}
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
              {formatCurrency(summary.totalExpense || 0)}
            </div>
            <div className="text-xs text-slate-400 mt-1">
              {total > 0
                ? `${expensePercentage}% dari total`
                : "Tidak ada data"}
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
              {formatCurrency(summary.balance || 0)}
            </div>
            <div className="text-xs text-slate-400 mt-1">
              {summary.balance >= 0 ? "Surplus" : "Defisit"}
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
            <div className="text-xs text-slate-400 mt-1">Bulan ini</div>
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

        {/* Recent Transactions */}
        <Card className="bg-slate-900/50 border-white/10 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-white flex items-center justify-between">
              <span>Transaksi Terakhir</span>
              <Badge
                variant="secondary"
                className="bg-slate-700 text-slate-300"
              >
                {summary.recentTransactions?.length || 0} transaksi
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {summary.recentTransactions?.length > 0 ? (
              summary.recentTransactions.slice(0, 5).map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 border border-white/10"
                >
                  <div className="flex-1">
                    <div className="font-medium text-white text-sm">
                      {transaction.description}
                    </div>
                    <div className="text-xs text-slate-400">
                      {transaction.category?.name} • {transaction.date}
                    </div>
                  </div>
                  <div className="text-right">
                    <div
                      className={`font-bold text-sm ${
                        transaction.category?.type === "expense"
                          ? "text-red-400"
                          : "text-green-400"
                      }`}
                    >
                      {formatCurrency(transaction.amount)}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-slate-400">
                <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>Belum ada transaksi</p>
              </div>
            )}
            {summary.recentTransactions?.length > 5 && (
              <div className="text-center pt-2">
                <a
                  href="/dashboard/transactions"
                  className="text-emerald-400 hover:text-emerald-300 text-sm font-medium"
                >
                  Lihat semua transaksi →
                </a>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
