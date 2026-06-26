/**biome-ignore-all assist/source/organizeImports: reason */
import { DotMatrixLoader } from "@/components/customComponents/dot-matrix-loader";
import { getQueryClient } from "@/components/providers/get-query-client";
import type { Metadata } from "next";
import { connection } from "next/server";
import { Suspense } from "react";
import { getStudent } from "../../actions/action";
import { studentsQueryOptions } from "../../actions/queries";
import StudentOnboardingNavbar from "../../components/studentsOnboardingNavbar";
import { ViewStudentDetails } from "./view-student-details";
type Params = {
  params: Promise<{ id: string }>;
};

export const generateStateParams = async () => {
  const queryClient = getQueryClient();
  const { students } = await queryClient.ensureQueryData(studentsQueryOptions);
  return students.map(({ id }) => id).slice(100);
};

export const generateMetadata = async ({
  params,
}: Params): Promise<Metadata> => {
  await connection();
  const { id } = await params;
  const result = await getStudent(id);

  if (result.student) {
    return {
      title: {
        absolute: `Student | ${result.student.lastName} ${result.student.firstName}`,
      },
      description: `Profile details of ${result.student.lastName} ${result.student.firstName} ${result.student.middleName}`,
    };
  } else {
    return {
      title: "Error",
      description: "Student not found",
    };
  }
};
export default function StudentEditPage(params: Params) {
  return (
    <div className="flex flex-col md:flex-row gap-4">
      <StudentOnboardingNavbar className=" bg-background flex-1 sticky top-16 max-h-[85vh] mb-10 md:mb-0 p-4  rounded-md border shadow-2xl" />

      <Suspense fallback={<DotMatrixLoader />}>
        <ViewStudentDetails params={params.params} />
      </Suspense>
    </div>
  );
}
