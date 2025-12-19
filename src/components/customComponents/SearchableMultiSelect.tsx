import React, { useState, useMemo } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, X, Plus } from "lucide-react";
import { z } from "zod";
import { isZodFieldRequired } from "@/lib/isZodFieldRequired";
import { cn } from "@/lib/utils";

type SearchableMultiSelectProps<U = any> = {
  name: string;
  fieldTitle: string;
  className?: string;
  placeholder?: string;
  schema?: z.ZodSchema<any>;
  data: U[];
  valueKey?: string;
  labelKey?: string;
  maxHeight?: string;
};

export default function SearchableMultiSelect<U = any>({
  name,
  fieldTitle,
  className,
  placeholder = "Search and select...",
  schema,
  data,
  valueKey = "id",
  labelKey = "name",
  maxHeight = "200px",
}: SearchableMultiSelectProps<U>) {
  const form = useFormContext();
  const [searchTerm, setSearchTerm] = useState("");

  const isRequired = (() => {
    if (schema) {
      const fieldSchema =
        schema instanceof z.ZodObject ? schema.shape[name] : schema;
      return isZodFieldRequired(fieldSchema);
    }
    return false;
  })();

  // Get selected values from form data
  const selectedValues = form.watch(name) || [];

  // Filter available options
  const filteredData = useMemo(() => {
    if (!searchTerm) return data;

    return data.filter((item: U) => {
      if (typeof item === "string" || typeof item === "number") {
        return String(item).toLowerCase().includes(searchTerm.toLowerCase());
      }

      if (typeof item === "object" && item !== null) {
        const label = String((item as any)[labelKey]);
        return label.toLowerCase().includes(searchTerm.toLowerCase());
      }

      return false;
    });
  }, [data, searchTerm, labelKey]);

  // Filter out already selected items
  const availableData = filteredData.filter((item: U) => {
    const itemValue =
      typeof item === "object" && item !== null
        ? String((item as any)[valueKey])
        : String(item);

    return !selectedValues.includes(itemValue);
  });

  const handleAddItem = (item: U, field: any) => {
    const itemValue =
      typeof item === "object" && item !== null
        ? String((item as any)[valueKey])
        : String(item);

    if (!selectedValues.includes(itemValue)) {
      const newValues = [...selectedValues, itemValue];
      field.onChange(newValues);
      setSearchTerm("");
    }
  };

  const handleRemoveItem = (valueToRemove: string, field: any) => {
    const updatedValues = selectedValues.filter(
      (value: string) => value !== valueToRemove
    );
    field.onChange(updatedValues);
  };

  const getItemLabel = (item: U) => {
    if (typeof item === "string" || typeof item === "number") {
      return String(item);
    }

    if (typeof item === "object" && item !== null) {
      return String((item as any)[labelKey]);
    }

    return "";
  };

  const getSelectedItemLabel = (value: string) => {
    const item = data.find((d: U) => {
      if (typeof d === "object" && d !== null) {
        return String((d as any)[valueKey]) === value;
      }
      return String(d) === value;
    });

    return item ? getItemLabel(item) : value;
  };

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel
            className={cn(
              "text-sm font-semibold",
              isRequired && "flex items-center gap-1"
            )}>
            {fieldTitle}
            {isRequired && <span className="text-red-500">*</span>}
          </FormLabel>

          {/* Selected items */}
          {selectedValues.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2">
              {selectedValues.map((value: string, index: number) => (
                <Badge key={value} variant="secondary" className="text-xs">
                  {getSelectedItemLabel(value)}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 ml-1 hover:bg-transparent"
                    onClick={() => handleRemoveItem(value, field)}>
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          )}

          {/* Search input */}
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={placeholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>

          {/* Available options */}
          {searchTerm && (
            <ScrollArea
              className={`border rounded-md mt-1`}
              style={{ maxHeight }}>
              <div className="p-1">
                {availableData.length === 0 ? (
                  <div className="text-sm text-muted-foreground p-2 text-center">
                    No options found
                  </div>
                ) : (
                  availableData.map((item: U, index: number) => (
                    <Button
                      key={index}
                      type="button"
                      variant="ghost"
                      className="w-full justify-start h-8 px-2 text-left"
                      onClick={() => handleAddItem(item, field)}>
                      <Plus className="h-3 w-3 mr-2" />
                      {getItemLabel(item)}
                    </Button>
                  ))
                )}
              </div>
            </ScrollArea>
          )}

          <FormMessage />
        </FormItem>
      )}
    />
  );
}
