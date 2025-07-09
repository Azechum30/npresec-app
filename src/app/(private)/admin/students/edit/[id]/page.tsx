import { Suspense } from "react";
import { RenderStudentEdit } from "../../components/RenderStudentEdit";
import LoadingState from "@/components/customComponents/Loading";
import { Metadata } from "next";
import { getStudent } from "../../actions/action";

type Params = {
  params: Promise<{ id: string }>;
};

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
export default async function StudentEditPage(params: Params) {
  const { id } = await params.params;

  return (
    <Suspense fallback={<LoadingState />}>
      <RenderStudentEdit studentId={id} />
    </Suspense>
  );
}
