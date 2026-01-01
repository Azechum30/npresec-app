"use client";

import React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormControl, Form, FormField, FormItem } from "../ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useItemsPerPageSync } from "@/hooks/use-items-per-page-sync";

const itemsPerPageOptions = [10, 25, 50, 100] as const;

export const ItemsPerPageSchema = z.object({
  itemsPerPage: z.union([
    z.literal(10),
    z.literal(25),
    z.literal(50),
    z.literal(100),
  ]),
});

export const ItemsPerPage = ({
  defaultValue,
  onPageSizeChangeAction,
}: {
  defaultValue?: z.infer<typeof ItemsPerPageSchema>;
  onPageSizeChangeAction?: (newPageSize: number) => void;
}) => {
  const initialPageSize = defaultValue?.itemsPerPage || 10;

  // Use the custom hook for better state synchronization
  const { currentPageSize, updatePageSize, isPending } = useItemsPerPageSync({
    initialPageSize,
    onPageSizeChangeAction,
  });

  const form = useForm<z.infer<typeof ItemsPerPageSchema>>({
    mode: "onBlur",
    defaultValues: {
      itemsPerPage: currentPageSize as 10 | 25 | 50 | 100,
    },
    resolver: zodResolver(ItemsPerPageSchema),
  });

  // Update form value when currentPageSize changes
  React.useEffect(() => {
    form.setValue("itemsPerPage", currentPageSize as 10 | 25 | 50 | 100);
  }, [currentPageSize, form]);

  const handleOnValueChange = (value: (typeof itemsPerPageOptions)[number]) => {
    // Update form immediately
    form.setValue("itemsPerPage", value);

    // Use the custom hook's update function for proper synchronization
    updatePageSize(value as number);
  };

  return (
    <Form {...form}>
      <form>
        <FormField
          control={form.control}
          name="itemsPerPage"
          render={({ field }) => (
            <FormItem>
              <Select
                value={field.value.toString()}
                onValueChange={(value) => {
                  handleOnValueChange(
                    Number(value) as (typeof itemsPerPageOptions)[number],
                  );
                }}
                disabled={isPending}
              >
                <FormControl>
                  <SelectTrigger className={isPending ? "opacity-50" : ""}>
                    <SelectValue placeholder="Select the number of rows per page" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {itemsPerPageOptions.map((option) => (
                    <SelectItem key={option} value={option.toString()}>
                      {`${option} rows`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};
