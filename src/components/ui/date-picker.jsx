"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

function DatePicker({
  value,
  onChange,
  placeholder = "Pick a date",
  className,
  ...props
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal bg-slate-800 border-white/20 text-slate-200 hover:bg-slate-700 hover:border-white/30 focus:border-emerald-500 focus:bg-slate-700 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-200",
            !value && "text-slate-500",
            className,
          )}
          {...props}
        >
          <CalendarIcon className="mr-2 h-4 w-4 text-slate-400" />
          {value ? format(value, "PPP") : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 bg-slate-900 border border-white/20 shadow-2xl">
        <Calendar
          mode="single"
          selected={value}
          onSelect={onChange}
          initialFocus
          className="bg-slate-900 text-slate-200 rounded-lg"
          classNames={{
            months:
              "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
            month: "flex flex-col space-y-4",
            caption: "flex justify-center pt-1 relative items-center",
            caption_label: "text-sm font-medium text-slate-200",
            nav: "space-x-1 flex items-center",
            nav_button: cn(
              "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 text-slate-200 hover:bg-slate-800 rounded-md transition-colors",
            ),
            nav_button_previous: "absolute left-1",
            nav_button_next: "absolute right-1",
            table: "w-full border-collapse space-y-1",
            head_row: "flex",
            head_cell:
              "text-slate-400 rounded-md w-9 font-normal text-[0.8rem]",
            row: "flex w-full mt-2",
            cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-slate-800 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
            day: cn(
              "h-9 w-9 p-0 font-normal aria-selected:opacity-100 hover:bg-slate-700 rounded-md transition-colors",
            ),
            day_range_end: "day-range-end",
            day_selected:
              "bg-emerald-600 text-white hover:bg-emerald-700 focus:bg-emerald-600 focus:text-white",
            day_today: "bg-slate-800 text-slate-200 font-semibold",
            day_outside:
              "text-slate-600 opacity-50 aria-selected:bg-slate-800 aria-selected:text-slate-600",
            day_disabled: "text-slate-600 opacity-50",
            day_range_middle:
              "aria-selected:bg-slate-800 aria-selected:text-slate-200",
            day_hidden: "invisible",
          }}
        />
      </PopoverContent>
    </Popover>
  );
}

export { DatePicker };
