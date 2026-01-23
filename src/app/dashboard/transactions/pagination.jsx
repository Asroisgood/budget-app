"use client";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useRouter, usePathname } from "next/navigation";

export default function PaginationComponent({ pagination, url, currentPage }) {
  const router = useRouter();
  const pathname = usePathname();

  const handlePageChange = (page) => {
    const params = new URLSearchParams(window.location.search);
    params.set("page", page);
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex items-center justify-center gap-2">
      {/* Previous Button */}
      <button
        onClick={() => handlePageChange(pagination.prev)}
        disabled={!pagination.prev}
        className={`inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 h-9 px-3 ${
          pagination.prev
            ? "bg-emerald-600/10 border border-emerald-500/30 text-emerald-200 hover:bg-emerald-600/20 hover:border-emerald-500/50 hover:text-emerald-100"
            : "bg-slate-800/20 border border-slate-700/30 text-slate-500 cursor-not-allowed"
        }`}
      >
        <svg
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>

      {/* Page Numbers */}
      <div className="flex items-center gap-1">
        {[...Array(pagination.totalPage)].map((_, i) => (
          <button
            key={i + 1}
            onClick={() => handlePageChange(i + 1)}
            className={`inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 h-9 w-9 ${
              i + 1 === currentPage
                ? "bg-emerald-600 border border-emerald-500 text-white shadow-lg shadow-emerald-500/25"
                : "bg-slate-800/50 border border-slate-600/50 text-slate-300 hover:bg-slate-700/50 hover:border-slate-500/50 hover:text-white"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {/* Next Button */}
      <button
        onClick={() => handlePageChange(pagination.next)}
        disabled={!pagination.next}
        className={`inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 h-9 px-3 ${
          pagination.next
            ? "bg-emerald-600/10 border border-emerald-500/30 text-emerald-200 hover:bg-emerald-600/20 hover:border-emerald-500/50 hover:text-emerald-100"
            : "bg-slate-800/20 border border-slate-700/30 text-slate-500 cursor-not-allowed"
        }`}
      >
        <svg
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>
    </div>
  );
}
