"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useGenericDialog } from "@/hooks/use-open-create-teacher-dialog";
import { AssessmentTimeline, Semester } from "@/lib/validation";
import { Loader } from "lucide-react";
import { startTransition, useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import { editAssessmentTimelineAction } from "../_actions/edit-assessment-timeline-action";
import { getAssessmentTimelineById } from "../_actions/get-assesment-timeline-by-id";
import { CreateAssessmentTimelineForm } from "../_forms/create-assessment-timeline-form";

export const EditAssessmentTimelineModal = () => {
  const { id, dialogs, onClose } = useGenericDialog();
  const [defaultValues, setDefaultValues] = useState<
    AssessmentTimeline | undefined
  >();

  const [isPending, startUpdateTransition] = useTransition();

  useEffect(() => {
    if (!id || !dialogs["edit-assessment-timeline"]) return;
    startTransition(async () => {
      const res = await getAssessmentTimelineById(id as string);

      if (res.error) {
        toast.error(res.error);
        return;
      }

      if (res.timeline) {
        setDefaultValues({
          ...res.timeline,
          semester: res.timeline.semester as (typeof Semester)[number],
        });
      }
    });
  }, [id, dialogs]);

  const handleAssessmentTimelineUpdate = (data: AssessmentTimeline) => {
    startUpdateTransition(async () => {
      const res = await editAssessmentTimelineAction(id as string, data);

      if (res.error) {
        toast.error(res.error);
        return;
      }

      if (res.success) {
        toast.success("Timeline updated successfully");
        setTimeout(() => onClose("edit-assessment-timeline"), 300);
      }
    });
  };

  console.log("Default values: ", defaultValues);

  return (
    <Dialog
      open={dialogs["edit-assessment-timeline"]}
      onOpenChange={() => onClose("edit-assessment-timeline")}>
      {id && dialogs["edit-assessment-timeline"] && defaultValues ? (
        <DialogContent className="max-h-full">
          <DialogHeader>
            <DialogTitle>Update Assessment Timeline</DialogTitle>
            <DialogDescription>
              Make changes to and save in real-time.
            </DialogDescription>
          </DialogHeader>
          <CreateAssessmentTimelineForm
            onSubmitAction={handleAssessmentTimelineUpdate}
            defaultValues={defaultValues}
            isPending={isPending}
            id={id}
          />
        </DialogContent>
      ) : (
        <DialogContent>
          <DialogHeader className="sr-only">
            <DialogTitle>Loading</DialogTitle>
            <DialogDescription>
              Kindly wait while the data loads
            </DialogDescription>
          </DialogHeader>
          <div className="flex w-full h-full items-center justify-center gap-3">
            <span>Data is loading...</span>
            <Loader className="size-6 animate-spin" />
          </div>
        </DialogContent>
      )}
    </Dialog>
  );
};
