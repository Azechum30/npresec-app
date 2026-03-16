"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useGenericDialog } from "@/hooks/use-open-create-teacher-dialog";
import { AssessmentTimeline } from "@/lib/validation";
import { useTransition } from "react";
import { toast } from "sonner";
import { createAssessmentTimeline } from "../_actions/create-timeline-action";
import { CreateAssessmentTimelineForm } from "../_forms/create-assessment-timeline-form";

export const RenderCreateAssessmentTimelineModal = () => {
  const { dialogs, onClose } = useGenericDialog();
  const [isPending, startTransition] = useTransition();

  const handleAssessmentTimelineCreation = (data: AssessmentTimeline) => {
    startTransition(async () => {
      const result = await createAssessmentTimeline(data);

      if (result.error) {
        toast.error(result.error);
        return;
      }

      if (result.success) {
        toast.success("Assessment timeline created successfully!");

        setTimeout(() => onClose("create-assessment-timeline"), 300);
      }
    });
  };

  return (
    <Dialog
      open={dialogs["create-assessment-timeline"]}
      onOpenChange={() => onClose("create-assessment-timeline")}>
      {dialogs["create-assessment-timeline"] && (
        <DialogContent className="max-h-full">
          <DialogHeader>
            <DialogTitle>Create an Assessment Timeline</DialogTitle>
            <DialogDescription>
              Kindly fill the form to create an assessment timeline.
            </DialogDescription>
          </DialogHeader>
          <CreateAssessmentTimelineForm
            onSubmitAction={handleAssessmentTimelineCreation}
            isPending={isPending}
          />
        </DialogContent>
      )}
    </Dialog>
  );
};
