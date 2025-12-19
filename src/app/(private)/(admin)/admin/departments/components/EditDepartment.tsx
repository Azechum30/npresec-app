"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import CreateDepartment from "../forms/create-department";
import { useEffect, useState } from "react";
import { getDepartment } from "../actions/get-department";
import { toast } from "sonner";
import { updateDepartmentAction } from "../actions/create-department-action";
import { DepartmentType } from "@/lib/validation";
import { deleteDepartment } from "../actions/delete-departments-action";
import { useGenericDialog } from "@/hooks/use-open-create-teacher-dialog";
import LoadingState from "@/components/customComponents/Loading";

export default function EditDepartment() {
  const { id, dialogs, onClose } = useGenericDialog();
  const [defaultValues, setDefaultValues] = useState<
    DepartmentType | undefined
  >(undefined);

  useEffect(() => {
    if (!id || !dialogs["editDepartment"]) return;
    setDefaultValues(undefined);

    const fetchDepartment = async () => {
      try {
        const response = await getDepartment(id as string);

        if (response?.error) {
          setDefaultValues(undefined);
          return toast.error(response.error);
        }

        setDefaultValues({
          ...response?.department,
          code: response?.department?.code!,
          name: response?.department?.name!,
          headId: response?.department?.headId || undefined,
          description: response?.department?.description || "",
        });
      } catch (error) {
        console.log(error);
      }
    };

    fetchDepartment();
  }, [id]);

  async function handleUpdate(data: DepartmentType) {
    const response = await updateDepartmentAction(id as string, data);
    if (response === undefined || "error" in response) {
      toast.error(response?.error);
      return;
    } else {
      toast.success("record updated successfully!");
      setTimeout(() => onClose("editDepartment"), 300);
    }
  }

  async function handleDelete(id: string) {
    const { error } = await deleteDepartment(id);
    if (error) {
      toast.error(error);
    } else {
      toast.success("record deleted successfully");
      setTimeout(() => onClose("editDepartment"), 300);
    }
  }

  return (
    <Dialog
      open={dialogs["editDepartment"]}
      onOpenChange={() => onClose("editDepartment")}>
      {defaultValues ? (
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Department Data</DialogTitle>
            <DialogDescription>
              Kindly make changes and save your changes in real-time!
            </DialogDescription>
          </DialogHeader>
          <CreateDepartment
            id={id}
            defaultValues={defaultValues}
            onSubmit={handleUpdate}
            onDelete={handleDelete}
          />
        </DialogContent>
      ) : (
        <DialogContent className="w-auto">
          <DialogHeader className="sr-only">
            <DialogTitle>Loading Data</DialogTitle>
            <DialogDescription>Loading Data</DialogDescription>
          </DialogHeader>
          <LoadingState />
        </DialogContent>
      )}
    </Dialog>
  );
}
