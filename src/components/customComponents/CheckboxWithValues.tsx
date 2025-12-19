import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import React from "react";
import { useFormContext } from "react-hook-form";
import { z } from "zod";
import { Checkbox } from "../ui/checkbox";
import { isZodFieldRequired } from "@/lib/isZodFieldRequired";
import { cn } from "@/lib/utils";
import { Label } from "../ui/label";

type CheckboxProps<U = any> = {
  name: string;
  fieldTitle: string;
  data: U[];
  className?: string;
  valueKey?: keyof U;
  labelKey?: keyof U;
  schema?: z.ZodSchema<any>;
} & React.ComponentPropsWithRef<typeof Checkbox>;

const CheckboxWithArrayValues = ({
  name,
  fieldTitle,
  data,
  className,
  valueKey = "value",
  labelKey = "label",
  schema,
  ...props
}: CheckboxProps) => {
  const form = useFormContext();

  const isRequired = (function () {
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
              "text-sm font-semibold",
              isRequired && "flex items-center gap-1"
            )}>
            {fieldTitle}

            {isRequired && <span className="text-red-500">*</span>}
          </FormLabel>

          <div className={className}>
            {data &&
              data.map((item, index) => {
                if (typeof item === "string" || typeof item === "number") {
                  return (
                    <FormControl key={index}>
                      <div key={index} className="flex items-center gap-2">
                        <Checkbox
                          id={`${name}-${index}`}
                          value={String(item)}
                          checked={field.value?.includes(item)}
                          onCheckedChange={(checked) => {
                            const currentValue = field.value || [];
                            const newValue = checked
                              ? [...currentValue, item]
                              : currentValue.filter(
                                  (val: string | number) => val !== item
                                );
                            return field.onChange(newValue);
                          }}
                          {...props}
                        />
                        <Label
                          htmlFor={String(index)}
                          className="hover:cursor-pointer">
                          {item}
                        </Label>
                      </div>
                    </FormControl>
                  );
                }

                if (typeof item === "object" && typeof item !== null) {
                  const value = String(item[valueKey] as keyof typeof item);
                  const label = String(item[labelKey] as keyof typeof item);

                  return (
                    <FormControl key={value}>
                      <div key={value} className="flex items-center gap-2">
                        <Checkbox
                          id={value}
                          value={value}
                          checked={
                            Array.isArray(field.value) &&
                            field.value?.includes(value)
                          }
                          onCheckedChange={(checked) => {
                            const currentValue = field.value || [];
                            const newValue = checked
                              ? [...currentValue, value]
                              : currentValue.filter(
                                  (val: string) => val !== value
                                );
                            return field.onChange(newValue);
                          }}
                          {...props}
                        />
                        <Label htmlFor={value} className="hover:cursor-pointer">
                          {label}
                        </Label>
                      </div>
                    </FormControl>
                  );
                }

                return null;
              })}
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default CheckboxWithArrayValues;
