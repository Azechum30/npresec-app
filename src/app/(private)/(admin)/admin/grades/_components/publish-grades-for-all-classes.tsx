"use client";

import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { publishGradesForAllClassesAction } from "../_actions/publish-grades-for-all-classes-action";

export const PublishGradesForAllClassess = () => {
  const searchParams = useSearchParams();

  const academicYear = searchParams.get("academicYear");
  const semester = searchParams.get("semester");

  const isMatch = !!(academicYear && semester);

  const [state, formAction, isPending] = useActionState(
    publishGradesForAllClassesAction,
    {
      success: false,
      error: "",
    },
  );

  useEffect(() => {
    if (state.error) toast.error(state.error);
    if (state.success) toast.success("Grades are published successfully");
  }, [state]);

  return (
    <form action={formAction}>
      <input type="hidden" name="academicYear" value={academicYear ?? ""} />
      <input type="hidden" name="semester" value={semester ?? ""} />

      <Button
        variant="outline"
        className="w-full"
        type="submit"
        disabled={!isMatch || isPending}
        size="lg">
        <Send className="size-5" />
        {isPending ? "Publishing..." : "Publish All Classes Grades"}
      </Button>
    </form>
  );
};
