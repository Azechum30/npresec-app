"use client";

import { InputHTMLAttributes, ReactNode, useState } from "react";
import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";
import { z } from "zod";
import { isZodFieldRequired } from "@/lib/isZodFieldRequired";

type ModernInputWithLabelProps = {
  name: string;
  fieldTitle: string;
  className?: string;
  containerClassName?: string;
  labelClassName?: string;
  schema?: z.ZodSchema<any>;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  showFocusRing?: boolean;
  variant?: "default" | "glassmorphism" | "outlined";
} & InputHTMLAttributes<HTMLInputElement>;

export default function ModernInputWithLabel({
  name,
  fieldTitle,
  className,
  containerClassName,
  labelClassName,
  schema,
  leftIcon,
  rightIcon,
  showFocusRing = true,
  variant = "glassmorphism",
  onFocus,
  onBlur,
  ...restProps
}: ModernInputWithLabelProps) {
  const form = useFormContext();
  const [isFocused, setIsFocused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const isRequired = (() => {
    if (schema) {
      const fieldSchema =
        schema instanceof z.ZodObject ? schema.shape[name] : schema;
      return isZodFieldRequired(fieldSchema);
    }
    return false;
  })();

  const hasError = form.formState.errors[name];

  const getVariantStyles = () => {
    switch (variant) {
      case "glassmorphism":
        return "bg-background/60 backdrop-blur-sm border-border/50 hover:bg-background/80 focus:bg-background/90 focus:border-primary/50 transition-all duration-300";
      case "outlined":
        return "bg-transparent border-2 border-border hover:border-primary/30 focus:border-primary transition-all duration-300";
      default:
        return "bg-background border-border hover:border-primary/30 focus:border-primary transition-all duration-300";
    }
  };

  const getLabelVariantStyles = () => {
    if (hasError) return "text-destructive";
    if (isFocused) return "text-primary";
    return "text-foreground";
  };

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn("space-y-2", containerClassName)}>
          <FormLabel
            htmlFor={name}
            className={cn(
              "text-sm font-medium transition-colors duration-200",
              getLabelVariantStyles(),
              isRequired && "flex items-center gap-1",
              labelClassName,
            )}
          >
            {fieldTitle}
            {isRequired && (
              <span className="text-destructive text-base leading-none">*</span>
            )}
          </FormLabel>

          <FormControl>
            <div className="relative group">
              {/* Focus ring */}
              {showFocusRing && isFocused && (
                <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-secondary rounded-lg blur opacity-20 transition-opacity duration-300" />
              )}

              {/* Left icon */}
              {leftIcon && (
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10 pointer-events-none">
                  <div
                    className={cn(
                      "transition-colors duration-200",
                      isFocused ? "text-primary" : "text-muted-foreground",
                    )}
                  >
                    {leftIcon}
                  </div>
                </div>
              )}

              <Input
                id={name}
                className={cn(
                  "relative w-full h-12 px-4 rounded-lg shadow-sm",
                  "placeholder:text-muted-foreground/60",
                  "focus:outline-none focus:ring-0 focus:ring-offset-0",
                  getVariantStyles(),
                  leftIcon && "pl-11",
                  rightIcon && "pr-11",
                  hasError && "border-destructive focus:border-destructive",
                  isFocused && "transform translate-y-[-1px] shadow-lg",
                  isHovered && !isFocused && "shadow-md",
                  className,
                )}
                {...restProps}
                value={field.value}
                name={field.name}
                onChange={field.onChange}
                onFocus={(e) => {
                  setIsFocused(true);
                  if (onFocus) onFocus(e);
                }}
                onBlur={(e) => {
                  setIsFocused(false);
                  field.onBlur();
                  if (onBlur) onBlur(e);
                }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              />

              {/* Right icon */}
              {rightIcon && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 z-10">
                  <div
                    className={cn(
                      "transition-colors duration-200",
                      isFocused ? "text-primary" : "text-muted-foreground",
                    )}
                  >
                    {rightIcon}
                  </div>
                </div>
              )}

              {/* Hover overlay */}
              {isHovered && !isFocused && (
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg pointer-events-none transition-opacity duration-200" />
              )}

              {/* Focus overlay */}
              {isFocused && (
                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg pointer-events-none transition-opacity duration-200" />
              )}
            </div>
          </FormControl>

          <FormMessage className="text-xs" />
        </FormItem>
      )}
    />
  );
}
