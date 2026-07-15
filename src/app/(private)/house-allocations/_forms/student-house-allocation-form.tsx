/** biome-ignore-all assist/source/organizeImports: reason */
"use client";

import InputWithLabel from "@/components/customComponents/InputWithLabel";
import { Form } from "@/components/ui/form";
import {
  studentHouseAllocationSchema,
  type StudentHouseAllocationType,
} from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSuspenseQuery } from "@tanstack/react-query";
import type { FC } from "react";
import { useForm } from "react-hook-form";

type StudentHouseAllocationFormProps = {
  onSubmitAction: (data: StudentHouseAllocationType) => Promise<void>;
  id?: string;
  defaultValues?: StudentHouseAllocationType;
};

export const StudentHouseAllocationForm: FC<
  StudentHouseAllocationFormProps
> = ({ onSubmitAction, defaultValues, id }) => {
  const form = useForm<StudentHouseAllocationType>({
    resolver: zodResolver(studentHouseAllocationSchema),
    mode: "onSubmit",
    defaultValues: defaultValues ?? {
      houseId: "",
      roomId: "",
      status: "Day",
      studentNumber: "",
    },
  });

  const {} = useSuspenseQuery();

  async function handleSubmit(data: StudentHouseAllocationType) {
    await onSubmitAction(data);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-4 border rounded-md p-4">
        <InputWithLabel
          fieldTitle="Student ID"
          name="studentNumber"
          schema={studentHouseAllocationSchema}
        />
      </form>
    </Form>
  );
};
