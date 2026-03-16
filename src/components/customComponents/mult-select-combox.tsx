import { isZodFieldRequired } from "@/lib/isZodFieldRequired";
import { cn } from "@/lib/utils";
import { useFormContext } from "react-hook-form";
import { z } from "zod";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

type Props<T = any> = {
  name: string;
  fieldTitle: string;
  data: T[];
  className?: string;
  placeholder?: string;
  schema?: z.ZodSchema<any>;
  valueKey?: keyof T;
  selectedKey?: keyof T;
};

export const MultiSelectCombox = ({
  name,
  fieldTitle,
  data,
  className,
  placeholder,
  schema,
  selectedKey = "label",
  valueKey = "value",
}: Props) => {
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
      name={name}
      control={form.control}
      render={({ field }) => (
        <FormItem>
          <FormLabel htmlFor={field.name} className="text-sm font-bold">
            {fieldTitle}
            {isRequired && <span className="text-red-500">*</span>}
          </FormLabel>
          <FormControl>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant="outline"
                    role="combobox"
                    className={cn(
                      "w-full justify-between",
                      !field.value?.length && "text-muted-foreground",
                    )}>
                    {field.value?.length > 0
                      ? `${field.value.length} courses selected`
                      : `${placeholder}`}
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className={cn("w-[400px] p-0", className)}>
                <Command>
                  <CommandInput placeholder="Search..." />
                  <CommandList>
                    <CommandEmpty>No course found.</CommandEmpty>
                    <CommandGroup>
                      {data?.map((item, index) => {
                        if (
                          typeof item === "string" ||
                          typeof item === "number"
                        ) {
                          return (
                            <CommandItem
                              key={index}
                              onSelect={() => {
                                const currentValues = field.value || [];
                                const newValue = currentValues.includes(item)
                                  ? currentValues.filter(
                                      (val: any) => val !== item,
                                    )
                                  : [...currentValues, item];
                                field.onChange(newValue);
                              }}>
                              <Checkbox
                                checked={field.value?.includes(item)}
                                className="mr-2"
                              />
                              {item}
                            </CommandItem>
                          );
                        }

                        if (typeof item === "object" && typeof item !== null) {
                          const value = String(
                            item[valueKey] as keyof typeof item,
                          );
                          const label = String(
                            item[selectedKey] as keyof typeof item,
                          );

                          return (
                            <CommandItem
                              key={value}
                              onSelect={() => {
                                const currentValues = field.value || [];
                                const newValue = currentValues.includes(value)
                                  ? currentValues.filter(
                                      (v: any) => v !== value,
                                    )
                                  : [...currentValues, value];
                                field.onChange(newValue);
                              }}>
                              <Checkbox
                                checked={field.value?.includes(value)}
                                className="mr-2"
                              />
                              {label}
                            </CommandItem>
                          );
                        }
                      })}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
