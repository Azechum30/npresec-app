"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useGenericDialog } from "@/hooks/use-open-create-teacher-dialog";
import type { BulkAssessmentTimelinesType } from "@/lib/validation";
import { useBulkCreateAssessmentTimelinesMutationFn } from "../_actions/mutations";
import { SetAssessmentTimelinesForm } from "../_forms/bulk-set-assessment-timelines-form";

export const RenderBulkSetAssessmentTimelinesModal = () => {
  const { dialogs, onClose } = useGenericDialog();
  const { mutateAsync, isPending } =
    useBulkCreateAssessmentTimelinesMutationFn();

  const handleFormSubmission = async (data: BulkAssessmentTimelinesType) => {
    await Promise.try(async () => {
      await mutateAsync(data);
      onClose("bulk-set-assessment-timelines");
    });
  };

  const isOpen = !!dialogs["bulk-set-assessment-timelines"];

  return (
    <Dialog
      open={isOpen}
      onOpenChange={() => onClose("bulk-set-assessment-timelines")}>
      {isOpen && (
        <DialogContent className="max-h-full">
          <DialogHeader>
            <DialogTitle>Bulk Set Assessment Timelines</DialogTitle>
            <DialogDescription>
              Fill the form to bulk set timelines for score entry for an
              assessment mode for multiple courses
            </DialogDescription>
          </DialogHeader>

          <SetAssessmentTimelinesForm
            onSubmitAction={handleFormSubmission}
            isPending={isPending}
          />
        </DialogContent>
      )}
    </Dialog>
  );
};
