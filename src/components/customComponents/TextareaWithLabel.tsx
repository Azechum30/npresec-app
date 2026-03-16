"use client";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { InputHTMLAttributes } from "react";
import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";

type TextAreaWithLabelProps = {
  name: string;
  fieldTitle: string;
  className?: string;
} & InputHTMLAttributes<HTMLTextAreaElement>;

export default function TextAreaWithLabel({
  name,
  fieldTitle,
  className,
  ...props
}: TextAreaWithLabelProps) {
  const form = useFormContext();
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel htmlFor={name} className="text-sm font-bold">
            {fieldTitle}
          </FormLabel>
          <FormControl>
            <Textarea
              id={name}
              rows={5}
              className={cn("w-full max-w-md", className)}
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
