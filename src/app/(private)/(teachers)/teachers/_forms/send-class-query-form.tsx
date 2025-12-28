"use client";
import { Form, FormField, FormItem, FormControl } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useFetchClassess } from "../_hooks/use-fetch-classess";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Route } from "next";

const formSchema = z.object({
  classId: z.string().min(1, "Class is required"),
});

export const SendClassQueryForm = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { classId: "" },
  });

  const { classes } = useFetchClassess();
  const searchParam = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const handleSubmit = (value: string) => {
    const params = new URLSearchParams(searchParam);
    params.set("classId", value);
    router.push(`${pathname}?${params.toString()}` as Route);
  };

  return (
    <Form {...form}>
      <form className="w-full md:max-w-xs">
        <FormField
          control={form.control}
          name="classId"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Select
                  value={field.value}
                  onValueChange={(value) => {
                    handleSubmit(value);
                    field.onChange(value);
                  }}
                >
                  <SelectTrigger className="w-full max-w-xs hover:cursor-pointer">
                    <SelectValue placeholder="--Select class--" />
                  </SelectTrigger>
                  <SelectContent align="center" position="popper">
                    {classes?.map((cl) => (
                      <SelectItem key={cl.id} value={cl.id}>
                        {cl.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};
