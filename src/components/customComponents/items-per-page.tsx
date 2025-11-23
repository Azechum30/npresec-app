"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormControl, Form, FormField, FormItem, FormLabel } from "../ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

import { useTransition } from "react";
import { updateItemsPerPage } from "@/app/(private)/profile/_actions/update-items-per-page";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const itemsPerPageOptions = [10, 25, 50, 100] as const;

export const ItemsPerPageSchema = z.object({
  itemsPerPage: z
    .union([z.literal(10), z.literal(25), z.literal(50), z.literal(100)])
    .default(10),
});

export const ItemsPerPage = ({
  defaultValue,
}: {
  defaultValue?: z.infer<typeof ItemsPerPageSchema>;
}) => {
  const form = useForm<z.infer<typeof ItemsPerPageSchema>>({
    mode: "onBlur",
    defaultValues: {
      itemsPerPage: defaultValue?.itemsPerPage || 10,
    },
    resolver: zodResolver(ItemsPerPageSchema),
  });

  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleOnValueChange = (value: (typeof itemsPerPageOptions)[number]) => {
    form.setValue(
      "itemsPerPage",
      value as (typeof itemsPerPageOptions)[number]
    );

    startTransition(async () => {
      const { error, success } = await updateItemsPerPage(value);

      if (error) {
        toast.error(error);
        return;
      }

      if (success) {
        router.refresh();
      }
    });
    console.log(value);
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
                    Number(value) as (typeof itemsPerPageOptions)[number]
                  );
                }}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select the number of rows per page" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {itemsPerPageOptions.map((option) => (
                    <SelectItem
                      key={option}
                      value={option.toString()}>{`${option} rows`}</SelectItem>
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
