import { useTransition } from "react";
import { EditSingleStudentAttendanceType } from "@/lib/validation";
import { updateAttendance } from "@/app/(private)/(admin)/admin/attendance/actions/mutations";
import { toast } from "sonner";
import { useGenericDialog } from "@/hooks/use-open-create-teacher-dialog";

export const useUpdateSingleAttendance = () => {
  const [isPending, startTransition] = useTransition();
  const { onClose } = useGenericDialog();
  const handleUpdateSingleAttendance = async (
    values: EditSingleStudentAttendanceType
  ) => {
    startTransition(async () => {
      const result = await updateAttendance(values);
      if (result.error) {
        toast.error(result.error);
        return;
      }
      onClose("editAttendance");
      toast.success("Attendance record was updated");
    });
  };

  return { isPending, handleUpdateSingleAttendance };
};
