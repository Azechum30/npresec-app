/** biome-ignore-all assist/source/organizeImports: reason */
"use client";

import { GenericSelectWithLabel } from "@/components/customComponents/generic-select-with-label";
import LoadingButton from "@/components/customComponents/LoadingButton";
import SelectWithLabel from "@/components/customComponents/SelectWithLabel";
import { useAuth } from "@/components/customComponents/SessionProvider";
import { ShowLoadingState } from "@/components/customComponents/show-loading-state";
import { Form } from "@/components/ui/form";
import { useGenericDialog } from "@/hooks/use-open-create-teacher-dialog";
import { userHasRole } from "@/lib/user-has-role";
import {
  studentHouseAllocationSchema,
  type StudentHouseAllocationType,
} from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueries } from "@tanstack/react-query";
import { PlusCircle, Save } from "lucide-react";
import { useMemo, type FC } from "react";
import { useForm, useWatch } from "react-hook-form";
import { housesQueryOptions } from "../../(admin)/admin/houses/queries";
import { roomsQueryOptions } from "../../rooms/_actions/queries";
import { studentsWithoutHouseAllocationsQueryOptions } from "../_actions/queries";

type StudentHouseAllocationFormProps = {
  onSubmitAction: (data: StudentHouseAllocationType) => Promise<void>;
  id?: string;
  defaultValues?: StudentHouseAllocationType;
  isPending: boolean;
};

export const StudentHouseAllocationForm: FC<
  StudentHouseAllocationFormProps
> = ({ onSubmitAction, defaultValues, id, isPending }) => {
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

  const status = useWatch({
    control: form.control,
    name: "status",
  });

  const house = useWatch({
    control: form.control,
    name: "houseId",
  });

  const { dialogs } = useGenericDialog();
  const user = useAuth();

  const isOpen = !!dialogs["create-allocation"] || !!dialogs["edit-allocation"];

  const [studentsQueryData, housesQueryData, roomsQueryData] = useQueries({
    queries: [
      {
        ...studentsWithoutHouseAllocationsQueryOptions(
          defaultValues?.studentNumber,
        ),
        enabled: isOpen,
      },
      {
        ...housesQueryOptions,
        enabled: isOpen,
      },
      {
        ...roomsQueryOptions(house !== "" ? house : undefined),
        enabled: isOpen,
      },
    ],
  });

  const filteredHouses = useMemo(() => {
    if (!user || !housesQueryData.data) return [];
    const userRole = userHasRole(user).has("houseMaster");
    if (userRole) {
      return housesQueryData.data.filter(
        (hs) => hs.houseMaster?.userId === user.id,
      );
    }
    return housesQueryData.data;
  }, [user, housesQueryData.data]);

  async function handleSubmit(data: StudentHouseAllocationType) {
    await onSubmitAction(data);
  }

  if (studentsQueryData.isLoading || housesQueryData.isLoading)
    return <ShowLoadingState />;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-4 border rounded-md p-4">
        {studentsQueryData.data && housesQueryData.data ? (
          <>
            <SelectWithLabel
              fieldTitle="Student"
              name="studentNumber"
              schema={studentHouseAllocationSchema}
              data={studentsQueryData.data.map((student) => ({
                id: student.id,
                fullName: `${student.lastName} ${student.firstName} ${student.middleName ?? ""}`,
              }))}
              valueKey="id"
              selectedKey="fullName"
              placeholder="Select Student"
            />
            <GenericSelectWithLabel
              fieldTitle="Assigned House"
              name="houseId"
              schema={studentHouseAllocationSchema}
              data={filteredHouses}
              selectedKey="name"
              valueKey="id"
            />

            <GenericSelectWithLabel
              name="status"
              fieldTitle="Residential Status"
              data={(["Day", "Boarding"] as const).map((status) => ({
                id: status,
                name: status,
              }))}
              valueKey="id"
              selectedKey="id"
              schema={studentHouseAllocationSchema}
            />

            {status && status === "Boarding" && roomsQueryData.data && (
              <GenericSelectWithLabel
                name="roomId"
                fieldTitle="Assign Room"
                data={roomsQueryData.data.map((rm) => ({
                  id: rm.id,
                  name: `${rm.code} (${rm.rmGender?.toString().toLowerCase()})`,
                }))}
                valueKey="id"
                selectedKey="name"
              />
            )}
            <LoadingButton
              loading={isPending}
              disabled={!form.formState.isValid}
              type="submit">
              {id ? (
                isPending ? (
                  "Saving Allocation"
                ) : (
                  <>
                    <Save className="size-5" />
                    Save Allocation
                  </>
                )
              ) : isPending ? (
                "Creating Allocation"
              ) : (
                <>
                  <PlusCircle className="size-5" />
                  Create Allocation
                </>
              )}
            </LoadingButton>
          </>
        ) : null}
      </form>
    </Form>
  );
};
