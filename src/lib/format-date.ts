import { DateFormatType } from "./validation";
import { formatMap } from "./constants";
import { localeMap } from "./constants";

export const formatDate = (
  date: Date | string,
  userPreferredDateFormat: DateFormatType
) => {
  const newDate = new Date(date);

  const options = formatMap[userPreferredDateFormat];
  const locale = localeMap[userPreferredDateFormat] || "en-GB";

  return new Intl.DateTimeFormat(locale, options).format(newDate);
};
