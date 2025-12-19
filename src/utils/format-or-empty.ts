import { formatDate } from "@/lib/format-date";
import { DateFormatType } from "@/lib/validation";

export const formatOrEmpty = (
  value: Date | string | null,
  dateFormat: DateFormatType
) => (value ? formatDate(value, dateFormat) : "");
