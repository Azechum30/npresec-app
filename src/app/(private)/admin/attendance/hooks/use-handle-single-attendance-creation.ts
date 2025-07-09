import { useTransition } from "react";
import { SingleStudentAttendance } from "@/lib/validation";
import { createSingleAttendance } from "@/app/(private)/admin/attendance/actions/mutations";
import { toast } from "sonner";
import { useGenericDialog } from "@/hooks/use-open-create-teacher-dialog";

export const useHandleSingleAttendanceCreation = () => {
	const [isPending, startTransition] = useTransition();
	const {onClose} = useGenericDialog()

	const handleSingleAttendanceCreation = async(data: SingleStudentAttendance) => {
		startTransition(async()=>{
			const response = await createSingleAttendance(data);

			if(response.error){
				toast.error(response.error)
				return;
			}

			if(!response.attendance){
				toast("Still saving attendance records")
				return;
			}
			onClose("createSingleAttendance")
			toast.success("Attendance record was recorded");
		})
	}

	return { handleSingleAttendanceCreation, isPending };
}