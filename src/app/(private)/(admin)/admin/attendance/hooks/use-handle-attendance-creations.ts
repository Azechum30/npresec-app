import { BulkAttendanceType } from "@/lib/validation";
import { useTransition } from "react";
import { createAttendance } from "@/app/(private)/(admin)/admin/attendance/actions/mutations";
import { toast } from "sonner";
import { useGenericDialog } from "@/hooks/use-open-create-teacher-dialog";

export const useHandleAttendanceCreations = () => {
  const [isPending, startTransition] = useTransition();
  const { onClose } = useGenericDialog();

  const handleAttendanceCreations = async (data: BulkAttendanceType) => {
    startTransition(async () => {
      const response = await createAttendance(data);
      if (response.error) {
        toast.error(response.error);
        return;
      }
      onClose("createAttendance");
      toast.success(`${response?.count} attendance records were recorded`);
    });
  };

  return { handleAttendanceCreations, isPending };
};
