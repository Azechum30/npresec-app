/** biome-ignore-all assist/source/organizeImports: reason */
"use client";

import InputWithLabel from "@/components/customComponents/InputWithLabel";
import LoadingButton from "@/components/customComponents/LoadingButton";
import SelectWithLabel from "@/components/customComponents/SelectWithLabel";
import { ShowLoadingState } from "@/components/customComponents/show-loading-state";
import TextAreaWithLabel from "@/components/customComponents/TextareaWithLabel";
import { Form } from "@/components/ui/form";
import { useGenericDialog } from "@/hooks/use-open-create-teacher-dialog";
import { toProperCase } from "@/lib/to-proper-case";
import {
  exeatFormSchema,
  ExeatType,
  type ExeatFormValues,
} from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { PlusCircle, Save } from "lucide-react";
import { useMemo, type FC } from "react";
import { useForm } from "react-hook-form";
import { studentsToAssignExeatQueryOptions } from "../_actions/queries";

type RequestExeatFormProps = {
  onSubmitAction: (data: ExeatFormValues) => Promise<void>;
  id?: string;
  defaultValues?: ExeatFormValues;
  isPending: boolean;
};

export const RequestExeatForm: FC<RequestExeatFormProps> = ({
  onSubmitAction,
  defaultValues,
  isPending,
  id,
}) => {
  const form = useForm<ExeatFormValues>({
    resolver: zodResolver(exeatFormSchema),
    defaultValues: defaultValues ?? {
      classId: "",
      departureDate: new Date(),
      destination: "",
      expectedReturnDate: new Date(),
      guardianContact: "",
      guardianName: "",
      houseId: "",
      level: "",
      reason: "",
      studentId: "",
      type: "PERSONAL",
    },
    mode: "onSubmit",
  });

  const { dialogs } = useGenericDialog();
  const isOPen = !!dialogs["request-exeat"] || dialogs["edit-exeat"];

  const { data, isLoading } = useQuery({
    ...studentsToAssignExeatQueryOptions,
    enabled: isOPen,
  });

  const filteredData = useMemo(() => {
    if (!data) return { students: [], houses: [], classes: [], levels: [] };

    const students = data.map((student) => ({
      id: student.id,
      fullName: `${student.lastName} ${student.firstName} ${student.middleName ?? ""}`,
    }));

    const houses = [
      ...new Map(data.map((st) => [st.house?.id, st.house])).values(),
    ].filter((h) => h !== null);

    const classes = [
      ...new Map(
        data.map((st) => [st.currentClass?.id, st.currentClass]),
      ).values(),
    ].filter((c) => c !== null);
    const levels = [...new Set(data.map((st) => st.currentLevel))].map(
      (level) => ({ id: level, name: toProperCase(level) }),
    );

    return { students, houses, classes, levels };
  }, [data]);

  if (isLoading) return <ShowLoadingState />;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmitAction)}
        className="space-y-4 p-4 border rounded-md max-h-[75vh] overflow-y-auto scrollbar-thin">
        <SelectWithLabel
          name="studentId"
          fieldTitle="Student Name"
          data={filteredData.students}
          selectedKey="fullName"
          valueKey="id"
          placeholder="Select student"
          schema={exeatFormSchema}
          disabled={!!id}
        />
        <SelectWithLabel
          name="houseId"
          fieldTitle="Assigned House"
          data={filteredData.houses}
          selectedKey="name"
          valueKey="id"
          placeholder="Select assigned house"
          schema={exeatFormSchema}
        />
        <SelectWithLabel
          name="classId"
          fieldTitle="Current Class"
          data={filteredData.classes}
          selectedKey="name"
          valueKey="id"
          placeholder="Select current class"
          schema={exeatFormSchema}
        />
        <SelectWithLabel
          name="level"
          fieldTitle="Current Level"
          data={filteredData.levels}
          selectedKey="name"
          valueKey="id"
          placeholder="Select current level"
          schema={exeatFormSchema}
        />
        <SelectWithLabel
          name="type"
          fieldTitle="Exeat Type"
          data={ExeatType.map((type) => ({
            id: type,
            name: toProperCase(type),
          }))}
          selectedKey="name"
          valueKey="id"
          placeholder="Select exeat type"
          schema={exeatFormSchema}
        />
        <InputWithLabel
          name="guardianName"
          fieldTitle="Parent/Guardian Name"
          placeholder="Enter parent or guardian name"
          schema={exeatFormSchema}
        />
        <InputWithLabel
          name="guardianContact"
          fieldTitle="Guardian Contact"
          placeholder="Enter parent or guardian contact"
          schema={exeatFormSchema}
        />
        <InputWithLabel
          name="destination"
          fieldTitle="Destination"
          placeholder="Enter destination"
          schema={exeatFormSchema}
        />
        <InputWithLabel
          name="departureDate"
          fieldTitle="Departure Date"
          //   placeholder="Enter destination"
          schema={exeatFormSchema}
          type="datetime-local"
        />
        <InputWithLabel
          name="expectedReturnDate"
          fieldTitle="Expected Return Date"
          schema={exeatFormSchema}
          type="datetime-local"
        />
        <TextAreaWithLabel
          name="reason"
          fieldTitle="Reason For Exeat"
          placeholder="Maximum of 1000 characters"
        />

        <LoadingButton loading={isPending} disabled={!form.formState.isValid}>
          {id ? (
            isPending ? (
              "Saving Request"
            ) : (
              <>
                <Save className="size-5" />
                Save Request
              </>
            )
          ) : isPending ? (
            "Processing Request"
          ) : (
            <>
              <PlusCircle className="size-5" />
              Send Request
            </>
          )}
        </LoadingButton>
      </form>
    </Form>
  );
};
