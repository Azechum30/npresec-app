"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useGenericDialog } from "@/hooks/use-open-create-teacher-dialog";
import { BulkAssessmentTimelinesType } from "@/lib/validation";
import { useTransition } from "react";
import { toast } from "sonner";
import { bulkAssessmentTimelinesAction } from "../_actions/bulk-create-assessment-timelines";
import { SetAssessmentTimelinesForm } from "../_forms/bulk-set-assessment-timelines-form";

export const RenderBulkSetAssessmentTimelinesModal = () => {
  const { dialogs, onClose } = useGenericDialog();

  const [isPending, startTranstion] = useTransition();

  const handleFormSubmission = (data: BulkAssessmentTimelinesType) => {
    startTranstion(async () => {
      const res = await bulkAssessmentTimelinesAction(data);

      if (res?.error) {
        toast.error(res.error);
        return;
      }

      if (res.count) {
        toast.success(`${res.count} record(s) added successfully`);
        setTimeout(() => onClose("bulk-set-assessment-timelines"), 300);
      }
    });
  };

  return (
    <Dialog
      open={dialogs["bulk-set-assessment-timelines"]}
      onOpenChange={() => onClose("bulk-set-assessment-timelines")}>
      {dialogs["bulk-set-assessment-timelines"] && (
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
