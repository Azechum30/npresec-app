// import { updateAttendance } from "@/app/(private)/(admin)/admin/attendance/actions/actions";
// import { useGenericDialog } from "@/hooks/use-open-create-teacher-dialog";
// import { EditSingleStudentAttendanceType } from "@/lib/validation";
// import { useTransition } from "react";
// import { toast } from "sonner";

// export const useUpdateSingleAttendance = () => {
//   const [isPending, startTransition] = useTransition();
//   const { onClose } = useGenericDialog();
//   const handleUpdateSingleAttendance = async (
//     values: EditSingleStudentAttendanceType,
//   ) => {
//     startTransition(async () => {
//       const result = await updateAttendance(values);
//       if (result.error) {
//         toast.error(result.error);
//         return;
//       }
//       onClose("editAttendance");
//       toast.success("Attendance record was updated");
//     });
//   };

//   return { isPending, handleUpdateSingleAttendance };
// };
