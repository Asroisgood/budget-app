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
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { ChevronDownIcon } from "lucide-react";
import { formatDate } from "@/lib/format";

import { Textarea } from "@/components/ui/textarea";

import { toast } from "sonner";
import { useState, useEffect } from "react";
import { set } from "date-fns";

export default function AddTransactionButton({ onSuccess }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [openCalendar, setOpenCalendar] = useState(false);

  const [date, setDate] = useState(new Date());
  const [amount, setAmount] = useState(0);
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState(0);

  function resetState() {
    setDate(new Date());
    setAmount(0);
    setDescription("");
    setCategory(0);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;
    setLoading(true);

    const month = date.getMonth() + 1;
    const day = date.getDate();
    const year = date.getFullYear();

    const dateParam = `${year}-${month}-${day}`;

    const bodyJson = {
      date: dateParam,
      amount: amount,
      description: description,
      category: category,
    };

    if (bodyJson.date && bodyJson.amount && bodyJson.category) {
      const res = await fetch("/api/transactions", {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(bodyJson),
      });

      if (!res.ok) {
        console.log(await res.json());
        alert("Failed to add transaction");
        return;
      }

      resetState();

      if (onSuccess) onSuccess();
      setOpen(false);
      setLoading(false);
      toast.success("Transaction added");
    } else {
      toast.error("Date, amount, and category is required");
      setLoading(false);
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
          <Popover open={openCalendar} onOpenChange={setOpenCalendar}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                id="date"
                className="w-48 justify-between font-normal"
              >
                {date ? formatDate(date) : "Select date"}
                <ChevronDownIcon />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-auto overflow-hidden p-0"
              align="start"
            >
              <Calendar
                mode="single"
                selected={date}
                captionLayout="dropdown"
                onSelect={(date) => {
                  setDate(date);
                  setOpenCalendar(false);
                }}
              />
            </PopoverContent>
          </Popover>
          <Label>Amount</Label>
          <Input
            type="number"
            name="amount"
            defaultValue={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <Label>Description</Label>
          <Textarea
            name="description"
            defaultValue={description}
            placeholder="Enter description"
            onChange={(e) => setDescription(e.target.value)}
          />
          <Label>Category</Label>
          <Select name="category" onValueChange={(e) => setCategory(e)}>
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
