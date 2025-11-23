"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { getStudentTranscriptsAction } from "../_actions/generate-transcript-action";

export const useFetchTranscripts = (studentId: string | null) => {
  const [transcripts, setTranscripts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!studentId) {
      setTranscripts([]);
      return;
    }

    const fetchTranscripts = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await getStudentTranscriptsAction(studentId);

        if (result.error) {
          setError(result.error);
          toast.error(result.error);
          return;
        }

        if (result.transcripts) {
          setTranscripts(result.transcripts);
        }
      } catch (err) {
        const errorMessage = "Failed to fetch transcripts";
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTranscripts();
  }, [studentId]);

  return {
    transcripts,
    isLoading,
    error,
  };
};


