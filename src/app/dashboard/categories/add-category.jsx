"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Suppress hydration warning for Radix UI components
const DialogNoSSR = Dialog;
const DialogTriggerNoSSR = DialogTrigger;
const DialogContentNoSSR = DialogContent;
const DialogHeaderNoSSR = DialogHeader;
const DialogTitleNoSSR = DialogTitle;
const SelectNoSSR = Select;
const SelectContentNoSSR = SelectContent;
const SelectItemNoSSR = SelectItem;
const SelectTriggerNoSSR = SelectTrigger;
const SelectValueNoSSR = SelectValue;

const categoryTypes = [
  { value: "expense", label: "Expense" },
  { value: "income", label: "Income" },
];

// Filter out any empty values
const validCategoryTypes = categoryTypes.filter(
  (type) => type.value && type.value.trim() !== "",
);

import { toast } from "sonner";

import { useState, useEffect } from "react";

export default function AddCategoryButton({ onSuccess }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);

  const getCategories = async () => {
    try {
      const res = await fetch("/api/categories", { method: "GET" });
      if (!res.ok) {
        throw new Error("Failed to fetch categories");
      }
      const data = await res.json();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to load categories");
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.target);

    const name = formData.get("categoryName")?.trim();
    const type = formData.get("categoryType");

    if (!name || !type) {
      toast.error("Category name and type are required");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, type }),
      });

      if (!res.ok) {
        const data = await res.json();
        toast.error(data?.message || "Failed to add category");
        return;
      }

      if (onSuccess) onSuccess();
      setOpen(false);
      toast.success("Category added successfully");
    } catch (error) {
      console.error("Error adding category:", error);
      toast.error("Failed to add category");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Action Button for Mobile */}
      <div className="fixed bottom-6 right-6 z-50 sm:hidden">
        <Button
          onClick={() => setOpen(true)}
          className="bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-500/25 transition-all duration-200 hover:scale-105 rounded-full w-14 h-14 flex items-center justify-center"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
        </Button>
      </div>

      <DialogNoSSR
        open={open}
        onOpenChange={(open) => {
          setOpen(open);
          setLoading(false);
        }}
      >
        <DialogTriggerNoSSR asChild className="hidden sm:block">
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium shadow-lg shadow-emerald-500/25 transition-all duration-200 hover:scale-105 min-w-fit">
            <svg
              className="mr-2 h-4 w-4 flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            <span className="whitespace-nowrap">Add Category</span>
          </Button>
        </DialogTriggerNoSSR>

        <DialogContentNoSSR className="bg-slate-900/95 border border-white/10 shadow-2xl shadow-emerald-500/10 backdrop-blur">
          <DialogHeaderNoSSR>
            <DialogTitleNoSSR className="text-xl text-slate-200">
              Add New Category
            </DialogTitleNoSSR>
          </DialogHeaderNoSSR>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label className="text-slate-200 text-sm font-medium">
                  Category Name
                </Label>
                <Input
                  placeholder="Enter category name..."
                  name="categoryName"
                  className="mt-1 bg-slate-800/50 border-white/20 text-slate-200 placeholder:text-slate-500 focus:border-emerald-500 focus:bg-slate-800/70"
                />
              </div>

              <div>
                <Label className="text-slate-200 text-sm font-medium">
                  Category Type
                </Label>
                <SelectNoSSR name="categoryType">
                  <SelectTriggerNoSSR className="mt-1 bg-slate-800/50 border-white/20 text-slate-200 hover:bg-slate-800/70">
                    <SelectValueNoSSR placeholder="Select category type" />
                  </SelectTriggerNoSSR>
                  <SelectContentNoSSR className="bg-slate-900/95 border border-white/20 backdrop-blur">
                    {validCategoryTypes.map((type) => (
                      <SelectItemNoSSR
                        key={type.value}
                        value={type.value}
                        className="text-slate-200 hover:bg-slate-700 focus:bg-slate-700 cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-2 h-2 rounded-full ${
                              type.value === "income"
                                ? "bg-green-400"
                                : "bg-red-400"
                            }`}
                          />
                          <span>{type.label}</span>
                        </div>
                      </SelectItemNoSSR>
                    ))}
                  </SelectContentNoSSR>
                </SelectNoSSR>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                className="flex-1 border-white/20 text-white hover:bg-white/10"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-500/25"
              >
                {loading ? (
                  <>
                    <svg
                      className="mr-2 h-4 w-4 animate-spin"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Adding...
                  </>
                ) : (
                  <>
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
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Add Category
                  </>
                )}
              </Button>
            </div>
          </form>
        </DialogContentNoSSR>
      </DialogNoSSR>
    </>
  );
}
