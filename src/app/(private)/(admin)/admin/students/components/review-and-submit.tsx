/**biome-ignore-all assist/source/organizeImports: reason */
"use client";

import { FallbackComponent } from "@/components/customComponents/fallback-component";
import LoadingButton from "@/components/customComponents/LoadingButton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatDate } from "@/lib/format-date";
import { useQueries } from "@tanstack/react-query";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useMemo } from "react";
import { classQueryOptions } from "../../classes/actions/queries";
import { departmentsQueryOptions } from "../../departments/actions/queries";
import {
  useCreateStudentMutationFn,
  useUpdateStudentMutationFn,
} from "../actions/mutations";
import { useCancelEditStudent } from "../hooks/use-cancel-edit-student";
import { useStudentStore } from "../store";

// Helper to format keys like "firstName" -> "First Name"
const formatLabel = (key: string) =>
  key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase());

const formatValue = (value: string) => value?.replace(/[_]/g, " ");

export default function ReviewAndSubmit() {
  const {
    isEditing,
    actions: { getStudentData, PrevStep, resetForm },
  } = useStudentStore();

  const { handleCancel } = useCancelEditStudent();

  const { mutateAsync, isPending } = useCreateStudentMutationFn();
  const { mutateAsync: updateMutation, isPending: updatePending } =
    useUpdateStudentMutationFn(getStudentData().id);

  const [departmentsQueryData, classQueryData] = useQueries({
    queries: [departmentsQueryOptions, classQueryOptions],
  });

  const departments = useMemo(() => {
    if (!departmentsQueryData.data) return [];
    return departmentsQueryData.data.map((dept) => ({
      id: dept.id,
      name: dept.name,
    }));
  }, [departmentsQueryData.data]);

  const classes = useMemo(() => {
    if (!classQueryData.data) return [];
    return classQueryData.data.map((cls) => ({ id: cls.id, name: cls.name }));
  }, [classQueryData.data]);

  const router = useRouter();

  const submittedData = getStudentData();
  const classesMap = new Map(classes.map((cls) => [cls.id, cls.name]));
  const departmentMap = new Map(
    departments.map((dept) => [dept.id, dept.name]),
  );

  const isLoading = departmentsQueryData.isLoading || classQueryData.isLoading;

  if (isLoading) return <FallbackComponent />;

  const handleStudentUpdate = () => {
    const { id, ...rest } = submittedData;
    Promise.try(async () => {
      await updateMutation({ id, data: rest });
      router.push("/admin/students");
      resetForm();
    });
  };
  const handleStudentCreation = () => {
    const { id, ...rest } = submittedData;
    Promise.try(async () => {
      await mutateAsync(rest);
      router.push("/admin/students");
      resetForm();
    });
  };

  return (
    <Card className="shadow-lg border-muted">
      <CardHeader className="bg-muted/20">
        <CardTitle className="text-xl font-bold">Review and Submit</CardTitle>
        <CardDescription>
          Review the details below. Ensure all information is accurate before
          submitting.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6 pt-6">
        <div className="rounded-lg border bg-card">
          {Object.entries(submittedData).map(([key, value]) => {
            let displayValue = value;
            if (key === "classId" && classesMap.has(value as string)) {
              displayValue = classesMap.get(value as string) as string;
            } else if (
              key === "departmentId" &&
              departmentMap.has(value as string)
            ) {
              displayValue = departmentMap.get(value as string) as string;
            } else if (key === "birthDate" || key === "dateEnrolled") {
              displayValue = formatDate(value as Date, "DD/MM/YYYY");
            }

            return (
              <React.Fragment key={key}>
                {(key === "firstName" ||
                  key === "classId" ||
                  key === "guardianName") && (
                  <div className="bg-muted/40 px-4 py-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    {key === "firstName"
                      ? "Personal Information"
                      : key === "classId"
                        ? "Academic Information"
                        : "Parent/Guardian Information"}
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 px-4 py-3 border-b last:border-0 hover:bg-muted/20 transition-colors">
                  <span className="text-sm font-medium text-muted-foreground">
                    {formatLabel(key)}
                  </span>
                  <span className="col-span-2 text-sm font-semibold text-foreground">
                    {formatValue(displayValue?.toString() as string) || "-"}
                  </span>
                </div>
              </React.Fragment>
            );
          })}
        </div>

        <div className="flex flex-col md:flex-row md:justify-between gap-4 pt-4">
          <LoadingButton
            variant="outline"
            onClick={() => PrevStep()}
            loading={false}
            className="w-full md:w-auto">
            <ChevronLeft className="mr-2 size-4" />
            Back
          </LoadingButton>

          <div className="flex gap-3">
            {isEditing && (
              <LoadingButton
                variant="destructive"
                onClick={handleCancel}
                loading={false}
                className="w-full md:w-auto">
                Cancel
              </LoadingButton>
            )}
            <LoadingButton
              onClick={isEditing ? handleStudentUpdate : handleStudentCreation}
              loading={isPending || updatePending}
              disabled={isPending || updatePending}
              className="w-full md:w-auto">
              {isEditing ? "Save Changes" : "Confirm & Submit"}
            </LoadingButton>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
