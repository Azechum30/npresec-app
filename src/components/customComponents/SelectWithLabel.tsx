"use client";

import { Check, ChevronsUpDown } from "lucide-react";
import * as React from "react";
import { useFormContext } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
  disabled?: boolean;
};

export default function SelectWithLabel({
  name,
  fieldTitle,
  className,
  placeholder = "Select item...",
  schema,
  data,
  valueKey = "value" as any,
  selectedKey = "label" as any,
  disabled,
}: SelectWithLabelProps) {
  const form = useFormContext();
  const [open, setOpen] = React.useState(false);

  const isRequired = React.useMemo(() => {
    if (schema) {
      const fieldSchema =
        schema instanceof z.ZodObject ? schema.shape[name] : schema;
      return isZodFieldRequired(fieldSchema);
    }
    return false;
  }, [schema, name]);

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel
            className={cn(
              "text-sm font-semibold",
              isRequired && "flex items-center gap-1",
            )}>
            {fieldTitle}
            {isRequired && <span className="text-red-500">*</span>}
          </FormLabel>

          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  disabled={disabled}
                  role="combobox"
                  className={cn(
                    "w-full justify-between font-normal hover:cursor-pointer",
                    !field.value && "text-muted-foreground",
                    className,
                  )}>
                  {field.value
                    ? data.find((item) => {
                        const val =
                          typeof item === "object"
                            ? String(item[valueKey])
                            : String(item);
                        return val === String(field.value);
                      })?.[selectedKey as keyof any] || field.value
                    : placeholder}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
              <Command>
                <CommandInput
                  placeholder={`Search ${fieldTitle.toLowerCase()}...`}
                />
                <CommandList>
                  <CommandEmpty>No results found.</CommandEmpty>
                  <CommandGroup>
                    {data.map((item, index) => {
                      const isObj = typeof item === "object" && item !== null;
                      const value = isObj
                        ? String(item[valueKey])
                        : String(item);
                      const label = isObj
                        ? String(item[selectedKey])
                        : String(item);

                      // Formatting for strings (removing underscores/dashes)
                      const displayLabel = !isObj
                        ? label.replace(/[_-]/g, " ")
                        : label;

                      return (
                        <CommandItem
                          className="hover:bg-secondary hover:cursor-pointer"
                          key={value}
                          value={label} // Search matches against label
                          onSelect={() => {
                            field.onChange(
                              typeof item === "number" ? Number(value) : value,
                            );
                            setOpen(false);
                          }}>
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              String(field.value) === value
                                ? "opacity-100"
                                : "opacity-0",
                            )}
                          />
                          {displayLabel}
                        </CommandItem>
                      );
                    })}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
