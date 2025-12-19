import { Suspense } from "react";
import { RenderStudentEdit } from "../../components/RenderStudentEdit";
import { Metadata } from "next";
import { getStudent } from "../../actions/action";
import StudentOnboardingNavbar from "../../components/studentsOnboardingNavbar";
import { FallbackComponent } from "@/components/customComponents/fallback-component";

type Params = {
  params: Promise<{ id: string }>;
};

export const dynamic = "force-dynamic";

export const generateMetadata = async ({
  params,
}: Params): Promise<Metadata> => {
  const { id } = await params;
  const result = await getStudent(id);

  if (!result.error && result.student) {
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
export default function StudentEditPage(params: Params) {
  return (
    <div className="flex flex-col md:flex-row gap-4">
      <StudentOnboardingNavbar className=" bg-background flex-1 sticky top-16 max-h-[85vh] mb-10 md:mb-0 p-4  rounded-md border shadow-2xl" />
      <Suspense fallback={<FallbackComponent />}>
        <RendenStudentEditPage params={params} />
      </Suspense>
    </div>
  );
}

const RendenStudentEditPage = async ({ params }: { params: Params }) => {
  const { id } = await params.params;

  return <RenderStudentEdit studentId={id} />;
};
