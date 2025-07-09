'use client'
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogClose, DialogDescription, DialogTitle} from "@/components/ui/dialog"
import { useGenericDialog } from "@/hooks/use-open-create-teacher-dialog";
import { useEffect, useState } from "react";
import { SingleStudentAttendance } from "@/lib/validation";
import {
	MarkSingleStudentAttendanceForm
} from "@/app/(private)/admin/attendance/forms/mark-single-student-attendance-form";
import { getSingleAttendance } from "@/app/(private)/admin/attendance/actions/queries";
import LoadingState from "@/components/customComponents/Loading";
import { useUpdateSingleAttendance } from "@/app/(private)/admin/attendance/hooks/use-update-single-attendance";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";


export const EditAttendanceDialog = ( ) => {
	const {id, dialogs, onClose} = useGenericDialog();
	const [attendanceResult, setAttendanceResult] = useState<SingleStudentAttendance | undefined>();


	useEffect( () => {
		const fetchAttendance = async()=>{
			const result = await getSingleAttendance(id as string);
			if(result.error){
				return <Dialog>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Error</DialogTitle>
							<DialogDescription>{result.error}</DialogDescription>
						</DialogHeader>
					</DialogContent>
				</Dialog>
			}

			if(result.attendance){
				const {classId, date, status, semester, studentId, } = result.attendance
				setAttendanceResult({
					classId,
					date,
					status,
					studentId,
					semester: semester as string,
				})
			}


		}

		if(id){
			setAttendanceResult(undefined);
			fetchAttendance().then((value)=>console.log("fetched attendance"));
		}
	}, [id, setAttendanceResult] );

	const {isPending, handleUpdateSingleAttendance} = useUpdateSingleAttendance()


	return (
		<Dialog open={dialogs["editAttendance"]} onOpenChange={() => onClose("editAttendance")}>
			{attendanceResult ? (
				<DialogContent className="w-full max-h-[85vh] overflow-auto scrollbar-thin">
					<DialogHeader>
						<DialogTitle>Edit Attendance</DialogTitle>
						<DialogDescription>
							Kindly edit the attendance for the selected class and date
						</DialogDescription>
					</DialogHeader>
					<MarkSingleStudentAttendanceForm
						onSubmitAction={async ( values)=>await handleUpdateSingleAttendance({ id:id as string, data: values})} defaultValues={attendanceResult} id={id}
						isPending={isPending}
					/>
					<DialogFooter>
						<DialogClose className={cn(buttonVariants({variant: "secondary"}), "w-full")} >Cancel
						</DialogClose>
					</DialogFooter>
				</DialogContent>
			): <DialogContent>
				<DialogHeader className="sr-only">
					<DialogTitle>Loading</DialogTitle>
					<DialogDescription>Data is loading...</DialogDescription>
				</DialogHeader>
				<LoadingState />
			</DialogContent>
			}
		</Dialog>
	)
}