"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useGenericDialog } from "@/hooks/use-open-create-teacher-dialog";
import type { AssessmentTimeline } from "@/lib/validation";
import { useCreateAssessmentTimelineMutationFn } from "../_actions/mutations";
import { CreateAssessmentTimelineForm } from "../_forms/create-assessment-timeline-form";

export const RenderCreateAssessmentTimelineModal = () => {
  const { dialogs, onClose } = useGenericDialog();

  const { isPending, mutateAsync } = useCreateAssessmentTimelineMutationFn();

  const handleAssessmentTimelineCreation = async (data: AssessmentTimeline) => {
    await Promise.try(async () => {
      await mutateAsync(data);
      onClose("create-assessment-timeline");
    });
  };

  const isOpen = !!dialogs["create-assessment-timeline"];

  return (
    <Dialog
      open={isOpen}
      onOpenChange={() => onClose("create-assessment-timeline")}>
      {isOpen && (
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
