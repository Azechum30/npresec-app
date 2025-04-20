"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useStudentStore } from "../store";
import React, { useEffect, useState, useTransition } from "react";
import { ClassesResponseType, DepartmentResponseType } from "@/lib/types";
import { getServerSideProps } from "../../departments/actions/getServerSideProps";
import { getClassesAction } from "../../classes/actions/server-actions";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import LoadingButton from "@/components/customComponents/LoadingButton";
import { ChevronLeft } from "lucide-react";
import { createStudent } from "../actions/action";
import { redirect } from "next/navigation";
import { useCancelEditStudent } from "../hooks/use-cancel-edit-student";
import { useHandleStudentUpdate } from "../hooks/use-handle-update-student";
import { useHandleCreateStudent } from "../hooks/use-handle-create-student";

export default function ReviewAndSubmit() {
  const {
    isEditing,
    actions: { getStudentData, PrevStep, resetForm },
  } = useStudentStore();

  const [classes, setClasses] = useState<
    Pick<ClassesResponseType, "id" | "name">[]
  >([]);
  const [departments, setDepartments] = useState<
    Pick<DepartmentResponseType, "id" | "name">[]
  >([]);

  useEffect(() => {
    const fetchData = async () => {
      const [departmentsPromise, classesPromise] = await Promise.all([
        getServerSideProps(),
        getClassesAction(),
      ]);

      if (departmentsPromise.error) {
        return toast.error(departmentsPromise.error);
      }
      if (classesPromise.error) {
        return toast.error(classesPromise.error);
      }

      if (departmentsPromise.departments === undefined) return;
      if (classesPromise.data === undefined) return;

      setClasses(() =>
        classesPromise.data.map((classItem) => ({
          id: classItem.id,
          name: classItem.name,
        }))
      );
      setDepartments(() =>
        departmentsPromise.departments.map((dp) => ({
          id: dp.id,
          name: dp.name,
        }))
      );
    };

    fetchData();
  }, []);

  const { handleCancel } = useCancelEditStudent();
  const { isPending: isUpdatePending, handleUpdate } = useHandleStudentUpdate();
  const { isPending, handleSubmission } = useHandleCreateStudent();

  const submittedData = getStudentData();

  const classesMap = classes.reduce((acc, cls) => {
    acc[cls.id] = cls.name;
    return acc;
  }, {} as Record<string, string>);

  const departmentMap = departments.reduce((acc, dpt) => {
    acc[dpt.id] = dpt.name;
    return acc;
  }, {} as Record<string, string>);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Review and Submit</CardTitle>
        <CardDescription>
          Kindly review the data you entered and if you are sure the data is
          valid, you can then proceed by clicking the submit button to submit
          the data. Do note that data submitted cannot be edited
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="">
          <ul className="list-disc">
            {Object.entries(submittedData).map(([Key, value]) => {
              if (classesMap[value as string]) {
                value = classesMap[value as string];
              }
              if (departmentMap[value as string]) {
                value = departmentMap[value as string];
              }
              return (
                <React.Fragment key={Key}>
                  {Key === "classId" ? (
                    <>
                      <Separator className="mt-3" />
                      <h3 className="text-sm font-semibold py-3">
                        Academic Information
                      </h3>
                    </>
                  ) : Key === "guardianName" ? (
                    <>
                      <Separator className="mt-3" />
                      <h3 className="text-sm font-semibold py-3">
                        Parent/Guardian Information
                      </h3>
                    </>
                  ) : Key === "firstName" ? (
                    <>
                      <Separator className="" />
                      <h3 className="text-sm font-semibold py-3">
                        Personal Information
                      </h3>
                    </>
                  ) : null}
                  <li className="ms-8">
                    <strong className="font-medium">{Key}:</strong> &nbsp;&nbsp;{" "}
                    {value?.toLocaleString()}
                  </li>
                </React.Fragment>
              );
            })}
          </ul>
        </div>
        <div className=" mt-6 py-5 border-t flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <LoadingButton
            loading={false}
            className="md:w-fit"
            variant="outline"
            type="button"
            onClick={() => PrevStep()}>
            <ChevronLeft className="size-5" />
            Preview
          </LoadingButton>
          <div className="flex flex-col md:flex-row gap-4">
            <LoadingButton
              loading={isPending || isUpdatePending}
              className="md:w-fit"
              type="button"
              onClick={isEditing ? handleUpdate : handleSubmission}
              disabled={isPending || isUpdatePending}>
              {isEditing ? "Save Changes" : "Submit"}
            </LoadingButton>
            {isEditing && (
              <LoadingButton
                loading={false}
                className="md:w-fit"
                type="button"
                variant="destructive"
                onClick={handleCancel}>
                Cancel
              </LoadingButton>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
