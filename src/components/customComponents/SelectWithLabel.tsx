import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useFormContext } from "react-hook-form";
import {
  FormField,
  FormMessage,
  FormItem,
  FormLabel,
  FormControl,
} from "../ui/form";
import React, { InputHTMLAttributes } from "react";
import { z } from "zod";
import { isZodFieldRequired } from "@/lib/isZodFieldRequired";
import { cn } from "@/lib/utils";

type SelectWithLabelProps<U = any> = {
  name: string;
  fieldTitle: string;
  className?: string;
  placeholder?: string;
  schema?: z.ZodSchema<any>;
  data: U[];
  valueKey?: keyof U;
  selectedKey?: keyof U;
} & React.ComponentPropsWithRef<typeof Select>;

export default function SelectWithLabel({
  name,
  fieldTitle,
  className,
  placeholder,
  schema,
  data,
  valueKey = "value",
  selectedKey = "label",
  ...props
}: SelectWithLabelProps) {
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
              "text-sm font-semibold disabled:text-muted-foreground",
              isRequired && "flex items-center gap-1",
              className
            )}>
            {fieldTitle}
            {isRequired && <span className="text-red-500">*</span>}
          </FormLabel>
          <FormControl>
            <Select
              value={
                field.value !== undefined && field.value !== null
                  ? typeof field.value === "number"
                    ? String(field.value)
                    : String(field.value)
                  : undefined
              }
              onValueChange={(value) => {
                field.onChange(
                  typeof data[0] === "number" && !isNaN(Number(value))
                    ? Number(value)
                    : value
                );
              }}>
              <SelectTrigger
                aria-invalid={form.formState.errors[0] ? true : false}
                className={cn(
                  "text-muted-foreground hover:cursor-pointer w-full max-w-2xl",
                  field.value && "text-foreground",
                  className
                )}
                {...props}>
                <SelectValue
                  placeholder={placeholder}
                  className="line-clamp-1"
                />
              </SelectTrigger>
              <SelectContent>
                {data.map((val, index) => {
                  if (typeof val === "string" || typeof val === "number") {
                    return (
                      <SelectItem key={index} value={String(val)}>
                        {val.toString().includes("_")
                          ? val.toString().split("_").join(" ")
                          : val.toString().includes("-")
                            ? val.toString().split("-").join(" ")
                            : val}
                      </SelectItem>
                    );
                  }

                  if (typeof val === "object" && typeof val !== null) {
                    const value = String(val[valueKey] as keyof typeof val);
                    const label = String(val[selectedKey] as keyof typeof val);
                    return (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    );
                  }

                  return null;
                })}
              </SelectContent>
            </Select>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
