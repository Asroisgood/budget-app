"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { AreYouSure } from "./confirm-dialog";
import { toast } from "sonner";
import { formatCurrency } from "@/lib/format";
import { DatePicker } from "@/components/ui/date-picker";
import { format } from "date-fns";
import {
  ChevronDown,
  ChevronUp,
  Search,
  Filter,
  Plus,
  Calendar,
  DollarSign,
  Folder,
  ArrowUpDown,
  Trash2,
} from "lucide-react";

const formatDateForDisplay = (date) => {
  if (!date) return "";
  return format(date, "MMM dd, yyyy");
};
import PaginationComponent from "./pagination";
import { memo } from "react";
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

const TransactionsPage = memo(function TransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    category: "",
    type: "all",
    search: "",
    dateFrom: "",
    dateTo: "",
    sortBy: "date",
    sortOrder: "desc",
  });
  const [categories, setCategories] = useState([]);
  const [filtersExpanded, setFiltersExpanded] = useState(true);

  // Add transaction form state
  const [addFormOpen, setAddFormOpen] = useState(false);
  const [addFormLoading, setAddFormLoading] = useState(false);
  const [addFormData, setAddFormData] = useState({
    description: "",
    amount: "",
    category: "",
    date: new Date().toISOString().split("T")[0],
  });

  const getCategories = useCallback(async () => {
    try {
      const res = await fetch("/api/categories", { method: "GET" });
      if (res.ok) {
        const data = await res.json();
        setCategories(data || []);
      } else {
        console.error("Failed to fetch categories:", res.status);
        setCategories([]);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      setCategories([]);
    }
  }, []);

  const handleAddTransaction = async (e) => {
    e.preventDefault();
    setAddFormLoading(true);

    try {
      const res = await fetch("/api/transactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(addFormData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to create transaction");
      }

      toast.success("Transaction created successfully");
      setAddFormData({
        description: "",
        amount: "",
        category: "",
        date: new Date().toISOString().split("T")[0],
      });
      getTransaction();
    } catch (error) {
      toast.error(error.message || "Failed to create transaction");
    } finally {
      setAddFormLoading(false);
    }
  };

  useEffect(() => {
    getCategories();
  }, [getCategories]);

  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const page = Number(params.get("page")) || 1;
  const getTransaction = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      // Build query string from filters
      const queryParams = new URLSearchParams();
      queryParams.append("page", page.toString());

      if (filters.category) queryParams.append("category", filters.category);
      if (filters.type && filters.type !== "all")
        queryParams.append("type", filters.type);
      if (filters.search) queryParams.append("search", filters.search);
      if (filters.dateFrom) queryParams.append("dateFrom", filters.dateFrom);
      if (filters.dateTo) queryParams.append("dateTo", filters.dateTo);
      if (filters.sortBy) queryParams.append("sortBy", filters.sortBy);
      if (filters.sortOrder) queryParams.append("sortOrder", filters.sortOrder);

      const res = await fetch(`/api/transactions?${queryParams.toString()}`, {
        method: "GET",
      });

      if (!res.ok) {
        setTransactions([]);
        setPagination({});
        setError("Failed to fetch transactions");
        return;
      }

      const data = await res.json();
      setTransactions(data.data || []);
      setPagination(data.pagination || {});
    } catch (fetchError) {
      console.error(fetchError);
      setTransactions([]);
      setPagination({});
      setError("Failed to fetch transactions");
    } finally {
      setLoading(false);
    }
  }, [page, filters]);

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
      } catch (fetchError) {
        console.error(fetchError);
        toast.error("Delete failed");
      }
    },
    [getTransaction],
  );

  useEffect(() => {
    getTransaction();
  }, [getTransaction]);

  useEffect(() => {
    // Reset to page 1 when filters change
    if (page > 1) {
      const params = new URLSearchParams(window.location.search);
      params.set("page", "1");
      router.push(`${pathname}?${params.toString()}`);
    }
  }, [filters]);

  return (
    <>
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              Transactions
            </h1>
            <p className="text-slate-400 text-sm sm:text-base">
              Manage your income and expenses
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={() => setAddFormOpen(!addFormOpen)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all duration-200 hover:scale-105"
            >
              <Plus className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Quick Add</span>
              <span className="sm:hidden">Add</span>
            </Button>
          </div>
        </div>
      </div>

    {/* Ultra-Compact Layout */}
    <div className="flex gap-3 mb-6">
      {/* Ultra-Compact Filter Sidebar */}
      <div className="w-48 flex-shrink-0">
        <div className="rounded-xl border border-white/10 bg-white/5 shadow-lg shadow-emerald-500/10 backdrop-blur overflow-hidden">
          <button
            onClick={() => setFiltersExpanded(!filtersExpanded)}
            className="w-full p-3 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Filter className="w-3 h-3 text-emerald-400" />
              <span className="text-xs font-semibold text-slate-200">
                Filters
              </span>
              {(filters.search ||
                filters.category !== "" ||
                filters.type !== "all" ||
                filters.dateFrom ||
                filters.dateTo) && (
                <span className="w-2 h-2 bg-emerald-400 rounded-full"></span>
              )}
            </div>
            {filtersExpanded ? (
              <ChevronUp className="w-3 h-3 text-slate-400" />
            ) : (
              <ChevronDown className="w-3 h-3 text-slate-400" />
            )}
          </button>

          {filtersExpanded && (
            <div className="p-3 space-y-2">
              <div>
                <div className="flex items-center gap-1 mb-1">
                  <Search className="w-3 h-3 text-slate-400" />
                  <span className="text-xs text-slate-400">Search</span>
                </div>
                <Input
                  placeholder="..."
                  value={filters.search}
                  onChange={(e) =>
                    setFilters({ ...filters, search: e.target.value })
                  }
                  className="h-6 bg-slate-800/50 border-white/20 text-slate-200 placeholder:text-slate-600 text-xs px-2"
                />
              </div>

              <div>
                <div className="flex items-center gap-1 mb-1">
                  <DollarSign className="w-3 h-3 text-slate-400" />
                  <span className="text-xs text-slate-400">Type</span>
                </div>
                <Select
                  value={filters.type}
                  onValueChange={(value) =>
                    setFilters({ ...filters, type: value })
                  }
                >
                  <SelectTrigger className="h-6 bg-slate-800/50 border-white/20 text-slate-200 text-xs px-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900/95 border border-white/20 text-xs">
                    <SelectItem value="all" className="text-xs">All</SelectItem>
                    <SelectItem value="income" className="text-xs">
                      <div className="flex items-center gap-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-400"></div>
                        <span>Income</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="expense" className="text-xs">
                      <div className="flex items-center gap-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-400"></div>
                        <span>Expense</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <div className="flex items-center gap-1 mb-1">
                  <Folder className="w-3 h-3 text-slate-400" />
                  <span className="text-xs text-slate-400">Category</span>
                </div>
                <Select
                  value={filters.category}
                  onValueChange={(value) =>
                    setFilters({ ...filters, category: value })
                  }
                >
                  <SelectTrigger className="h-6 bg-slate-800/50 border-white/20 text-slate-200 text-xs px-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900/95 border border-white/20 max-h-40 text-xs">
                    <SelectItem value="all" className="text-xs">All</SelectItem>
                    {categories
                      .filter((cat) => cat.id && cat.id.toString().trim() !== "")
                      .map((category) => (
                        <SelectItem
                          key={category.id}
                          value={category.id.toString()}
                          className="text-xs"
                        >
                          <div className="flex items-center gap-1">
                            <div
                              className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                                category.type === "income"
                                  ? "bg-green-400"
                                  : "bg-red-400"
                              }`}
                            />
                            <span className="truncate">{category.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <div className="flex items-center gap-1 mb-1">
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  <span className="text-xs text-slate-400">Sort</span>
                </div>
                <Select
                  value={filters.sortBy}
                  onValueChange={(value) =>
                    setFilters({ ...filters, sortBy: value })
                  }
                >
                  <SelectTrigger className="h-6 bg-slate-800/50 border-white/20 text-slate-200 text-xs px-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900/95 border border-white/20 text-xs">
                    <SelectItem value="date" className="text-xs">Date</SelectItem>
                    <SelectItem value="amount" className="text-xs">Amount</SelectItem>
                    <SelectItem value="description" className="text-xs">Desc</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={() =>
                  setFilters({
                    category: "",
                    type: "all",
                    search: "",
                    dateFrom: "",
                    dateTo: "",
                    sortBy: "date",
                    sortOrder: "desc",
                  })
                }
                variant="outline"
                className="w-full border-white/20 text-white hover:bg-white/10 text-xs h-6 px-2 flex items-center gap-1"
              >
                <Trash2 className="w-3 h-3" />
                Clear
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 min-w-0">
        {addFormOpen && (
          <div className="rounded-xl border border-white/10 bg-white/5 shadow-lg shadow-emerald-500/10 backdrop-blur p-3 mb-3">
            <div className="flex items-center gap-2 mb-3">
              <Plus className="w-3 h-3 text-emerald-400" />
              <span className="text-sm font-semibold text-slate-200">Add Transaction</span>
            </div>
            <form onSubmit={handleAddTransaction} className="grid grid-cols-4 gap-2">
              <div>
                <div className="flex items-center gap-1 mb-1">
                  <Calendar className="w-3 h-3 text-slate-400" />
                  <span className="text-xs text-slate-400">Date</span>
                </div>
                <DatePicker
                  value={addFormData.date ? new Date(addFormData.date) : null}
                  onChange={(date) =>
                    setAddFormData({
                      ...addFormData,
                      date: date ? date.toISOString().split("T")[0] : "",
                    })
                  }
                  placeholder="Date"
                  className="bg-slate-800 border-white/20 text-xs"
                />
              </div>

              <div>
                <div className="flex items-center gap-1 mb-1">
                  <DollarSign className="w-3 h-3 text-slate-400" />
                  <span className="text-xs text-slate-400">Amount</span>
                </div>
                <Input
                  type="number"
                  step="0.01"
                  value={addFormData.amount}
                  onChange={(e) =>
                    setAddFormData({ ...addFormData, amount: e.target.value })
                  }
                  placeholder="0.00"
                  className="h-6 bg-slate-800 border-white/20 text-slate-200 text-xs px-2"
                  required
                />
              </div>

              <div>
                <div className="flex items-center gap-1 mb-1">
                  <Folder className="w-3 h-3 text-slate-400" />
                  <span className="text-xs text-slate-400">Category</span>
                </div>
                <Select
                  value={addFormData.category}
                  onValueChange={(value) =>
                    setAddFormData({ ...addFormData, category: value })
                  }
                  required
                >
                  <SelectTrigger className="h-6 bg-slate-800 border-white/20 text-slate-200 text-xs px-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-white/20 max-h-40 text-xs">
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id.toString()} className="text-xs">
                        <div className="flex items-center gap-1">
                          <div
                            className={`w-1.5 h-1.5 rounded-full ${
                              category.type === "income"
                                ? "bg-green-400"
                                : "bg-red-400"
                            }`}
                          />
                          <span className="truncate">{category.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <div className="flex items-center gap-1 mb-1">
                  <Search className="w-3 h-3 text-slate-400" />
                  <span className="text-xs text-slate-400">Description</span>
                </div>
                <Input
                  value={addFormData.description}
                  onChange={(e) =>
                    setAddFormData({ ...addFormData, description: e.target.value })
                  }
                  placeholder="Description"
                  className="h-6 bg-slate-800 border-white/20 text-slate-200 text-xs px-2"
                  required
                />
              </div>

              <div className="col-span-4 flex justify-end gap-1 pt-1">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setAddFormOpen(false)}
                  className="border-white/20 hover:bg-white/10 text-xs h-6 px-2"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={addFormLoading}
                  className="bg-emerald-600 hover:bg-emerald-700 text-xs h-6 px-2 disabled:opacity-50"
                >
                  {addFormLoading ? "..." : "Create"}
                </Button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Pagination Section */}
      {pagination && (
        <div className="mb-6 rounded-xl border border-white/10 bg-white/5 p-3 shadow-lg shadow-emerald-500/10 backdrop-blur">
          <PaginationComponent
            pagination={pagination}
            url="/dashboard/transactions"
            currentPage={page}
          />
        </div>
      )}

      {error && (
        <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/5 p-4 shadow-lg shadow-red-500/10 backdrop-blur">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-8 h-8 bg-red-500/20 rounded-full flex items-center justify-center">
              <svg
                className="w-4 h-4 text-red-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <p className="text-red-400 font-medium text-sm">
                Error loading transactions
              </p>
              <p className="text-red-300/70 text-xs mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-12 px-6">
          <div className="relative mb-4">
            <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
            <div className="absolute inset-0 w-12 h-12 border-4 border-transparent border-t-emerald-400 rounded-full animate-pulse"></div>
          </div>
          <div className="text-center">
            <p className="text-slate-300 text-sm font-medium mb-1 animate-pulse">
              Loading transactions...
            </p>
            <p className="text-slate-500 text-xs">
              Please wait while we fetch your data
            </p>
          </div>
        </div>
      ) : (
        <div className="animate-fadeIn">
          <div className="rounded-xl border border-white/10 bg-white/5 shadow-lg shadow-emerald-500/10 backdrop-blur overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-white/10">
                    <TableHead className="text-slate-200 font-semibold whitespace-nowrap text-xs px-3">
                      Actions
                    </TableHead>
                    <TableHead className="text-slate-200 font-semibold whitespace-nowrap w-[60px] text-xs px-3">
                      ID
                    </TableHead>
                    <TableHead className="text-slate-200 font-semibold whitespace-nowrap text-xs px-3">
                      Amount
                    </TableHead>
                    <TableHead className="text-slate-200 font-semibold whitespace-nowrap min-w-[120px] text-xs px-3">
                      Description
                    </TableHead>
                    <TableHead className="text-slate-200 font-semibold whitespace-nowrap text-xs px-3">
                      Date
                    </TableHead>
                    <TableHead className="text-slate-200 font-semibold whitespace-nowrap min-w-[100px] text-xs px-3">
                      Category
                    </TableHead>
                    <TableHead className="text-slate-200 font-semibold whitespace-nowrap text-xs px-3">
                      Type
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.length > 0 &&
                    transactions.map((transaction) => (
                      <TableRow
                        key={transaction.id}
                        className="border-white/10 animate-slideIn hover:bg-white/5 transition-colors"
                      >
                        <TableCell className="text-slate-200 p-2">
                          <AreYouSure
                            buttons={
                              <Button
                                variant="destructive"
                                className="bg-red-600 hover:bg-red-700 text-white font-medium px-2 py-1 rounded text-xs"
                              >
                                Delete
                              </Button>
                            }
                            load={getTransaction}
                            doDelete={doDelete}
                            id={transaction.id}
                          />
                        </TableCell>
                        <TableCell className="text-slate-200 font-medium p-2 text-xs">
                          {transaction.id}
                        </TableCell>
                        <TableCell
                          className={`p-2 font-medium text-xs ${
                            transaction.category.type === "expense"
                              ? "text-red-400"
                              : "text-green-400"
                          }`}
                        >
                          {formatCurrency(transaction.amount)}
                        </TableCell>
                        <TableCell className="text-slate-200 p-2 text-xs">
                          <div
                            className="max-w-[150px] truncate"
                            title={transaction.description}
                          >
                            {transaction.description}
                          </div>
                        </TableCell>
                        <TableCell className="text-slate-200 p-2 whitespace-nowrap text-xs">
                          {formatDateForDisplay(transaction.date)}
                        </TableCell>
                        <TableCell className="text-slate-200 p-2 text-xs">
                          <div
                            className="max-w-[80px] truncate"
                            title={transaction.category.name}
                          >
                            {transaction.category.name}
                          </div>
                        </TableCell>
                        <TableCell className="text-slate-200 p-2 text-xs">
                          <div className="flex items-center gap-1">
                            <div
                              className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                                transaction.category.type === "income"
                                  ? "bg-green-400"
                                  : "bg-red-400"
                              }`}
                            />
                            <span className="capitalize">
                              {transaction.category.type}
                            </span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>
            {transactions.length === 0 && (
              <div className="text-center py-8 px-4">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-slate-800/50 rounded-full mb-3">
                  <svg
                    className="w-6 h-6 text-slate-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                </div>
                <p className="text-slate-400 text-sm font-medium mb-1">
                  No transactions found
                </p>
                <p className="text-slate-500 text-xs">
                  Try adjusting your filters or add your first transaction
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
});

export default TransactionsPage;
