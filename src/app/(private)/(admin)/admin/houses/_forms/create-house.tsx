"use client";

import InputWithLabel from "@/components/customComponents/InputWithLabel";
import LoadingButton from "@/components/customComponents/LoadingButton";
import SelectWithLabel from "@/components/customComponents/SelectWithLabel";
import { Form } from "@/components/ui/form";
import { client } from "@/lib/orpc";
import { HouseSchema, HouseType } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";

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
      houseGender: undefined,
      occupancy: {
        maleOccupancy: {
          roomCount: 0,
          roomCapacity: 0,
        },
        femaleOccupancy: {
          roomCount: 0,
          roomCapacity: 0,
        },
      },
      residencyType: undefined,
    },
  });

  const roomGenderTypes = useWatch({
    control: form.control,
    name: "houseGender",
  });

  const [teachers, setTeachers] = useState<
    { id: string; fullName: string }[] | undefined
  >();

  useEffect(() => {
    const fetchTeachers = async () => {
      const response = await client.staff.getStaff();
      const formattedTeachers = response.map((st) => ({
        id: st.id,
        fullName: `${st.firstName} ${st.lastName}`,
      }));
      setTeachers(formattedTeachers);
    };

    fetchTeachers();
  }, []);

  const handleSubmit = (data: HouseType) => {
    onSubmit(data);
  };

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="space-y-4 p-4 rounded-md border">
          <InputWithLabel
            name="name"
            fieldTitle="House Name"
            schema={HouseSchema}
          />
          <SelectWithLabel
            name="houseGender"
            fieldTitle="House Gender"
            data={["MALE", "FEMALE", "BOTH"]}
            schema={HouseSchema}
            placeholder="Select which gender the house accommodates"
          />

          {roomGenderTypes === "BOTH" ? (
            <>
              <div className="flex flex-col gap-3 md:flex-row md:items-center">
                <div className="flex-1">
                  <InputWithLabel
                    name="occupancy.maleOccupancy.roomCount"
                    fieldTitle="Male Rooms Count"
                    schema={HouseSchema}
                    type="number"
                  />
                </div>
                <div className="flex-1">
                  <InputWithLabel
                    name="occupancy.maleOccupancy.roomCapacity"
                    fieldTitle="Bed Capacity"
                    schema={HouseSchema}
                    type="number"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-3 md:flex-row md:items-center">
                <div className="flex-1">
                  <InputWithLabel
                    name="occupancy.femaleOccupancy.roomCount"
                    fieldTitle="Female Rooms Count"
                    schema={HouseSchema}
                    type="number"
                  />
                </div>
                <div className="flex-1">
                  <InputWithLabel
                    name="occupancy.femaleOccupancy.roomCapacity"
                    fieldTitle="Bed Capacity"
                    schema={HouseSchema}
                    type="number"
                  />
                </div>
              </div>
            </>
          ) : roomGenderTypes === "MALE" ? (
            <div className="flex flex-col gap-3 md:flex-row md:items-center">
              <div className="flex-1">
                <InputWithLabel
                  name="occupancy.maleOccupancy.roomCount"
                  fieldTitle="Male Rooms Count"
                  schema={HouseSchema}
                  type="number"
                />
              </div>
              <div className="flex-1">
                <InputWithLabel
                  name="occupancy.maleOccupancy.roomCapacity"
                  fieldTitle="Bed Capacity"
                  schema={HouseSchema}
                  type="number"
                />
              </div>
            </div>
          ) : roomGenderTypes === "FEMALE" ? (
            <div className="flex flex-col gap-3 md:flex-row md:items-center">
              <div className="flex-1">
                <InputWithLabel
                  name="occupancy.femaleOccupancy.roomCount"
                  fieldTitle="Female Rooms Count"
                  schema={HouseSchema}
                  type="number"
                />
              </div>
              <div className="flex-1">
                <InputWithLabel
                  name="occupancy.femaleOccupancy.roomCapacity"
                  fieldTitle="Bed Capacity"
                  schema={HouseSchema}
                  type="number"
                />
              </div>
            </div>
          ) : null}

          {roomGenderTypes && (
            <SelectWithLabel
              name="residencyType"
              fieldTitle="Select Residency Type"
              data={["MIXED", "DAY", "BOARDING"]}
              schema={HouseSchema}
              placeholder="Select Residency Type"
            />
          )}

          {roomGenderTypes && (
            <SelectWithLabel
              name="houseMasterId"
              fieldTitle="Select House Master"
              data={teachers ?? []}
              selectedKey="fullName"
              valueKey="id"
              schema={HouseSchema}
              placeholder="Select House Master"
            />
          )}

          <LoadingButton
            disabled={!form.formState.isValid || isPending}
            loading={isPending as boolean}>
            {id ? (
              <>
                {isPending ? (
                  <>
                    <Save /> Saving...
                  </>
                ) : (
                  <>
                    <Save /> Update House
                  </>
                )}
              </>
            ) : (
              <>
                {isPending ? (
                  <>
                    <Plus /> Creating...
                  </>
                ) : (
                  <>
                    <Plus /> Create House
                  </>
                )}
              </>
            )}
          </LoadingButton>
        </form>
      </Form>
    </>
  );
};
