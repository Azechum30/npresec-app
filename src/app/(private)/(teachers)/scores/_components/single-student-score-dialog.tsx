"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SingleStudentScoreForm } from "../_forms/single-student-score-form";
import { useGenericDialog } from "@/hooks/use-open-create-teacher-dialog";
import { useFetchStudentScore } from "../_hooks/use-fetch-student-score";
import LoadingState from "@/components/customComponents/Loading";
import { useHandleStudentScoreUpdate } from "../_hooks/use-handle-student-score-update";
import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { ErrorComponent } from "@/components/customComponents/ErrorComponent";

export const SingleStudentScoreDialog = () => {
  const { id, dialogs, onClose } = useGenericDialog();
  const { studentScore, fetchError, fetchSuccess, isPending } =
    useFetchStudentScore();
  const { handleStudentScoreUpdate, isUpdating, updateError, updateSuccess } =
    useHandleStudentScoreUpdate();

  const prevUpdateErrorRef = useRef(false);
  const prevUpdateSuccessRef = useRef(false);

  useEffect(() => {
    const wasUpdating = prevUpdateErrorRef.current;
    if (wasUpdating && !isUpdating && updateError) {
      toast.error(updateError);
    }
    prevUpdateErrorRef.current = isUpdating;
  }, [isUpdating, updateError]);

  useEffect(() => {
    const wasSuccess = prevUpdateSuccessRef.current;
    if (wasSuccess && !isUpdating && updateSuccess) {
      toast.success("Student score updated successfully");

      setTimeout(() => {
        onClose("edit-student-score");
      }, 100);
    }
    prevUpdateSuccessRef.current = isUpdating;
  }, [isUpdating, updateSuccess, onClose]);

  const defaultValues = studentScore
    ? {
        classId: studentScore.student?.currentClass?.id ?? "",
        courseId: studentScore.courseId ?? "",
        semester: studentScore.semester ?? undefined,
        academicYear: studentScore.academicYear,
        assessmentType: studentScore.assessmentType ?? undefined,
        maxScore: studentScore.maxScore ?? 0,
        weight: studentScore.weight ?? 1,
        studentId: studentScore.studentId ?? "",
        score: studentScore.score ?? 0,
        studentName:
          studentScore.student?.firstName +
          " " +
          studentScore.student?.lastName,
      }
    : undefined;

  if (isPending) {
    return <LoadingState />;
  }

  return (
    <>
      <Dialog
        open={dialogs["edit-student-score"] === true ? true : false}
        onOpenChange={() => onClose("edit-student-score")}>
        <DialogContent className="w-full h-full md:max-h-[85vh] overflow-auto scrollbar-thin">
          <DialogHeader>
            <DialogTitle>Update Student Score</DialogTitle>
            <DialogDescription>
              Kindly update the student score by filling the form and saving!
            </DialogDescription>
          </DialogHeader>
          {updateError && <ErrorComponent error={updateError} />}
          <SingleStudentScoreForm
            onSubmitAction={handleStudentScoreUpdate}
            id={id as string}
            defaultValues={defaultValues}
            isPending={isUpdating}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};
