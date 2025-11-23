"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CreateStudentScoresForm } from "./create-students-scores-form";
import { useGenericDialog } from "@/hooks/use-open-create-teacher-dialog";
import { useFetchStudentsBaseOnQuery } from "../_hooks/use-fetch-students-base-on-query";
import { cn } from "@/lib/utils";
import { useHandleScoresCreation } from "../_hooks/use-handle-scores-creation";
import { useEffect, useRef } from "react";
import { toast } from "sonner";

export const CreateStudentsScoresDialog = () => {
  const { dialogs, onClose } = useGenericDialog();
  const { fetchError, students, isPending, setStudents } =
    useFetchStudentsBaseOnQuery();
  const {
    handleScoresCreation,
    isCreating,
    createError,
    createSuccess,
    createCount,
  } = useHandleScoresCreation();

  const prevCreationRef = useRef(false);
  const prevSuccessRef = useRef(false);
  useEffect(() => {
    const wasCreating = prevCreationRef.current;
    if (wasCreating && !isCreating && createError) {
      toast.error(createError);
    }
    prevCreationRef.current = isCreating;
  }, [isCreating, createError]);

  useEffect(() => {
    const wasSuccess = prevSuccessRef.current;
    if (wasSuccess && !isCreating && createSuccess) {
      toast.success(`${createCount} scores were created`);
      setTimeout(() => {
        onClose("create-students-scores");
        setStudents([]);
      }, 100);
    }
    prevSuccessRef.current = isCreating;
  }, [isCreating, createSuccess, createCount, onClose]);

  return (
    <Dialog
      open={dialogs["create-students-scores"] === true ? true : false}
      onOpenChange={() => onClose("create-students-scores")}>
      <DialogContent
        className={cn(
          "w-full md:max-w-4xl overflow-y-auto scrollbar-thin",
          students && students.length > 0 && "h-full"
        )}>
        <DialogHeader>
          <DialogTitle>Enter Scores</DialogTitle>
          <DialogDescription className="prose max-w-prose">
            Select the class, course, semester and academic year and filter to
            get students whose scores are not yet captured for the selected
            class and course!
          </DialogDescription>
        </DialogHeader>
        <CreateStudentScoresForm
          onSubmit={handleScoresCreation}
          students={students}
          fetchStudentsError={fetchError}
          isPending={isPending}
          isSubmitting={isCreating}
        />
      </DialogContent>
    </Dialog>
  );
};
