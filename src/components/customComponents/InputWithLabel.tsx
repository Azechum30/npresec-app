"use client";

import { InputHTMLAttributes } from "react";
import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";
import { z } from "zod";
import { isZodFieldRequired } from "@/lib/isZodFieldRequired";

type InputWithLabelProps<T> = {
  name: keyof T & string;
  fieldTitle: string;
  className?: string;
  schema?: z.ZodSchema<T>;
} & InputHTMLAttributes<HTMLInputElement>;

export default function InputWithLabel<T>({
  name,
  fieldTitle,
  className,
  schema,
  ...props
}: InputWithLabelProps<any>) {
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
            htmlFor={name}
            className={cn(
              "text-sm font-semibold",
              isRequired && "flex items-center gap-1",
                className
            )}>
            {fieldTitle}
            {isRequired && <span className="text-red-500">*</span>}
          </FormLabel>
          <FormControl>
            <Input
              id={name}
              className={cn(
                "w-full max-w-xl disabled:text-gray-600 dark:disabled:text-blue-400",
                className
              )}
              {...field}
              {...props}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
