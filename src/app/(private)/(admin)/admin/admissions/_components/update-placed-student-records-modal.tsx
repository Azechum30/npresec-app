"use client";

import { ShowLoadingState } from "@/components/customComponents/show-loading-state";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useGenericDialog } from "@/hooks/use-open-create-teacher-dialog";
import {
  ADMISSION_STATUS,
  FreshAdmissionsType,
  Gender,
  RESIDENTIAL_STATUS,
} from "@/lib/validation";
import { useRouter } from "next/navigation";
import { startTransition, useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import { z } from "zod";
import {
  getPlacedStudentById,
  updateFreshStudentAdmission,
} from "../_actions/server-only-actions";
import { CreateANewAdmissionForm } from "../_forms/create-a-new-admission";

export const UpdatePlacedStudentRecordsModal = () => {
  const { id, dialogs, onClose } = useGenericDialog();
  const [defaultValues, setDefaultValues] = useState<
    FreshAdmissionsType | undefined
  >();

  const [isPending, startUpdateTransition] = useTransition();
  const router = useRouter();

  useEffect(() => {
    if (!id || !dialogs["edit-admission"]) return;

    router.refresh();

    startTransition(async () => {
      const { error, placedStudent } = await getPlacedStudentById(
        id as z.infer<typeof z.ZodCUID.prototype>,
      );

      if (error) {
        toast.error(error);
        return;
      }

      if (placedStudent) {
        setDefaultValues({
          ...placedStudent,
          gender: placedStudent?.gender as Gender,
          residentialStatus:
            placedStudent.residentialStatus as RESIDENTIAL_STATUS,
          admissionStatus: placedStudent.admissionStatus as ADMISSION_STATUS,
          schoolLocation: placedStudent.schoolLocation ?? undefined,
          schoolRegion: placedStudent.schoolRegion ?? undefined,
          district: placedStudent.district ? placedStudent.district : undefined,
          hometown: placedStudent.hometown ? placedStudent.hometown : undefined,
          guardianName: placedStudent.guardianName ?? undefined,
          guardianPhoneNumber: placedStudent.guardianPhoneNumber ?? undefined,
          guardianRelation: placedStudent.guardianRelation ?? undefined,
          primaryAddress: placedStudent.primaryAddress ?? undefined,
          aggregateScore: placedStudent.aggregateScore ?? undefined,
          enrollmentCode: placedStudent.enrollmentCode ?? undefined,
        });
      }
    });
  }, [id, dialogs]);

  const handleUpdate = (values: FreshAdmissionsType) => {
    startUpdateTransition(async () => {
      const { error, success } = await updateFreshStudentAdmission({
        ...values,
        id: id as z.infer<typeof z.ZodCUID.prototype>,
      });

      if (error) {
        toast.error(error);
        return;
      }

      if (success) {
        toast.success("Placed student updated successfully");
        setTimeout(() => onClose("edit-admission"), 300);
      }
    });
  };

  return (
    <>
      <Dialog
        open={!!dialogs["edit-admission"]}
        onOpenChange={() => onClose("edit-admission")}>
        {!!defaultValues && !!dialogs["edit-admission"] && !!id ? (
          <DialogContent className="md:min-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Placed Student Records</DialogTitle>
              <DialogDescription>
                Make changes to the student records and save in realtime.
              </DialogDescription>
            </DialogHeader>
            <CreateANewAdmissionForm
              onSubmitAction={handleUpdate}
              isPending={isPending}
              defaultValues={defaultValues}
              id={id}
            />
          </DialogContent>
        ) : (
          <DialogContent>
            <DialogHeader className="sr-only">
              <DialogTitle>Data Loading</DialogTitle>
              <DialogDescription>
                Kindly wait while data loads
              </DialogDescription>
            </DialogHeader>
            <ShowLoadingState />
          </DialogContent>
        )}
      </Dialog>
    </>
  );
};
