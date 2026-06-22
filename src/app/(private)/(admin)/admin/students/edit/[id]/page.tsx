/**biome-ignore-all assist/source/organizeImports: reason */
import { FallbackComponent } from "@/components/customComponents/fallback-component";
import { getQueryClient } from "@/components/providers/get-query-client";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import type { Metadata } from "next";
import { connection } from "next/server";
import { Suspense } from "react";
import { getStudent } from "../../actions/action";
import { getStudentQueryOptions } from "../../actions/queries";
import { RenderStudentEdit } from "../../components/RenderStudentEdit";
import StudentOnboardingNavbar from "../../components/studentsOnboardingNavbar";
type Params = {
  params: Promise<{ id: string }>;
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
    };
  } else {
    return {
      title: "Error",
      description: "Student not found",
    };
  }
};
export default async function StudentEditPage(params: Params) {
  const { id } = await params.params;
  const queryClient = getQueryClient();

  await queryClient.ensureQueryData(getStudentQueryOptions(id));

  return (
    <div className="flex flex-col md:flex-row gap-4">
      <StudentOnboardingNavbar className=" bg-background flex-1 sticky top-16 max-h-[85vh] mb-10 md:mb-0 p-4  rounded-md border shadow-2xl" />
      <Suspense fallback={<FallbackComponent />}>
        <HydrationBoundary state={dehydrate(queryClient)}>
          <RenderStudentEdit studentId={id} />
        </HydrationBoundary>
      </Suspense>
    </div>
  );
}

// const RendenStudentEditPage = async ({ params }: { params: Params }) => {
//   await connection();
//   const { id } = await params.params;

//   return <RenderStudentEdit studentId={id} />;
// };
