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
import { useGenericDialog } from "@/hooks/use-open-create-teacher-dialog";
import { useEffect, useState, useTransition } from "react";
import { ClassesType } from "@/lib/validation";
import { deleteClass, getClass, updateClass } from "../actions/server-actions";
import { toast } from "sonner";
import CreateClassForm from "../forms/create-class-form";
import { Loader2 } from "lucide-react";
import { useClassesStore } from "@/hooks/use-generic-store";

import { useConfirmDelete } from "@/components/customComponents/useConfirmDelete";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export default function EditClassDialog() {
  const { id, dialogs, onClose } = useGenericDialog();
  const { updateData } = useClassesStore();

  const [defaultValues, setDefaultValues] = useState<ClassesType | undefined>();
  const [isDeletePending, startDeleteTransition] = useTransition();
  const { deleteData, addData } = useClassesStore();
  const { confirmDelete, ConfirmDeleteComponent } = useConfirmDelete();

  useEffect(() => {
    const fetchClass = async () => {
      const res = await getClass(id as string);

      if ("error" in res) {
        return toast.error(res.error);
      }

      const teachers = res.teachers.map((teacher) => teacher.id);

      setDefaultValues({
        ...res,
        code: res.code,
        createdAt: res.createdAt,
        departmentId: res.departmentId,
        name: res.name,
        level: res.level,
        teachers: teachers,
      });
    };
    if (id) {
      setDefaultValues(undefined);
      fetchClass().then((value)=>console.log(value));
    }
  }, [id, setDefaultValues]);

  const handleSubmit = async (values: ClassesType) => {
    updateData(values.code, values as any);
    const response = await updateClass({ ...values, id: id as string });
    if (response.error) {
      toast.error(response.error);
      updateData(defaultValues?.code as string, defaultValues as any);
    } else if (response.errors) {
      updateData(defaultValues?.code as string, defaultValues as any);
      return { errors: response.errors };
    } else {
      onClose("editClasses");
      updateData(response.class?.code as string, response.class as any);
      toast.success("Class record has been updated!");
      return response.class;
    }
  };

  const handleDelete = async () => {
    deleteData(defaultValues?.code as string);
    startDeleteTransition(async () => {
      const response = await deleteClass({ id: id as string });

      if (response.error) {
        toast.error(`${response.error}`);
        const rollbackData = await getClass(id as string);

        if (!("error" in rollbackData)) {
          addData(rollbackData);
          toast.success("class record has been rolled back!");
        }
        return;
      } else {
        onClose("editClasses");
        toast.success("class record has been deleted!");
      }
    });
  };

  return (
    <>
      <ConfirmDeleteComponent />
      <Dialog
        open={dialogs["editClasses"]}
        onOpenChange={() => onClose("editClasses")}>
        {defaultValues !== undefined ? (
          <DialogContent className="max-h-[85vh] overflow-auto scrollbar-thin">
            <DialogHeader>
              <DialogTitle>Edit Class</DialogTitle>
              <DialogDescription>
                Kindly make changes to the class and click on save to update
                your changes in real-time. Kindly note that fields marked with
                asterisks (*) are mandatory fields and must not be left empty!
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
