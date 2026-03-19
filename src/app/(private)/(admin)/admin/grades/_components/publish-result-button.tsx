"use client";

import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { publishSemesterGrades } from "../_actions/publish-semester-grades";

export const PublishResultsButton = () => {
  const searchParams = useSearchParams();

  const classId = searchParams.get("classId");
  const academicYear = searchParams.get("academicYear");
  const semester = searchParams.get("semester");

  const isMatch = !!(classId && academicYear && semester);

  const [state, formAction, isPending] = useActionState(publishSemesterGrades, {
    success: false,
    error: "",
  });

  useEffect(() => {
    if (state.error) {
      toast.error(state.error);
      state.error = "";
    }
    if (state.success) {
      toast.success("Grades are published successfully");
      state.success = false;
    }
  }, [state]);

  return (
    <form action={formAction}>
      <input type="hidden" name="classId" value={classId ?? ""} />
      <input type="hidden" name="academicYear" value={academicYear ?? ""} />
      <input type="hidden" name="semester" value={semester ?? ""} />

      <Button
        className="w-full"
        type="submit"
        disabled={!isMatch || isPending}
        size="lg">
        <Send className="size-5" />
        {isPending ? "Publishing..." : "Publish Class Grades"}
      </Button>
    </form>
  );
};
