import {
  useFormContext,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";
import { Checkbox } from "../ui/checkbox";

type CheckboxWithLabelProps<T extends FieldValues> = {
  className?: string;
  label: string;
  name: FieldPath<T>;
} & React.ComponentProps<typeof Checkbox>;

export const CheckboxWithLabel = <T extends FieldValues>({
  className,
  label,
  name,
  ...props
}: CheckboxWithLabelProps<T>) => {
  const form = useFormContext<T>();

  return (
    <div>
      <FormField
        control={form.control}
        name={name}
        render={({ field }) => (
          <FormItem className="flex items-center space-x-1">
            <FormControl>
              <Checkbox
                id={name}
                className={cn(
                  "hover:cursor-pointer disabled:cursor-not-allowed",
                  className
                )}
                checked={field.value as boolean}
                onCheckedChange={field.onChange}
                aria-invalid={!!form.formState.errors[name]}
                {...props}
              />
            </FormControl>
            <FormLabel
              htmlFor={name}
              className="font-normal text-sm hover:cursor-pointer">
              {label}
            </FormLabel>
          </FormItem>
        )}
      />
    </div>
  );
};
