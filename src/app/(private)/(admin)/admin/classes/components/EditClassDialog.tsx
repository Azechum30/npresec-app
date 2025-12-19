"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useGenericDialog } from "@/hooks/use-open-create-teacher-dialog";
import { useEffect, useState, useTransition } from "react";
import { ClassesType } from "@/lib/validation";
import { deleteClass, getClass, updateClass } from "../actions/server-actions";
import { toast } from "sonner";
import CreateClassForm from "../forms/create-class-form";
import { Loader2 } from "lucide-react";

import { useConfirmDelete } from "@/components/customComponents/useConfirmDelete";

export default function EditClassDialog() {
  const { id, dialogs, onClose } = useGenericDialog();

  const [defaultValues, setDefaultValues] = useState<ClassesType | undefined>();
  const [isDeletePending, startDeleteTransition] = useTransition();
  const { confirmDelete, ConfirmDeleteComponent } = useConfirmDelete();

  useEffect(() => {
    if (!id || !dialogs["editClass"]) return;
    setDefaultValues(undefined);

    const fetchClass = async () => {
      const { error, data } = await getClass(id as string);

      if (error) {
        return toast.error(error);
      }

      const staffs = data?.staff.map((teacher) => teacher.id);

      console.log(data);

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
          : undefined
      );
    };

    fetchClass();
  }, [id, dialogs]);

  const handleSubmit = async (values: ClassesType) => {
    const { error, errors } = await updateClass({
      ...values,
      id: id as string,
    });
    if (error) {
      toast.error(error);
    } else if (errors) {
      return { errors };
    } else {
      toast.success("Class record has been updated!");
      setTimeout(() => onClose("editClass"), 300);
    }
  };

  const handleDelete = async () => {
    startDeleteTransition(async () => {
      const { error } = await deleteClass({ id: id as string });

      if (error) {
        toast.error(error);
      } else {
        toast.success("class record has been deleted!");
        setTimeout(() => onClose("editClass"), 300);
      }
    });
  };

  console.log(defaultValues);
  return (
    <>
      <ConfirmDeleteComponent />
      <Dialog
        open={dialogs["editClass"]}
        onOpenChange={() => onClose("editClass")}>
        {defaultValues !== undefined ? (
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
            <div className="w-full h-full flex justify-center items-center">
              <Loader2 className="size-8 animate-spin" />
            </div>
          </DialogContent>
        )}
      </Dialog>
    </>
  );
}
