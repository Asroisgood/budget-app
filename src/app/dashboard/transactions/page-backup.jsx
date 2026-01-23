"use client";

import AddTransactionButton from "./add-transaction";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useCallback, useEffect, useState, memo } from "react";
import { Button } from "@/components/ui/button";
import { AreYouSure } from "./confirm-dialog";
import { toast } from "sonner";
import { formatCurrency } from "@/lib/format";
import { DatePicker } from "@/components/ui/date-picker";
import { format } from "date-fns";
import PaginationComponent from "./pagination";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

/* ================= HELPERS ================= */
const formatDateForDisplay = (date) => {
  if (!date) return "";
  return format(new Date(date), "dd MMM yyyy");
};

/* ================= COMPONENT ================= */
const TransactionsPage = memo(function TransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [filters, setFilters] = useState({
    category: "all",
    type: "all",
    search: "",
    dateFrom: "",
    dateTo: "",
    sortBy: "date",
    sortOrder: "desc",
  });

  const [categories, setCategories] = useState([]);

  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const page = Number(params.get("page")) || 1;

  /* ================= FETCH CATEGORIES ================= */
  const getCategories = useCallback(async () => {
    try {
      const res = await fetch("/api/categories");
      if (!res.ok) throw new Error();
      const data = await res.json();
      setCategories(data || []);
    } catch {
      setCategories([]);
    }
  }, []);

  useEffect(() => {
    getCategories();
  }, [getCategories]);

  /* ================= FETCH TRANSACTIONS ================= */
  const getTransaction = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const query = new URLSearchParams();
      query.set("page", page);

      if (filters.category && filters.category !== "all")
        query.set("category", filters.category);
      if (filters.type !== "all") query.set("type", filters.type);
      if (filters.search) query.set("search", filters.search);
      if (filters.dateFrom) query.set("dateFrom", filters.dateFrom);
      if (filters.dateTo) query.set("dateTo", filters.dateTo);
      query.set("sortBy", filters.sortBy);
      query.set("sortOrder", filters.sortOrder);

      const res = await fetch(`/api/transactions?${query.toString()}`);
      if (!res.ok) throw new Error();

      const data = await res.json();
      setTransactions(data.data || []);
      setPagination(data.pagination || {});
    } catch (err) {
      console.error(err);
      setTransactions([]);
      setPagination({});
      setError("Failed to fetch transactions");
    } finally {
      setLoading(false);
    }
  }, [page, filters]);

  useEffect(() => {
    getTransaction();
  }, [getTransaction]);

  /* ================= RESET PAGE WHEN FILTER CHANGE ================= */
  useEffect(() => {
    if (page > 1) {
      const newParams = new URLSearchParams(params.toString());
      newParams.set("page", "1");
      router.push(`${pathname}?${newParams.toString()}`);
    }
  }, [filters]);

  /* ================= DELETE ================= */
  const doDelete = useCallback(
    async (id) => {
      try {
        const res = await fetch(`/api/transactions/${id}`, {
          method: "DELETE",
        });
        const data = await res.json();
        if (!res.ok) return toast.error(data.message || "Delete failed");

        toast.success("Transaction deleted");
        getTransaction();
      } catch (err) {
        console.error(err);
        toast.error("Delete failed");
      }
    },
    [getTransaction],
  );

  /* ================= RENDER ================= */
  return (
    <div>
      {/* HEADER */}
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">
              Transactions
            </h1>
            <p className="text-slate-400 mt-1 text-sm sm:text-base">
              Manage your income and expenses
            </p>
          </div>
          <AddTransactionButton onSuccess={getTransaction} />
        </div>
      </div>

      {/* ================= FILTERS ================= */}
      <div className="mb-6 rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-6 shadow-xl shadow-emerald-500/10 backdrop-blur">
        <div className="mb-4 sm:mb-6">
          <h2 className="text-base sm:text-lg font-semibold text-slate-200 mb-3 sm:mb-4 flex items-center gap-2">
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 4a1 1 0 011 1v3a1 1 0 011-1h3a1 1 0 011-1V5a1 1 0 011-1H4a1 1 0 00-1 1v3a1 1 0 00-1 1H4z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7l-4 4m0 0l4 4m-4-4v8m0 0l4 4"
              />
            </svg>
            Filter Transactions
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div>
            <Label className="text-slate-200 text-xs sm:text-sm font-medium mb-2 block">
              Search
            </Label>
            <Input
              placeholder="Search transactions..."
              value={filters.search}
              onChange={(e) =>
                setFilters({ ...filters, search: e.target.value })
              }
              className="h-9 sm:h-10 bg-slate-800/50 border-white/20 text-slate-200 placeholder:text-slate-500 focus:border-emerald-500 focus:bg-slate-800/70 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-200 text-sm"
            />
          </div>

          <div>
            <Label className="text-slate-200 text-xs sm:text-sm font-medium mb-2 block">
              Type
            </Label>
            <Select
              value={filters.type}
              onValueChange={(v) => setFilters({ ...filters, type: v })}
            >
              <SelectTrigger className="h-9 sm:h-10 bg-slate-800/50 border-white/20 text-slate-200 hover:bg-slate-800/70 focus:border-emerald-500 focus:bg-slate-800/70 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-200 text-sm">
                <SelectValue placeholder="All types" />
              </SelectTrigger>
              <SelectContent className="bg-slate-900/95 border border-white/20 backdrop-blur">
                <SelectItem
                  value="all"
                  className="text-slate-200 hover:bg-slate-700 focus:bg-slate-700 cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-slate-400"></div>
                    <span className="text-sm">All Types</span>
                  </div>
                </SelectItem>
                <SelectItem
                  value="income"
                  className="text-slate-200 hover:bg-slate-700 focus:bg-slate-700 cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-400"></div>
                    <span className="text-sm">Income</span>
                  </div>
                </SelectItem>
                <SelectItem
                  value="expense"
                  className="text-slate-200 hover:bg-slate-700 focus:bg-slate-700 cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-400"></div>
                    <span className="text-sm">Expense</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-slate-200 text-xs sm:text-sm font-medium mb-2 block">
              Category
            </Label>
            <Select
              value={filters.category}
              onValueChange={(v) => setFilters({ ...filters, category: v })}
            >
              <SelectTrigger className="h-9 sm:h-10 bg-slate-800/50 border-white/20 text-slate-200 hover:bg-slate-800/70 focus:border-emerald-500 focus:bg-slate-800/70 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-200 text-sm">
                <SelectValue placeholder="All categories" />
              </SelectTrigger>
              <SelectContent className="bg-slate-900/95 border border-white/20 backdrop-blur max-w-xs">
                <SelectItem
                  value="all"
                  className="text-slate-200 hover:bg-slate-700 focus:bg-slate-700 cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-slate-400"></div>
                    <span className="text-sm">All Categories</span>
                  </div>
                </SelectItem>
                {categories.map((c) => (
                  <SelectItem
                    key={c.id}
                    value={c.id.toString()}
                    className="text-slate-200 hover:bg-slate-700 focus:bg-slate-700 cursor-pointer"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div
                        className={`w-2 h-2 rounded-full flex-shrink-0 ${
                          c.type === "income" ? "bg-green-400" : "bg-red-400"
                        }`}
                      />
                      <span className="truncate text-sm">{c.name}</span>
                      <span
                        className={`ml-auto text-xs px-2 py-1 rounded flex-shrink-0 ${
                          c.type === "income"
                            ? "bg-green-500/20 text-green-400"
                            : "bg-red-500/20 text-red-400"
                        }`}
                      >
                        {c.type}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="border-t border-white/10 pt-4 sm:pt-6">
          <h3 className="text-base sm:text-lg font-semibold text-slate-200 mb-3 sm:mb-4 flex items-center gap-2">
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 4h18a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 00-2 2V5a2 2 0 00-2 2h7z"
              />
            </svg>
            Date Range
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <Label className="text-slate-200 text-xs sm:text-sm font-medium mb-2 block">
                Date From
              </Label>
              <DatePicker
                value={filters.dateFrom ? new Date(filters.dateFrom) : null}
                onChange={(d) =>
                  setFilters({
                    ...filters,
                    dateFrom: d ? d.toISOString().split("T")[0] : "",
                  })
                }
                placeholder="Select start date"
                className="h-9 sm:h-10 bg-slate-800/50 border-white/20 text-slate-200 placeholder:text-slate-500 focus:border-emerald-500 focus:bg-slate-800/70 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-200 text-sm"
              />
            </div>

            <div>
              <Label className="text-slate-200 text-xs sm:text-sm font-medium mb-2 block">
                Date To
              </Label>
              <DatePicker
                value={filters.dateTo ? new Date(filters.dateTo) : null}
                onChange={(d) =>
                  setFilters({
                    ...filters,
                    dateTo: d ? d.toISOString().split("T")[0] : "",
                  })
                }
                placeholder="Select end date"
                className="h-9 sm:h-10 bg-slate-800/50 border-white/20 text-slate-200 placeholder:text-slate-500 focus:border-emerald-500 focus:bg-slate-800/70 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-200 text-sm"
              />
            </div>
          </div>

          <div className="flex items-center justify-end pt-4 sm:pt-6">
            <Button
              onClick={() =>
                setFilters({
                  category: "all",
                  type: "all",
                  search: "",
                  dateFrom: "",
                  dateTo: "",
                  sortBy: "date",
                  sortOrder: "desc",
                })
              }
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 sm:px-6 py-2 h-9 sm:h-10 transition-all duration-200 hover:scale-105 shadow-lg shadow-emerald-500/25 text-sm min-h-[36px] sm:min-h-[40px] w-full sm:w-auto"
            >
              <svg
                className="mr-2 h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v16m1-1h14M4 4h16"
                />
              </svg>
              Clear Filters
            </Button>
          </div>
        </div>
      </div>

      {/* ================= PAGINATION ================= */}
      {pagination?.totalPages > 1 && (
        <div className="mb-4 sm:mb-6 rounded-2xl border border-white/10 bg-white/5 p-3 sm:p-4 shadow-xl shadow-emerald-500/10 backdrop-blur">
          <PaginationComponent
            pagination={pagination}
            url="/dashboard/transactions"
            currentPage={page}
          />
        </div>
      )}

      {error && (
        <p className="text-sm text-red-400 text-center mb-4">{error}</p>
      )}

      {/* ================= TABLE ================= */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="relative">
            <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
            <div className="absolute top-0 w-12 h-12 border-4 border-transparent border-t-emerald-400 rounded-full animate-pulse"></div>
          </div>
          <p className="mt-4 text-slate-300 animate-pulse text-center text-sm">
            Loading transactions...
          </p>
        </div>
      ) : (
        <div className="">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-3 sm:p-6 shadow-xl shadow-emerald-500/10 backdrop-blur overflow-x-auto">
            {/* Mobile Card View */}
            <div className="sm:hidden">
              {transactions.length > 0 ? (
                <div className="space-y-3">
                  {transactions.map((t) => (
                    <div
                      key={t.id}
                      className="bg-slate-800/30 rounded-lg p-4 border border-white/10"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <p className="text-white font-medium text-sm mb-1 line-clamp-2">
                            {t.description}
                          </p>
                          <p className="text-slate-400 text-xs">
                            #{t.id} • {formatDateForDisplay(t.date)}
                          </p>
                        </div>
                        <div className="ml-3">
                          <AreYouSure
                            id={t.id}
                            doDelete={doDelete}
                            load={getTransaction}
                            buttons={
                              <Button
                                variant="destructive"
                                className="bg-red-600 hover:bg-red-700 text-white font-medium px-2 py-1.5 rounded-lg transition-all duration-200 hover:scale-105 shadow-lg shadow-red-500/25 text-xs min-h-[32px]"
                              >
                                Delete
                              </Button>
                            }
                          />
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <span
                            className={`font-bold text-sm ${
                              t.category.type === "expense"
                                ? "text-red-400"
                                : "text-green-400"
                            }`}
                          >
                            {formatCurrency(t.amount)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-slate-300 text-xs">
                            {t.category.name}
                          </span>
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                              t.category.type === "income"
                                ? "bg-green-500/20 text-green-400"
                                : "bg-red-500/20 text-red-400"
                            }`}
                          >
                            <span
                              className={`w-1 h-1 rounded-full ${
                                t.category.type === "income"
                                  ? "bg-green-400"
                                  : "bg-red-400"
                              }`}
                            ></span>
                            {t.category.type}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-slate-400">No transactions found</p>
                </div>
              )}
            </div>

            {/* Desktop Table View */}
            <div className="hidden sm:block">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-slate-200 text-xs sm:text-sm">
                      Action
                    </TableHead>
                    <TableHead className="text-slate-200 w-[80px] text-xs sm:text-sm">
                      ID
                    </TableHead>
                    <TableHead className="text-slate-200 text-xs sm:text-sm">
                      Amount
                    </TableHead>
                    <TableHead className="text-slate-200 text-xs sm:text-sm">
                      Description
                    </TableHead>
                    <TableHead className="text-slate-200 text-xs sm:text-sm">
                      Date
                    </TableHead>
                    <TableHead className="text-slate-200 text-xs sm:text-sm">
                      Category
                    </TableHead>
                    <TableHead className="text-slate-200 text-xs sm:text-sm">
                      Type
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.length > 0 ? (
                    transactions.map((t) => (
                      <TableRow
                        key={t.id}
                        className="border-white/10 hover:bg-white/5 transition-colors duration-200"
                      >
                        <TableCell className="text-slate-200 p-2 sm:p-4">
                          <AreYouSure
                            id={t.id}
                            doDelete={doDelete}
                            load={getTransaction}
                            buttons={
                              <Button
                                variant="destructive"
                                className="bg-red-600 hover:bg-red-700 text-white font-medium px-2 sm:px-3 py-1.5 rounded-lg transition-all duration-200 hover:scale-105 shadow-lg shadow-red-500/25 text-xs min-h-[32px]"
                              >
                                Delete
                              </Button>
                            }
                          />
                        </TableCell>
                        <TableCell className="text-slate-200 font-medium text-xs sm:text-sm whitespace-nowrap">
                          {t.id}
                        </TableCell>
                        <TableCell
                          className={`font-medium text-xs sm:text-sm ${
                            t.category.type === "expense"
                              ? "text-red-400"
                              : "text-green-400"
                          }`}
                        >
                          {formatCurrency(t.amount)}
                        </TableCell>
                        <TableCell className="text-slate-200 text-xs sm:text-sm max-w-[120px] lg:max-w-none">
                          <span
                            className="block truncate"
                            title={t.description}
                          >
                            {t.description}
                          </span>
                        </TableCell>
                        <TableCell className="text-slate-200 text-xs sm:text-sm whitespace-nowrap">
                          {formatDateForDisplay(t.date)}
                        </TableCell>
                        <TableCell className="text-slate-200 text-xs sm:text-sm max-w-[100px] lg:max-w-none">
                          <span
                            className="block truncate"
                            title={t.category.name}
                          >
                            {t.category.name}
                          </span>
                        </TableCell>
                        <TableCell className="text-slate-200 text-xs sm:text-sm">
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-2 h-2 rounded-full flex-shrink-0 ${
                                t.category.type === "income"
                                  ? "bg-green-400"
                                  : "bg-red-400"
                              }`}
                            />
                            <span>{t.category.type}</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center">
                        <p className="text-slate-400 py-8">
                          No transactions found
                        </p>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

export default TransactionsPage;
