"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import CustomDatePicker from "@/components/ui/date-picker-custom";
import { Plus } from "lucide-react";
import { toast } from "sonner";

export default function AddTransactionButton({ onSuccess }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    category: "",
    date: new Date().toISOString().split("T")[0],
  });
  const [categories, setCategories] = useState([]);

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categories");
      if (res.ok) {
        const data = await res.json();
        setCategories(data || []);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simple amount conversion - no formatting complications
      const submissionData = {
        ...formData,
        amount: parseFloat(formData.amount) || 0,
      };

      const res = await fetch("/api/transactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submissionData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to create transaction");
      }

      toast.success("Transaction created successfully");
      setFormData({
        description: "",
        amount: "",
        category: "",
        date: new Date().toISOString().split("T")[0],
      });
      setOpen(false);
      onSuccess();
    } catch (error) {
      toast.error(error.message || "Failed to create transaction");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenChange = (isOpen) => {
    setOpen(isOpen);
    if (isOpen) {
      fetchCategories();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all duration-200 hover:scale-105">
          <Plus className="mr-2 h-4 w-4" />
          <span className="hidden sm:inline">Add Transaction</span>
          <span className="sm:hidden">Add</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-slate-900 border-white/10 text-white max-w-sm mx-4 max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Transaction</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <Label
              htmlFor="date"
              className="text-sm font-medium text-slate-200 mb-2"
            >
              Date
            </Label>
            <CustomDatePicker
              value={formData.date ? new Date(formData.date) : null}
              onChange={(date) =>
                setFormData({
                  ...formData,
                  date: date ? date.toISOString().split("T")[0] : "",
                })
              }
              placeholder="Pilih tanggal"
            />
          </div>

          <div>
            <Label
              htmlFor="amount"
              className="text-sm font-medium text-slate-200 mb-2"
            >
              Amount
            </Label>
            <Input
              id="amount"
              type="text"
              inputMode="decimal"
              value={formData.amount}
              onChange={(e) => {
                // Only allow numbers and decimal point
                const value = e.target.value.replace(/[^0-9.]/g, "");
                setFormData({ ...formData, amount: value });
              }}
              placeholder="Enter amount"
              className="bg-slate-800 border-white/20 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-200"
              required
            />
          </div>

          <div>
            <Label
              htmlFor="category"
              className="text-sm font-medium text-slate-200 mb-2"
            >
              Category
            </Label>
            <Select
              value={formData.category}
              onValueChange={(value) =>
                setFormData({ ...formData, category: value })
              }
              required
            >
              <SelectTrigger className="bg-slate-800 border-white/20 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-200">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent className="bg-slate-900/95 border border-white/20 max-h-60 overflow-y-auto">
                {categories.map((category) => (
                  <SelectItem
                    key={category.id}
                    value={category.id.toString()}
                    className="text-slate-200 hover:bg-slate-700 focus:bg-slate-700 cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          category.type === "income"
                            ? "bg-green-400"
                            : "bg-red-400"
                        }`}
                      />
                      <span
                        className={`${
                          category.type === "income"
                            ? "text-green-400"
                            : "text-red-400"
                        }`}
                      >
                        {category.name}
                      </span>
                      <span className="text-xs text-slate-400">
                        ({category.type})
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label
              htmlFor="description"
              className="text-sm font-medium text-slate-200 mb-2"
            >
              Description
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Enter description"
              className="bg-slate-800 border-white/20 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-200 w-full h-20 resize-none"
              required
            />
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="border-white/20 hover:bg-white/10 text-slate-200 transition-all duration-200"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-emerald-600 hover:bg-emerald-700 transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating..." : "Create Transaction"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
