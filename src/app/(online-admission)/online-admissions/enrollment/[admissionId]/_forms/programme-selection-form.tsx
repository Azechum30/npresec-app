"use client";

import LoadingButton from "@/components/customComponents/LoadingButton";
import SelectWithLabel from "@/components/customComponents/SelectWithLabel";
import { Button } from "@/components/ui/button";
import { Form, FormDescription } from "@/components/ui/form";
import { ProgramSelectionSchema, ProgramSelectionType } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { startTransition, useEffect, useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { getExistingClasesAndDeparments } from "../_actions/get-classes-action";
import { useStudentEnrollmentStore } from "../_utils/store";

export const ProgrammeSelectionForm = () => {
  const { programmeSelection, actions } = useStudentEnrollmentStore();
  const form = useForm<ProgramSelectionType>({
    mode: "onChange",
    resolver: zodResolver(ProgramSelectionSchema),
    defaultValues: programmeSelection ?? {
      classId: "",
      className: "",
      departmentId: "",
      programme: "",
    },
  });

  const [classes, setClasses] = useState<
    { id: string; name: string; departmentId: string | null }[] | undefined
  >();
  const [departments, setDepartments] = useState<
    { id: string; name: string }[] | undefined
  >();
  const [courses, setCourses] = useState<
    | {
        id: string;
        classes: {
          id: string;
          name: string;
        }[];
        title: string;
      }[]
    | undefined
  >();

  const programmeSelectionInfo = useWatch({
    control: form.control,
  });

  useEffect(() => {
    actions.setProgrammeSelection(programmeSelectionInfo);
  }, [actions, programmeSelectionInfo]);

  useEffect(() => {
    startTransition(async () => {
      const { error, classes, departments, courses } =
        await getExistingClasesAndDeparments();

      if (error) {
        toast.error(error);
        return;
      }
      if (classes) {
        setClasses(classes);
      }

      if (departments) {
        setDepartments(departments);
      }

      if (courses) {
        setCourses(courses);
      }
    });
  }, []);

  const selectedProgramme = useWatch({
    control: form.control,
    name: "programme",
  });
  const selectedClass = useWatch({
    control: form.control,
    name: "className",
  });

  const filterClasses = useMemo(() => {
    const filtered = departments?.filter(
      (dpt) => dpt.name === selectedProgramme,
    );
    const classDeptMap = new Map(filtered?.map((dpt) => [dpt.id, dpt]));

    return classes?.filter((cls) =>
      classDeptMap.has(cls.departmentId as string),
    );
  }, [selectedProgramme, departments, classes]);

  const filterCourses = useMemo(() => {
    return courses?.filter((cs) =>
      cs.classes.some((cl) => cl.name === selectedClass),
    );
  }, [selectedClass, courses]);

  useEffect(() => {
    startTransition(() => {
      if (filterClasses && selectedClass) {
        const className =
          filterClasses.filter((cls) => cls.name === selectedClass) || [];

        if (className) {
          form.setValue("classId", className[0]?.id);
          form.setValue("departmentId", className[0]?.departmentId ?? "");
        }
      }
    });
  }, [selectedClass, filterClasses, form]);

  const handleSubmit = (values: ProgramSelectionType) => {
    actions.setProgrammeSelection(values);
    actions.nextStep();
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-4 rounded-md p-4 border h-full max-h-[60vh] overflow-y-auto scrollbar-thin">
        <fieldset className="border p-3 rounded-md space-y-4">
          <legend className="text-base font-bold p-1.5">
            Section D: Programme or Course Selection
          </legend>
          <FormDescription className="mb-6 text-justify bg-destructive/5 border rounded-md p-2">
            This section deals with the course or programme the student wish to
            study in the school. The student has the opportunity to change the
            programme that was assigned to him or her when the school placement
            was done. Be informed that the classes in the school are grouped
            under programmes and so you would only get access to classes that
            are associated with the programme you were given during placement or
            select should you decide to change a programme. <br /> <br />
            When you choose a class, you have the opportunity also to see the
            subjects associated with the chosen classes. All course are
            carefully chosen to suit the programme of choice and help the
            learner in his or her academic progression.
          </FormDescription>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <SelectWithLabel
                name="programme"
                fieldTitle="Programme"
                placeholder="programme to offer"
                schema={ProgramSelectionSchema}
                data={[
                  "General Arts",
                  "Home Economics",
                  "Technical",
                  "Visual Arts",
                  "Agriculture",
                ]}
              />
            </div>
            <SelectWithLabel
              name="className"
              fieldTitle="Class"
              placeholder="The class the studen wish to belong"
              schema={ProgramSelectionSchema}
              selectedKey="name"
              valueKey="name"
              data={filterClasses ?? []}
            />
          </div>
          {/* <div className="grid grid-cols-1 gap-4">
            <InputWithLabel name="classId" fieldTitle="" hidden />
            <InputWithLabel name="departmentId" fieldTitle="" hidden />
          </div> */}
          {filterCourses && filterCourses.length > 0 && (
            <>
              <div className="mt-6 p-4 border rounded-md grid grid-cols-1 gap-3 sm:grid-cols-2 sm:justify-between">
                {filterCourses.map((cs, index) => (
                  <div key={cs.id} className="flex space-x-3 items-center">
                    <span className="rounded-full size-8 flex justify-center items-center bg-destructive/50 p-1.5">
                      {index + 1}
                    </span>
                    <span className="font-mono font-bold">{cs.title}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </fieldset>
        <div className="flex flex-col sm:flex-row sm:justify-end sm:items-center gap-2">
          <Button
            onClick={() => actions.prevStep()}
            type="button"
            className="w-full sm:w-1/4"
            variant="outline">
            <ChevronLeft className="size-5" />
            Previous
          </Button>
          <LoadingButton
            disabled={!form.formState.isValid}
            className="w-full sm:w-1/4"
            loading={form.formState.isSubmitting}>
            Save and Continue
          </LoadingButton>
          <Button
            disabled={!form.formState.isValid}
            onClick={actions.nextStep}
            type="button"
            className="w-full sm:w-1/4"
            variant="outline">
            Next
            <ChevronRight className="size-5" />
          </Button>
        </div>
      </form>
    </Form>
  );
};
