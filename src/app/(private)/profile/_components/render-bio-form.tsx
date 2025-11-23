"use client";

import { useAuth } from "@/components/customComponents/SessionProvider";
import { BioForm } from "../forms/bio-form";
import { useHandleBioFormSubmission } from "../_hooks/use-handle-bio-form-submission";
import { useEffect, useRef } from "react";
import { toast } from "sonner";

export const RenderBioForm = () => {
  const user = useAuth();

  const { isPending, isError, isSuccess, handleBioFormSubmission } =
    useHandleBioFormSubmission();

  const errorRef = useRef(false);
  const successRef = useRef(false);

  useEffect(() => {
    const wasError = errorRef.current;

    if (wasError && !isPending && isError) {
      toast.error(isError);
      return;
    }
    errorRef.current = isPending;
  }, [isPending, isError]);

  useEffect(() => {
    const wasSuccess = successRef.current;

    if (wasSuccess && !isPending && isSuccess) {
      toast.success("Profile updated successfully");
      return;
    }
    successRef.current = isPending;
  }, [isPending, isSuccess]);

  if (!user) return null;

  const defaultValues = {
    username: user.username,
    role: user?.role?.name.toUpperCase() || "",
    email: user.email,
    picture: user.picture || "",
    fullName: user.name || "",
    bio: user.bio || "",
    subscribeToNewsletter: user.subscribeToOurNewsLetter || false,
    social: {
      x: user.xUrl || "",
      linkedIn: user.linkedInUrl || "",
      github: "",
      facebook: user.facebookUrl || "",
      instagram: user.instagramUrl || "",
    },
  };
  return (
    <BioForm
      onSubmit={handleBioFormSubmission}
      defaultValues={defaultValues}
      isPending={isPending}
    />
  );
};
