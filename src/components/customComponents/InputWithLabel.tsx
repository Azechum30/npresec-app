"use client";

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
import { Input } from "../ui/input";

type InputWithLabelProps = {
  name: string;
  fieldTitle: string;
  className?: string;
  schema?: z.ZodSchema<any>;
} & InputHTMLAttributes<HTMLInputElement>;

export default function InputWithLabel({
  name,
  fieldTitle,
  className,
  schema,
  ...props
}: InputWithLabelProps) {
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
              className,
            )}>
            {fieldTitle}
            {isRequired && <span className="text-red-500">*</span>}
          </FormLabel>
          <FormControl>
            <Input
              aria-invalid={form.formState.errors.form?.message ? true : false}
              id={name}
              className={cn(
                "w-full max-w-xl disabled:hover:cursor-not-allowed ",
                className,
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
