import moment from "moment";
import { DateFormatType } from "./validation";

export const formatDate = (
  date: Date | string,
  userPreferredDateFormat: DateFormatType
) => {
  const momentDate = moment(date);

  switch (userPreferredDateFormat) {
    case "DD/MM/YYYY":
      return momentDate.format("DD/MM/YYYY");
    case "MM/DD/YYYY":
      return momentDate.format("MM/DD/YYYY");
    case "YYYY-MM-DD":
      return momentDate.format("YYYY-MM-DD");
    case "DD MMM YYYY":
      return momentDate.format("DD MMM YYYY");
    default:
      return momentDate.format("DD/MM/YYYY");
  }
};
