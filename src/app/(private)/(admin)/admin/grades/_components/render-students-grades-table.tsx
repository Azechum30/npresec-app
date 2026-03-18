"use client";
import DataTable from "@/components/customComponents/data-table";
import { ErrorComponent } from "@/components/customComponents/ErrorComponent";
import { Notification } from "@/components/customComponents/notification";
import { getStudentGrades } from "../_actions/get-student-grades";
import { useGetStudentsGradesColumns } from "../_hooks/use-get-students-grades-columns";
import { StudentGradesSummaryDetail } from "./StudentGradesSummaryDetail";

type Props = {
  data?: Awaited<ReturnType<typeof getStudentGrades>>["grades"];
  error?: string;
};
export const RenderStudentsGradesTable = (props: Props) => {
  const columns = useGetStudentsGradesColumns();

  return (
    <>
      {props.error && <ErrorComponent error={props.error} />}
      {props.data ? (
        <DataTable
          columns={columns}
          data={props.data}
          renderSubComponent={(row) => <StudentGradesSummaryDetail row={row} />}
        />
      ) : (
        <div className="mt-10">
          <Notification description="Kindly select the required filters and get data returned to you base on your." />
        </div>
      )}
    </>
  );
};
