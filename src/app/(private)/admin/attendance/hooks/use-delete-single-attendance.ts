import {useTransition} from 'react';
import {toast} from 'sonner';
import { deleteAttendance } from "@/app/(private)/admin/attendance/actions/mutations";

export const useDeleteSingleAttendance=()=>{
	const [isPending, startTransition] = useTransition();
	const handleDeleteSingleAttendance = async(id:string)=>{
		startTransition(async()=>{
			const result = await deleteAttendance(id);
			if(result.error){
				toast.error(result.error);
				return;
			}
			toast.success("Attendance record was deleted");
		})
	}

	return {isPending, handleDeleteSingleAttendance}
}