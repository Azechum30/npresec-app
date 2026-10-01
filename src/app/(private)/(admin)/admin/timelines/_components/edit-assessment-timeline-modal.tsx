/** biome-ignore-all assist/source/organizeImports:reason */
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
import { useQuery } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import { useUpdateAssessmentTimelineMutationFn } from "../_actions/mutations";
import { getTimelimeQueryOptions } from "../_actions/queries";
import { CreateAssessmentTimelineForm } from "../_forms/create-assessment-timeline-form";

export const EditAssessmentTimelineModal = () => {
  const { id, dialogs, onClose } = useGenericDialog();
  const { mutateAsync, isPending } = useUpdateAssessmentTimelineMutationFn(
    id as string,
  );

  const isOpen = !!dialogs["edit-assessment-timeline"];
  const validId = id ?? null;

  const { data } = useQuery({
    ...getTimelimeQueryOptions(validId as string),
    enabled: isOpen && !!validId,
  });

  const handleAssessmentTimelineUpdate = async (data: AssessmentTimeline) => {
    await Promise.try(async () => {
      await mutateAsync({ id: validId as string, values: data });
      onClose("edit-assessment-timeline");
    });
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={() => onClose("edit-assessment-timeline")}>
      {id && isOpen && data ? (
        <DialogContent className="max-h-full">
          <DialogHeader>
            <DialogTitle>Update Assessment Timeline</DialogTitle>
            <DialogDescription>
              Make changes to and save in real-time.
            </DialogDescription>
          </DialogHeader>
          <CreateAssessmentTimelineForm
            onSubmitAction={handleAssessmentTimelineUpdate}
            defaultValues={{
              ...data,
              semester: data.semester as "First" | "Second",
            }}
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
