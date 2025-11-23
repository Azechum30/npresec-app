import { SettingsType } from "@/lib/validation";
import { useTransition, useState } from "react";
import { handleSettingsFormAction } from "../_actions/handle-settings-form-action";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";

export const useHandleSettingsFormSubmission = () => {
  const router = useRouter();
  const { setTheme } = useTheme();
  const [isPending, startTransition] = useTransition();
  const [isError, setIsError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSettingsFormSubmission = (data: SettingsType) => {
    startTransition(async () => {
      const { error, success } = await handleSettingsFormAction(data);
      if (error) {
        setIsError(error);
        setIsSuccess(false);
        return;
      }

      if (success) {
        setIsSuccess(true);
        setIsError("");

        // Apply theme immediately if it was changed
        if (data.theme) {
          setTheme(data.theme);
        }

        // Refresh router to update server components and user context
        router.refresh();
      }
    });
  };

  return { isPending, isError, isSuccess, handleSettingsFormSubmission };
};
