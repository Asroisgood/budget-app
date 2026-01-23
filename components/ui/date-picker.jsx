"use client";

import * as React from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function DatePicker({ value, onChange, placeholder, className }) {
  const [open, setOpen] = React.useState(false);

  const handleSelect = (date) => {
    onChange(date);
    setOpen(false);
  };

  const formatDate = (date) => {
    if (!date) return "";
    return format(date, "dd MMM yyyy");
  };

  const formatISODate = (date) => {
    if (!date) return "";
    return format(date, "yyyy-MM-dd");
  };

  const displayDate = value ? formatDate(value) : placeholder;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-between text-left font-normal bg-slate-800/50 border-white/20 text-slate-200 hover:bg-slate-800/70 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-sm h-9 px-3 py-2",
            !value && "text-slate-500",
            className,
          )}
        >
          {displayDate}
          <CalendarIcon className="ml-2 h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={value}
          onSelect={handleSelect}
          initialFocus
          className="rounded-lg border"
        />
      </PopoverContent>
    </Popover>
  );
}
