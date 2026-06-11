"use client";

import OpenDialogs from "@/components/customComponents/OpenDialogs";
import { useSystemWideActionsStore } from "@/hooks/use-system-wide-actions-store";

export const ShowAddScoresButton = () => {
  const enabled = useSystemWideActionsStore(
    (s) => s.settings?.enableScoresEntry,
  );

  if (enabled) {
    return (
      <OpenDialogs title="Add New Scores" dialogKey="create-students-scores" />
    );
  }
  return null;
};
