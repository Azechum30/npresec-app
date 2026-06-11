import { DateFormatType } from "@/lib/validation";
import { formatOrEmpty } from "@/utils/format-or-empty";
import { toProperCase } from "@/utils/string-transformer";
import { TServiceOutput } from "../_components/render-services-tb";

export const serviceDataTransformer =
  (formatType: DateFormatType) => (service: TServiceOutput) => ({
    Name: service.name,
    Price: service.price,
    Status: toProperCase(service.status),
    Capacity: service.capacity,
    Period: service.academicYear,
    PaymentCount: service.count,
    Deadline: formatOrEmpty(service.deadline, formatType),
  });
