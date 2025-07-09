import { AttendanceResponseType } from "@/lib/types";
import moment from "moment";

export const attendanceTransformer =(attendance: AttendanceResponseType)=>({
	"Student ID": attendance.student.studentNumber,
	"Full Name":   `${attendance.student.lastName} ${attendance.student.firstName}`,
	"Class": attendance.class.name,
	"Date": moment(attendance.date).format("MM/DD/YYYY"),
	Status: attendance.status,
})