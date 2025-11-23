"use client";
import { useAuth } from "@/components/customComponents/SessionProvider";
import { useHandleSettingsFormSubmission } from "../_hooks/use-handle-settings-form-submission";
import { SettingsForm } from "../forms/settings-form";
import { useEffect, useRef } from "react";
import { toast } from "sonner";
import {
  dateFormatOptions,
  itemsPerPageOptions,
  notificationFrequencyOptions,
  themeOptions,
  timezoneOptions,
} from "@/lib/validation";

type EmailNotifications = {
  grades: boolean;
  attendance: boolean;
  assignments: boolean;
  announcements: boolean;
  systemUpdates: boolean;
};

export const RenderSettingsForm = () => {
  const user = useAuth();

  const { isPending, isError, isSuccess, handleSettingsFormSubmission } =
    useHandleSettingsFormSubmission();
  const ErrorRef = useRef(false);
  const SuccessRef = useRef(false);

  useEffect(() => {
    const wasError = ErrorRef.current;

    if (wasError && !isPending && isError) {
      toast.error(isError);
      return;
    }
    ErrorRef.current = isPending;
  }, [isPending, isError]);

  useEffect(() => {
    const wasSuccess = SuccessRef.current;

    if (wasSuccess && !isPending && isSuccess) {
      toast.success("Settings updated successfully");
      return;
    }
    SuccessRef.current = isPending;
  }, [isPending, isSuccess]);

  if (!user) return null;

  const defaultValues = {
    subscribeToNewsletter: user.subscribeToOurNewsLetter || false,
    itemsPerPage:
      (user.itemsPerPage as (typeof itemsPerPageOptions)[number]) ||
      (10 as const),
    theme: (user.theme as (typeof themeOptions)[number]) || ("system" as const),
    dateFormat:
      (user.dateFormat as (typeof dateFormatOptions)[number]) ||
      ("DD/MM/YYYY" as const),
    emailNotifications: (user.emailNotifications as EmailNotifications) || {
      announcements: false,
      assignments: false,
      attendance: false,
      grades: false,
      systemUpdates: false,
    },
    notificationFrequency:
      (user.notificationFrequency as (typeof notificationFrequencyOptions)[number]) ||
      ("realtime" as const),
    compactMode: user.compactMode || false,
    showTips: user.showTips || false,
    timezone:
      (user.timezone as (typeof timezoneOptions)[number]["value"]) ||
      ("Africa/Accra" as const),
  };

  console.log(user.emailNotifications);
  return (
    <SettingsForm
      onSubmit={handleSettingsFormSubmission}
      isPending={isPending}
      defaultValues={defaultValues}
    />
  );
};
