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

import { toast } from "sonner";
import { useState, useEffect } from "react";

export default function AddTransactionButton({ onSuccess }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;
    setLoading(true);

    const formData = new FormData(e.target);

    const bodyJson = {
      date: formData.get("date"),
      amount: formData.get("amount"),
      description: formData.get("description"),
      category: formData.get("category"),
    };

    if (bodyJson.date && bodyJson.amount && bodyJson.category) {
      const res = await fetch("/api/transactions", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        method: "POST",
        body: JSON.stringify(bodyJson),
      });

      if (!res.ok) {
        console.log(await res.json());
        alert("Failed to add transaction");
        return;
      }

      if (onSuccess) onSuccess();
      setOpen(false);
      setLoading(false);
      toast.success("Transaction added");
    } else {
      toast.error("Date, amount, and category is required");
    }
  };

  async function getCategories() {
    const res = await fetch("/api/categories", { method: "GET" });
    const data = await res.json();
    setCategories(data);
  }

  useEffect(() => {
    getCategories();
  }, [open]);

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        setOpen(open);
        setLoading(false);
      }}
    >
      <DialogTrigger asChild>
        <Button>Add Transaction</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Transaction</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Label>Date</Label>
          <Input
            type="date"
            name="date"
            defaultValue={new Date().toISOString().split("T")[0]}
          />
          <Label>Amount</Label>
          <Input type="number" name="amount" />
          <Label>Description</Label>
          <Input name="description" />
          <Label>Category</Label>
          <Select name="category">
            <SelectTrigger>
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id.toString()}>
                  {category.name} ( {category.type} )
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button type="submit" disabled={loading}>
            {loading ? "Loading..." : "Submit"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
