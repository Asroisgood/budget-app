"use client";

import * as React from "react";
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
} from "date-fns";
import { id } from "date-fns/locale";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

function CustomDatePicker({
  value,
  onChange,
  placeholder = "Pilih tanggal",
  className,
  ...props
}) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [currentMonth, setCurrentMonth] = React.useState(value || new Date());
  const buttonRef = React.useRef(null);
  const popoverRef = React.useRef(null);

  // Close popover when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleDateSelect = (date) => {
    // Fix timezone issue - create date at noon to avoid timezone offset
    const fixedDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      12,
      0,
      0,
    );
    onChange(fixedDate);
    setIsOpen(false);
  };

  const handlePreviousMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const renderDays = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

    // Add empty cells for days before month starts
    const startDayOfWeek = monthStart.getDay();
    const emptyCells = Array(startDayOfWeek).fill(null);

    return [...emptyCells, ...days];
  };

  const weekDays = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

  return (
    <div className="relative">
      {/* Button Trigger */}
      <Button
        ref={buttonRef}
        variant="outline"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className={cn(
          "w-full justify-start text-left font-normal bg-slate-800 border-white/20 text-slate-200 hover:bg-slate-700 hover:border-white/30 focus:border-emerald-500 focus:bg-slate-700 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-200 h-10",
          !value && "text-slate-400",
          className,
        )}
        {...props}
      >
        <CalendarIcon className="mr-2 h-4 w-4 text-slate-400" />
        {value ? (
          format(value, "PPP", { locale: id })
        ) : (
          <span>{placeholder}</span>
        )}
      </Button>

      {/* Popover Content */}
      {isOpen && (
        <div
          ref={popoverRef}
          className="absolute z-[9999] w-72 rounded-lg border border-white/20 bg-slate-900 shadow-2xl outline-none"
          style={{
            top: buttonRef.current ? buttonRef.current.offsetHeight + 1 : 0,
            left: 0,
          }}
        >
          <div className="p-3">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handlePreviousMonth();
                }}
                className="h-8 w-8 p-0 text-slate-400 hover:text-slate-200 hover:bg-slate-800"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="text-sm font-medium text-slate-200">
                {format(currentMonth, "MMMM yyyy", { locale: id })}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleNextMonth();
                }}
                className="h-8 w-8 p-0 text-slate-400 hover:text-slate-200 hover:bg-slate-800"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            {/* Week Days */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {weekDays.map((day) => (
                <div
                  key={day}
                  className="h-8 text-xs font-medium text-slate-500 text-center"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-1">
              {renderDays().map((day, index) => {
                if (!day) {
                  return <div key={`empty-${index}`} className="h-8" />;
                }

                const isSelected = value && isSameDay(day, value);
                const isTodayDate = isToday(day);
                const isCurrentMonth = isSameMonth(day, currentMonth);

                return (
                  <Button
                    key={day.toISOString()}
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleDateSelect(day);
                    }}
                    className={cn(
                      "h-8 w-8 p-0 text-sm transition-all duration-200",
                      !isCurrentMonth && "text-slate-600 opacity-50",
                      isTodayDate &&
                        !isSelected &&
                        "bg-emerald-500/20 text-emerald-400 font-semibold border border-emerald-500/30",
                      isSelected &&
                        "bg-emerald-600 text-white hover:bg-emerald-700",
                      !isSelected &&
                        !isTodayDate &&
                        "hover:bg-slate-700 text-slate-200",
                    )}
                  >
                    {format(day, "d")}
                  </Button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CustomDatePicker;
