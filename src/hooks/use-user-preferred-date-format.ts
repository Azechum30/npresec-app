import { useAuth } from "@/components/customComponents/SessionProvider";
import { useMemo } from "react";
import { formatMap, localeMap } from "@/lib/constants";
import { dateFormatOptions } from "@/lib/validation";

export const useUserPreferredDateFormat = () => {
  const user = useAuth();

  const preferredDateFormat = useMemo(() => {
    if (
      user?.dateFormat &&
      dateFormatOptions.includes(
        user.dateFormat as (typeof dateFormatOptions)[number]
      )
    ) {
      return user.dateFormat as (typeof dateFormatOptions)[number];
    }
    return "DD/MM/YYYY";
  }, [user?.dateFormat]);

  const formatDate = (date: Date) => {
    const locals = localeMap[preferredDateFormat];
    const options = formatMap[preferredDateFormat];
    return new Intl.DateTimeFormat(locals, options).format(date);
  };

  return { preferredDateFormat, formatDate };
};
