import { isZodFieldRequired } from "@/lib/isZodFieldRequired";
import { cn } from "@/lib/utils";
import { Asterisk } from "lucide-react";
import React from "react";
import { useFormContext } from "react-hook-form";
import z from "zod";
import { FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

type TGenericSelectWithLabelProps<T> = {
  name: keyof T & string;
  fieldTitle?: string;
  className?: string;
  data: any[];
  valueKey?: string;
  selectedKey?: string;
  schema?: z.ZodSchema<any>;
};

export const GenericSelectWithLabel = <T,>({
  name,
  fieldTitle,
  className,
  data,
  selectedKey,
  valueKey,
  schema,
}: TGenericSelectWithLabelProps<T>) => {
  const form = useFormContext();

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
      name={name}
      control={form.control}
      render={({ field }) => (
        <FormItem>
          {fieldTitle && (
            <FormLabel htmlFor={name} className="text-sm font-bold">
              {fieldTitle}
              {isRequired && <Asterisk className="size-3 text-destructive" />}
            </FormLabel>
          )}
          <FormControl>
            <Select value={String(field.value)} onValueChange={field.onChange}>
              <SelectTrigger className={cn("w-full max-w-xl", className)}>
                <SelectValue
                  placeholder={`Select ${fieldTitle ? fieldTitle : name}`}
                />
              </SelectTrigger>
              <SelectContent
                align="center"
                position="popper"
                updatePositionStrategy="optimized">
                {data.map((item, index) => {
                  const isObj =
                    typeof item === "object" && typeof item !== null;
                  const value = isObj
                    ? String(item?.[valueKey as keyof typeof item])
                    : String(item);
                  const label = isObj
                    ? String(item?.[selectedKey as keyof typeof item])
                    : String(item);
                  const displayName = !isObj
                    ? label.replace(/[_-]/g, " ")
                    : label;

                  return (
                    <SelectItem key={index} value={value}>
                      {displayName}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </FormControl>
        </FormItem>
      )}
    />
  );
};
