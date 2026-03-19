"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useGenericDialog } from "@/hooks/use-open-create-teacher-dialog";
import { ClassesType } from "@/lib/validation";
import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import { deleteClass, getClass, updateClass } from "../actions/server-actions";
import CreateClassForm from "../forms/create-class-form";

import { ShowLoadingState } from "@/components/customComponents/show-loading-state";
import { useConfirmDelete } from "@/components/customComponents/useConfirmDelete";
import { ClassesResponseType } from "@/lib/types";

export default function EditClassDialog() {
  const { id, dialogs, onClose } = useGenericDialog();

  const [defaultValues, setDefaultValues] = useState<ClassesType | undefined>();
  const [isDeletePending, startDeleteTransition] = useTransition();
  const { confirmDelete, ConfirmDeleteComponent } = useConfirmDelete();

  useEffect(() => {
    if (!id || !dialogs["editClass"]) return;

    const fetchClass = async () => {
      setDefaultValues(undefined);
      const result = await getClass(id as string);

      if (result.error) {
        toast.error(result.error);
        result.error = "";
        return;
      }
      if (result.data) {
        const { data } = result;
        const staffs = data?.staff.map((teacher) => teacher.id);
        setDefaultValues(
          data
            ? {
                ...data,
                code: data.code as string,
                createdAt: data.createdAt,
                departmentId: data.departmentId,
                name: data.name,
                level: data.level,
                staff: staffs ? staffs : undefined,
                maxCapacity: data.maxCapacity as number,
              }
            : undefined,
        );
      }
    };

    fetchClass();
  }, [id, dialogs]);

  const handleSubmit = async (values: ClassesType) => {
    const result = await updateClass({
      ...values,
      id: id as string,
    });
    if (result.error) {
      toast.error(result.error);
      result.error = "";
    } else if (result.errors) {
      return { errors: result.errors };
    } else {
      toast.success("Class record has been updated!");
      setTimeout(() => onClose("editClass"), 300);
    }
  };

  const handleDelete = async () => {
    startDeleteTransition(async () => {
      const result = await deleteClass({ id: id as string });

      if (result.error) {
        toast.error(result.error);
        result.error = "";
      } else if (result.class) {
        toast.success("class record has been deleted!");
        setTimeout(() => onClose("editClass"), 300);
        result.class = {} as ClassesResponseType;
      }
    });
  };

  return (
    <>
      <ConfirmDeleteComponent />
      <Dialog
        open={dialogs["editClass"]}
        onOpenChange={() => onClose("editClass")}>
        {defaultValues !== undefined && dialogs["editClass"] ? (
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Class</DialogTitle>
              <DialogDescription>
                Kindly make changes and save in realtime
              </DialogDescription>
            </DialogHeader>
            <CreateClassForm
              id={id}
              defaultValues={defaultValues}
              onSubmit={handleSubmit}
              onDelete={async () => {
                const ok = await confirmDelete();
                if (ok) {
                  await handleDelete();
                }
              }}
              isDeletePending={isDeletePending}
            />
          </DialogContent>
        ) : (
          <DialogContent>
            <DialogHeader className="sr-only">
              <DialogTitle>Loading class data</DialogTitle>
              <DialogDescription>
                Please wait whilst data is being loaded
              </DialogDescription>
            </DialogHeader>
            <ShowLoadingState />
          </DialogContent>
        )}
      </Dialog>
    </>
  );
}
