"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useGenericDialog } from "@/hooks/use-open-create-teacher-dialog";
import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { useFetchStudentsBaseOnQuery } from "../_hooks/use-fetch-students-base-on-query";
import { useHandleScoresCreation } from "../_hooks/use-handle-scores-creation";
import { CreateStudentScoresForm } from "./create-students-scores-form";

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
  }, [isCreating, createSuccess, createCount, onClose, setStudents]);

  const handleClose = () => {
    const params = new URLSearchParams(window.location.search);
    params.delete("classID");
    params.delete("courseID");
    params.delete("semester");
    params.delete("academicYear");
    params.delete("assessmentType");
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.pushState({}, "", newUrl);
    onClose("create-students-scores");
  };

  return (
    <Dialog
      open={dialogs["create-students-scores"] === true ? true : false}
      onOpenChange={() => handleClose()}>
      <DialogContent className={cn("max-h-full w-full md:max-w-5xl")}>
        <DialogHeader>
          <DialogTitle>Capture Assessment Scores</DialogTitle>
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
