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
import { Eye, EyeOff } from "lucide-react";

type ModernPasswordInputWithLabelProps = {
  name: string;
  fieldTitle: string;
  className?: string;
  containerClassName?: string;
  labelClassName?: string;
  schema?: z.ZodSchema<any>;
  leftIcon?: ReactNode;
  showFocusRing?: boolean;
  variant?: "default" | "glassmorphism" | "outlined";
  showToggleButton?: boolean;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "type">;

export default function ModernPasswordInputWithLabel({
  name,
  fieldTitle,
  className,
  containerClassName,
  labelClassName,
  schema,
  leftIcon,
  showFocusRing = true,
  variant = "glassmorphism",
  showToggleButton = true,
  onFocus,
  onBlur,
  ...restProps
}: ModernPasswordInputWithLabelProps) {
  const form = useFormContext();
  const [showPassword, setShowPassword] = useState(false);
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

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
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
                type={showPassword ? "text" : "password"}
                className={cn(
                  "relative w-full h-12 px-4 rounded-lg shadow-sm",
                  "placeholder:text-muted-foreground/60",
                  "focus:outline-none focus:ring-0 focus:ring-offset-0",
                  getVariantStyles(),
                  leftIcon && "pl-11",
                  showToggleButton && "pr-11",
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

              {/* Password toggle button */}
              {showToggleButton && (
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className={cn(
                    "absolute right-3 top-1/2 transform -translate-y-1/2 z-10",
                    "p-1 rounded-md hover:bg-background/80 transition-all duration-200",
                    "focus:outline-none focus:bg-background/80",
                    isFocused && "text-primary",
                  )}
                  tabIndex={-1}
                >
                  <div className="transition-transform duration-200 hover:scale-110">
                    {showPassword ? (
                      <EyeOff className="w-4 h-4 text-muted-foreground hover:text-foreground transition-colors duration-200" />
                    ) : (
                      <Eye className="w-4 h-4 text-muted-foreground hover:text-foreground transition-colors duration-200" />
                    )}
                  </div>
                </button>
              )}

              {/* Hover overlay */}
              {isHovered && !isFocused && (
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg pointer-events-none transition-opacity duration-200" />
              )}

              {/* Focus overlay */}
              {isFocused && (
                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg pointer-events-none transition-opacity duration-200" />
              )}

              {/* Password strength indicator */}
              {isFocused && field.value && (
                <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-300"
                    style={{
                      width: `${Math.min(100, (field.value?.length || 0) * 10)}%`,
                    }}
                  />
                </div>
              )}
            </div>
          </FormControl>

          <FormMessage className="text-xs" />
        </FormItem>
      )}
    />
  );
}
