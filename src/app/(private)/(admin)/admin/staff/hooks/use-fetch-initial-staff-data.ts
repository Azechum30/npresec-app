import { useGenericDialog } from "@/hooks/use-open-create-teacher-dialog";
import { useEffect, useState } from "react";
import { getStaffMember } from "../actions/server";
import { StaffType } from "@/lib/validation";

export const useFetchInitialStaffData = () => {
  const [values, setValues] = useState<StaffType | undefined>();
  const [fetchError, setFetchError] = useState("");
  const [fetchSucess, setFetchSuccess] = useState(false);
  const { id, dialogs } = useGenericDialog();

  const isEditOpen = dialogs["editStaff"] === true;

  useEffect(() => {
    if (!isEditOpen || !id) return;

    const fetchStaffData = async () => {
      const res = await getStaffMember(id as string);

      if (res.error) {
        setFetchError(res.error || "Failed to fetch staff data");
        setFetchSuccess(false);
        setValues(undefined);
        return;
      }
      if (res.staff === undefined) {
        setFetchError("");
        setFetchSuccess(false);
        setValues(undefined);
        return;
      }

      setFetchError("");
      setFetchSuccess(true);
      const { staff } = res;

      setValues({
        ...staff,
        firstName: staff.firstName,
        lastName: staff.lastName,
        middleName: staff.middleName,
        birthDate: staff.birthDate,
        staffType: staff.staffType,
        staffCategory: staff.staffCategory,
        gender: staff.gender,
        dateOfFirstAppointment:
          (staff.dateOfFirstAppointment as Date) || undefined,
        employeeId: staff.employeeId,
        username: staff.user?.username as string,
        email: staff.user?.email as string,
        maritalStatus: staff.maritalStatus,
        phone: staff.phone,
        departmentId: staff.departmentId,
        classes: staff.classes.map((cls) => cls.id) || [],
        courses: staff.courses.map((crs) => crs.id) || [],
        imageURL: staff.user?.image || "",
        licencedNumber: staff.licencedNumber || "",
        ssnitNumber: staff.ssnitNumber || "",
        ghcardNumber: staff.ghcardNumber || "",
        isDepartmentHead:
          staff.departmentHead?.headId !== undefined ? true : false,
        academicQual: staff.academicQual || "",
        rank: staff.rank || "",
        rgNumber: staff.rgNumber || "",
      });
    };

    fetchStaffData();
  }, [id, isEditOpen]);

  return { values, fetchError, fetchSucess };
};
