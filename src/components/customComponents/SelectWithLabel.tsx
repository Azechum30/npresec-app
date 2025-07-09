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

type SelectWithLabelProps<T, U = any> = {
  name: keyof T & string;
  fieldTitle: string;
  className?: string;
  placeholder?: string;
  schema?: z.ZodSchema<any>;
  data: U[];
  valueKey?: keyof U;
  selectedKey?: keyof U;
} & React.ComponentPropsWithRef<typeof Select>;

export default function SelectWithLabel<T>({
  name,
  fieldTitle,
  className,
  placeholder,
  schema,
  data,
  valueKey = "value",
  selectedKey = "label",
  ...props
}: SelectWithLabelProps<T>) {
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
            <Select defaultValue={field.value} onValueChange={field.onChange}>
              <SelectTrigger className={cn("text-muted-foreground", field.value && "text-foreground")} {...props}>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
              <SelectContent>
                {data.map((val, index) => {
                  if (typeof val === "string" || typeof val === "number") {
                    return (
                      <SelectItem key={index} value={String(val)}>
                        {val}
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
