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

const categoryTypes = [
  { value: "expense", label: "Expense" },
  { value: "income", label: "Income" },
];

import { toast } from "sonner";

import { useState } from "react";

export default function AddCategoryButton({ onSuccess }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;
    setLoading(true);

    const formData = new FormData(e.target);

    const bodyJson = {
      name: formData.get("categoryName"),
      type: formData.get("categoryType"),
    };

    if (bodyJson.name && bodyJson.type) {
      const res = await fetch("/api/categories", {
        method: "POST",
        body: JSON.stringify(bodyJson),
      });

      if (!res.ok) {
        console.log(await res.json());
        alert("Failed to add category");
        return;
      }

      if (onSuccess) onSuccess();
      setOpen(false);
    } else {
      toast.error("Category name and type is required");
    }

    setTimeout(() => setLoading(false), 1000);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        setOpen(open);
        setLoading(false);
      }}
    >
      <DialogTrigger asChild>
        <Button>Add Category</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Category</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Label>Category Name</Label>
          <Input placeholder="Enter category..." name="categoryName" />
          <Label>Category Type</Label>
          <Select name="categoryType">
            <SelectTrigger>
              <SelectValue placeholder="Select Category Type" />
            </SelectTrigger>
            <SelectContent>
              {categoryTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button type="submit" disabled={loading}>
            {loading ? "Adding..." : "Add Category"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
