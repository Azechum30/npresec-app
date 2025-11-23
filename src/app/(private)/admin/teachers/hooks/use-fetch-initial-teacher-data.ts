import { useGenericDialog } from "@/hooks/use-open-create-teacher-dialog";
import { useEffect, useState } from "react";
import { getTeacher } from "../actions/server";
import { TeacherType } from "@/lib/validation";

export const useFetchInitialTeacherData = () => {
  const [values, setValues] = useState<TeacherType | undefined>();
  const [fetchError, setFetchError] = useState("");
  const [fetchSucess, setFetchSuccess] = useState(false);
  const { id, dialogs } = useGenericDialog();

  const isEditOpen = dialogs["editTeacher"] === true;

  useEffect(() => {
    if (!isEditOpen) {
      setValues(undefined);
      return;
    }
    const fetchTeacherData = async () => {
      const res = await getTeacher(id as string);

      if (res.error) {
        setFetchError(res.error || "Failed to fetch teacher data");
        setFetchSuccess(false);
        return;
      }
      if (res.teacher === undefined) {
        setFetchError("");
        setFetchSuccess(false);
        return;
      }

      setFetchError("");
      setFetchSuccess(true);
      const { teacher } = res;

      setValues({
        ...teacher,
        firstName: teacher.firstName,
        lastName: teacher.lastName,
        middleName: teacher.middleName,
        birthDate: teacher.birthDate,
        gender: teacher.gender,
        dateOfFirstAppointment:
          (teacher.dateOfFirstAppointment as Date) || undefined,
        employeeId: teacher.employeeId,
        username: teacher.user?.username as string,
        email: teacher.user?.email as string,
        maritalStatus: teacher.maritalStatus,
        phone: teacher.phone,
        departmentId: teacher.departmentId,
        classes: teacher.classes.map((cls) => cls.id) || [],
        courses: teacher.courses.map((crs) => crs.id) || [],
        imageURL: teacher.user?.picture || "",
        licencedNumber: teacher.licencedNumber || "",
        ssnitNumber: teacher.ssnitNumber || "",
        ghcardNumber: teacher.ghcardNumber || "",
        isDepartmentHead:
          teacher.departmentHead?.headId !== undefined ? true : false,
        academicQual: teacher.academicQual || "",
        rank: teacher.rank || "",
        rgNumber: teacher.rgNumber || "",
      });
    };

    if (id) {
      setValues(undefined);
      fetchTeacherData();
    }
  }, [id]);

  return { values, fetchError, fetchSucess };
};
