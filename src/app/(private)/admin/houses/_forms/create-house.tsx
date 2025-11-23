"use client";

import InputWithLabel from "@/components/customComponents/InputWithLabel";
import SelectWithLabel from "@/components/customComponents/SelectWithLabel";
import { Form } from "@/components/ui/form";
import { HouseSchema, HouseType } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

type CreateHouseFormProps = {
  onSubmit: (data: HouseType) => void;
  id?: string;
  defaultValues?: Partial<HouseType>;
  isPending?: boolean;
};

export const CreateHouseForm = ({
  onSubmit,
  isPending,
  id,
  defaultValues,
}: CreateHouseFormProps) => {
  const form = useForm<HouseType>({
    mode: "onBlur",
    resolver: zodResolver(HouseSchema),
    defaultValues: defaultValues ?? {
      name: "",
      houseGender: "BOTH",
      roomCapacity: 0,
      roomCount: 0,
      type: "MIXED",
    },
  });

  const handleSubmit = (data: HouseType) => {
    onSubmit(data);
  };

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="space-y-4 p-4 rounded-md border">
          <InputWithLabel<HouseType>
            name="name"
            fieldTitle="House Name"
            schema={HouseSchema}
          />
          <SelectWithLabel<HouseType>
            name="houseGender"
            fieldTitle="Select House Gender"
            data={["MALE", "FEMALE", "BOTH"]}
          />
        </form>
      </Form>
    </>
  );
};
