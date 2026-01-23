"use client";

import { useCallback, useEffect, useState } from "react";
import AddCategoryButton from "./add-category";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { AreYouSure } from "./confirm-dialog";
import { toast } from "sonner";
import { memo } from "react";

const CategoriesPages = memo(function CategoriesPages() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
    } finally {
      setLoading(false);
    }
  }, []);

  const doDelete = useCallback(
    async (id) => {
      try {
        const res = await fetch(`/api/categories/${id}`, {
          method: "DELETE",
        });

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          toast.error(data?.message || "Delete failed");
          return;
        }

        toast.success("Category deleted");
        getCategories();
      } catch (fetchError) {
        console.error(fetchError);
        toast.error("Delete failed");
      }
    },
    [getCategories],
  );

  useEffect(() => {
    getCategories();
  }, [getCategories]);

  return (
    <>
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">
              Categories
            </h1>
            <p className="text-slate-400 mt-1 text-sm sm:text-base">
              Manage your transaction categories
            </p>
          </div>
          <AddCategoryButton
            onSuccess={() => {
              getCategories();
              toast.success("New Category Added");
            }}
          />
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-400 text-center mb-4">{error}</p>
      )}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="relative">
            <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
            <div className="absolute top-0 w-12 h-12 border-4 border-transparent border-t-emerald-400 rounded-full animate-pulse"></div>
          </div>
          <p className="mt-4 text-slate-300 animate-pulse text-center">
            Loading categories...
          </p>
        </div>
      ) : (
        <div className="animate-fadeIn">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-3 sm:p-6 shadow-xl shadow-emerald-500/10 backdrop-blur">
            {/* Mobile Card View */}
            <div className="sm:hidden">
              {categories.length > 0 ? (
                <div className="space-y-3">
                  {categories.map((item) => (
                    <div
                      key={item.id}
                      className="bg-slate-800/30 rounded-lg p-4 border border-white/10"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <p className="text-white font-medium text-sm mb-1">
                            {item.name}
                          </p>
                          <p className="text-slate-400 text-xs">
                            ID: #{item.id}
                          </p>
                        </div>
                        <div className="ml-3">
                          <AreYouSure
                            buttons={
                              <Button
                                variant="destructive"
                                className="bg-red-600 hover:bg-red-700 text-white font-medium px-2 py-1.5 rounded-lg transition-all duration-200 hover:scale-105 shadow-lg shadow-red-500/25 text-xs min-h-[32px]"
                              >
                                Delete
                              </Button>
                            }
                            load={getCategories}
                            doDelete={doDelete}
                            id={item.id}
                          />
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <span className="text-slate-300 text-xs">
                            Category Type:
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                              item.type === "income"
                                ? "bg-green-500/20 text-green-400"
                                : "bg-red-500/20 text-red-400"
                            }`}
                          >
                            <span
                              className={`w-1 h-1 rounded-full ${
                                item.type === "income"
                                  ? "bg-green-400"
                                  : "bg-red-400"
                              }`}
                            ></span>
                            {item.type}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-slate-400 animate-fadeIn">
                    No categories found
                  </p>
                </div>
              )}
            </div>

            {/* Desktop Table View */}
            <div className="hidden sm:block">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-slate-200 text-center whitespace-nowrap text-xs sm:text-sm w-20">
                      Action
                    </TableHead>
                    <TableHead className="text-slate-200 text-center whitespace-nowrap text-xs sm:text-sm w-16">
                      ID
                    </TableHead>
                    <TableHead className="text-slate-200 text-left whitespace-nowrap text-xs sm:text-sm">
                      Category Name
                    </TableHead>
                    <TableHead className="text-slate-200 text-center whitespace-nowrap text-xs sm:text-sm w-24">
                      Type
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categories.map((item) => (
                    <TableRow
                      key={item.id}
                      className="border-white/10 animate-slideIn hover:bg-white/5 transition-colors duration-200"
                    >
                      <TableCell className="text-slate-200 text-center p-2 sm:p-4 w-20">
                        <AreYouSure
                          buttons={
                            <Button
                              variant="destructive"
                              className="bg-red-600 hover:bg-red-700 text-white font-medium px-2 sm:px-3 py-1.5 sm:py-1.5 rounded-lg transition-all duration-200 hover:scale-105 shadow-lg shadow-red-500/25 min-h-[32px] sm:min-h-[36px] text-xs sm:text-sm"
                            >
                              Delete
                            </Button>
                          }
                          load={getCategories}
                          doDelete={doDelete}
                          id={item.id}
                        />
                      </TableCell>
                      <TableCell className="text-slate-200 text-center whitespace-nowrap text-xs sm:text-sm w-16">
                        {item.id}
                      </TableCell>
                      <TableCell className="text-slate-200 text-left text-xs sm:text-sm">
                        <span
                          className="block truncate max-w-[150px] lg:max-w-none"
                          title={item.name}
                        >
                          {item.name}
                        </span>
                      </TableCell>
                      <TableCell className="text-slate-200 text-center w-24">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                            item.type === "income"
                              ? "bg-green-500/20 text-green-400"
                              : "bg-red-500/20 text-red-400"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              item.type === "income"
                                ? "bg-green-400"
                                : "bg-red-400"
                            }`}
                          ></span>
                          {item.type}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {categories.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-slate-400 animate-fadeIn">
                    No categories found
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
});

export default CategoriesPages;
