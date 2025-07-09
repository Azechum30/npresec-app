import { InputHTMLAttributes } from "react";
import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import DatePicker from "./DatePicker";
import { z } from "zod";
import { isZodFieldRequired } from "@/lib/isZodFieldRequired";
import { cn } from "@/lib/utils";

type DatePickerWithLabelProps<T> = {
  name: keyof T & string;
  fieldTitle: string;
  startDate?: number;
  endDate?: number;
  fromMonth?: number;
  restrictToCurrentDay?: boolean;
  disable?: boolean;
  schema?: z.ZodSchema<T>;
} & InputHTMLAttributes<HTMLButtonElement>;

export default function DatePickerWithLabel<T>({
  name,
  fieldTitle,
  schema,
    startDate,
    endDate,
    fromMonth, restrictToCurrentDay,
    disable
}: DatePickerWithLabelProps<T>) {
  const form = useFormContext();

  const isRequired = (() => {
    if (schema) {
      const fieldSchema =
        schema instanceof z.ZodObject ? schema.shape[name] : schema;

      return isZodFieldRequired(fieldSchema);
    }

    return false;
  })();
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel
            className={cn(
              "text-sm font-semibold block",
              isRequired && "flex items-center gap-1"
            )}
            htmlFor={name}>
            {fieldTitle}
            {isRequired && <span className="text-red-500">*</span>}
          </FormLabel>
          <FormControl>
            <DatePicker
                id={name}
                date={field.value}
                setDate={field.onChange}
                startYear={startDate}
                endYear={endDate}
                fromMonth={fromMonth}
                restrictToCurrentDay={restrictToCurrentDay}
                disable={disable}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
