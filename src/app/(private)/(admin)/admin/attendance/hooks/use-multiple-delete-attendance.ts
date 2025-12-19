import { useTransition } from "react";
import { toast } from "sonner";
import { deleteMultipleAttendance } from "@/app/(private)/(admin)/admin/attendance/actions/mutations";

export const useMultipleDeleteAttendance = () => {
  const [isPending, startTransition] = useTransition();
  const handleMultipleDeleteAttendance = async (ids: string[]) => {
    startTransition(async () => {
      const result = await deleteMultipleAttendance(ids);
      if (result.error) {
        toast.error(result.error);
        return;
      }
      toast.success(`${result.count} attendance records were deleted`);
    });
  };

  return { isPending, handleMultipleDeleteAttendance };
};
