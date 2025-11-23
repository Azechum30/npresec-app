"use client";

import { useState } from "react";
import { toast } from "sonner";
import { previewTranscriptAction } from "../_actions/generate-transcript-action";
import { GenerateTranscriptType } from "@/lib/validation";

export const usePreviewTranscript = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const previewTranscript = async (values: GenerateTranscriptType) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await previewTranscriptAction(values);

      if (result.error) {
        setError(result.error);
        toast.error(result.error);
        return { success: false, error: result.error };
      }

      return {
        success: true,
        student: result.student,
        transcriptData: result.transcriptData,
        gpa: result.gpa,
        totalCredits: result.totalCredits,
        academicYear: result.academicYear,
        semester: result.semester,
      };
    } catch (err) {
      const errorMessage = "Failed to preview transcript";
      setError(errorMessage);
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    previewTranscript,
    isLoading,
    error,
  };
};


