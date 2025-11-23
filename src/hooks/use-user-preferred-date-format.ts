import { useAuth } from "@/components/customComponents/SessionProvider";
import { useMemo } from "react";

const dateFormatOptions = [
  "DD/MM/YYYY",
  "MM/DD/YYYY",
  "YYYY-MM-DD",
  "DD MMM YYYY",
];

export const useUserPreferredDateFormat = () => {
  const user = useAuth();
  const preferredDateFormat = useMemo(() => {
    if (
      user &&
      user.dateFormat &&
      dateFormatOptions.includes(user.dateFormat)
    ) {
      return user.dateFormat;
    }
    return "DD/MM/YYYY";
  }, [user?.dateFormat]);

  return preferredDateFormat;
};
