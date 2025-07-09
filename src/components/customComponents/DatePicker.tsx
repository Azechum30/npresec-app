"use client";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { Dispatch, SetStateAction, useMemo } from "react";
import {
  format,
  getYear,
  getMonth,
  getDate,
  isValid,
  setMonth,
  setYear,
  isSameDay,
  isToday,
    isAfter,
    isBefore,
} from "date-fns";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

type DatePickerProps = {
  id: string;
  date: Date | undefined;
  placeholder?: string;
  className?: string;
  setDate: Dispatch<SetStateAction<Date | undefined>>;
  restrictToCurrentDay?: boolean; // New prop for day restriction
  startYear?: number;
  endYear?: number;
  fromMonth?: number;
  disable?: boolean;
};

export default function DatePicker({
                                     date,
                                     setDate,
                                     id,
                                     placeholder,
                                     className,
                                     restrictToCurrentDay = false,
                                     startYear = getYear(new Date()) - 100,
                                     endYear = getYear(new Date()),
                                     fromMonth,
    disable = false,
                                   }: DatePickerProps) {
  const currentDate = new Date();
  const currentYear = getYear(currentDate);
  const currentMonth = getMonth(currentDate);
  const currentDay = getDate(currentDate);

  const years = useMemo(() => {
    if (restrictToCurrentDay) return [currentYear];
    return Array.from({ length: endYear - startYear + 1 }, (_, i) => startYear + i);
  }, [startYear, endYear, restrictToCurrentDay, currentYear]);

  const months = useMemo(() => {
    if (restrictToCurrentDay) {
      return [{
        label: currentDate.toLocaleString("default", { month: "long" }),
        value: String(currentMonth),
      }];
    }
    return Array.from({ length: fromMonth ? fromMonth : 12 }, (_, i) => ({
      label: new Date(0, fromMonth ? i+fromMonth : i).toLocaleString("default", { month: "long" }),
      value: fromMonth ? String(i+fromMonth) : String(i),
    }));
  }, [fromMonth, restrictToCurrentDay, currentMonth]);

  const days = useMemo(() => {
    if (restrictToCurrentDay) {
      return [{
        label: String(currentDay),
        value: String(currentDay),
      }];
    }
    // For non-restricted mode, we don't need days dropdown
    return [];
  }, [restrictToCurrentDay, currentDay]);

  const handleMonthChange = (month: number) => {
    if (restrictToCurrentDay) return;
    setDate((prev) => {
      const newDate = prev ? new Date(prev) : new Date();
      const updatedDate = setMonth(newDate, month);
      return isValid(updatedDate) ? updatedDate : new Date();
    });
  };

  const handleYearChange = (year: number) => {
    if (restrictToCurrentDay) return;
    setDate((prevDate) => {
      const newDate = prevDate ? new Date(prevDate) : new Date();
      const updatedDate = setYear(newDate, year);
      return isValid(updatedDate) ? updatedDate : new Date();
    });
  };

  return (
      <Popover>
        <PopoverTrigger asChild>
          <Button
              id={id}
              variant="outline"
              className={cn(
                  "w-full max-w-3xl justify-start text-left",
                  !date && "text-muted-foreground",
                  className
              )}
              disabled={disable}
          >
            <CalendarIcon className="size-5" />
            {date && isValid(date) ? (
                format(date, "PPP")
            ) : (
                <span>{placeholder ? placeholder : "Select a Date"}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent align="center" className="flex flex-col space-y-2 p-2">
          <div className="flex justify-between items-center py-2 space-x-2">
            <Select
                value={restrictToCurrentDay ? String(currentMonth) : date ? String(getMonth(date)) : ""}
                onValueChange={(value) => handleMonthChange(parseInt(value, 10))}
                disabled={restrictToCurrentDay}
            >
              <SelectTrigger>
                <SelectValue placeholder="Month" />
              </SelectTrigger>
              <SelectContent position="popper" align="center">
                <SelectGroup>
                  {months.map((month) => (
                      <SelectItem key={month.value} value={month.value}>
                        {month.label}
                      </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <Select
                value={restrictToCurrentDay ? String(currentYear) : date ? String(getYear(date)) : ""}
                onValueChange={(value) => handleYearChange(parseInt(value, 10))}
                disabled={restrictToCurrentDay}
            >
              <SelectTrigger>
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent position="popper" align="center">
                <SelectGroup>
                  {years.map((year) => (
                      <SelectItem key={year} value={String(year)}>
                        {year}
                      </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="rounded-md border mx-auto w-full flex justify-center items-center max-w-23xl">
            <Calendar
                mode="single"
                selected={date}
                onSelect={(selectedDate) => {
                  if (restrictToCurrentDay && selectedDate && !isToday(selectedDate)) {
                    return; // Prevent selection if not today
                  }
                  setDate(selectedDate);
                }}
                month={restrictToCurrentDay ? currentDate : date}
                disabled={(date) => {
                  if (restrictToCurrentDay) {
                    // Only allow today's date
                    return !isToday(date);
                  }
                  // Default behavior for other cases
                  return isAfter(date, currentDate) || isBefore(date, new Date("1900-01-01"));
                }}
                components={{
                  // Hide next/prev month navigation when restricted
                  IconLeft: ({ ...props }) => restrictToCurrentDay ? null : <CalendarIcon {...props} />,
                  IconRight: ({ ...props }) => restrictToCurrentDay ? null : <CalendarIcon {...props} />,
                }}
            />
          </div>
        </PopoverContent>
      </Popover>
  );
}