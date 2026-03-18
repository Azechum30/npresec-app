import { isZodFieldRequired } from "@/lib/isZodFieldRequired";
import { cn } from "@/lib/utils";
import { InputHTMLAttributes } from "react";
import { useFormContext } from "react-hook-form";
import { z } from "zod";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import DatePicker from "./DatePicker";

type DatePickerWithLabelProps = {
  name: string;
  fieldTitle: string;
  startDate?: number;
  endDate?: number;
  fromMonth?: number;
  restrictToCurrentDay?: boolean;
  disable?: boolean;
  schema?: z.ZodSchema<any>;
  disableFutureDates?: boolean;
} & InputHTMLAttributes<HTMLButtonElement>;

export default function DatePickerWithLabel({
  name,
  fieldTitle,
  schema,
  startDate,
  endDate,
  fromMonth,
  restrictToCurrentDay,
  disable,
  disableFutureDates,
}: DatePickerWithLabelProps) {
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
              isRequired && "flex items-center gap-1",
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
              disableFutureDates={disableFutureDates}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
