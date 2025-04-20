"use client";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import CreateDepartment from "../forms/create-department";
import { useEffect, useState } from "react";
import { getDepartment } from "../actions/get-department";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { updateDepartmentAction } from "../actions/create-department-action";
import { DepartmentType } from "@/lib/validation";
import { deleteDepartment } from "../actions/delete-departments-action";
import { useDepartmentStore } from "@/hooks/use-generic-store";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { useGenericDialog } from "../../../../../hooks/use-open-create-teacher-dialog";

export default function EditDepartment() {
  const { id, dialogs, onClose } = useGenericDialog();
  const { updateData, deleteData: Delete, addData } = useDepartmentStore();

  const [defaultValues, setDefaultValues] = useState<
    DepartmentType | undefined
  >(undefined);

  useEffect(() => {
    const fetchDepartment = async () => {
      try {
        const response = await getDepartment(id as string);

        if (response?.error) {
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

    if (id) {
      setDefaultValues(undefined);
      fetchDepartment();
    }
  }, [id]);

  async function handleUpdate(data: DepartmentType) {
    updateData(data.code, data as any);
    const response = await updateDepartmentAction(id as string, data);
    if (response === undefined || "error" in response) {
      updateData(defaultValues?.code as string, defaultValues as any);
      toast.error(response?.error);
      return;
    } else {
      onClose("editDepartment");
      updateData(response.code as string, response as any);
      toast.success("record updated successfully!");
      return response;
    }
  }

  async function handleDelete(id: string) {
    Delete(defaultValues?.code as string);
    const res = await deleteDepartment(id);

    if ("error" in res) {
      addData(defaultValues as any);
      return toast.error(res.error);
    } else {
      onClose("editDepartment");
      toast.success("record deleted successfully");
    }
  }

  return (
    <Dialog
      open={dialogs["editDepartment"]}
      onOpenChange={() => onClose("editDepartment")}>
      {defaultValues ? (
        <DialogContent className="h-full">
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
          <DialogFooter>
            <DialogClose
              className={cn(
                buttonVariants({ variant: "secondary" }),
                "w-full"
              )}>
              Cancel
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      ) : (
        <DialogContent>
          <DialogHeader className="sr-only">
            <DialogTitle>Loading Data</DialogTitle>
            <DialogDescription>Loading Data</DialogDescription>
          </DialogHeader>
          <div className="flex justify-center items-center h-full">
            <Loader2 className="size-4 animate-spin" />
          </div>
        </DialogContent>
      )}
    </Dialog>
  );
}
