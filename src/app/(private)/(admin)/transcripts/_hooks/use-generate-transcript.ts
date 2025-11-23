"use client";

import { useState } from "react";
import { toast } from "sonner";
import { generateTranscriptAction } from "../_actions/generate-transcript-action";
import { GenerateTranscriptType } from "@/lib/validation";

export const useGenerateTranscript = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateTranscript = async (values: GenerateTranscriptType) => {
    setIsGenerating(true);
    setError(null);

    try {
      const result = await generateTranscriptAction(values);

      if (result.error) {
        setError(result.error);
        toast.error(result.error);
        return { success: false, error: result.error };
      }

      if (result.transcript) {
        toast.success("Transcript generated successfully!");
        return { success: true, transcript: result.transcript };
      }

      return { success: false, error: "Unknown error occurred" };
    } catch (err) {
      const errorMessage = "Failed to generate transcript";
      setError(errorMessage);
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    generateTranscript,
    isGenerating,
    error,
  };
};


