import { ShowLoadingState } from "@/components/customComponents/show-loading-state";
import { connection } from "next/server";
import { Suspense } from "react";
import { RenderStudentEnrollementForm } from "./_components/render-student-enrollment-form";

type Params = {
  params: Promise<{ admissionId: string }>;
};

export default function StudentEnrollmentPage({ params }: Params) {
  return (
    <div className="w-full md:max-w-2xl">
      <Suspense fallback={<ShowLoadingState />}>
        <RenderStudentEnrollment params={params} />
      </Suspense>
    </div>
  );
}

const RenderStudentEnrollment = async ({ params }: Params) => {
  await connection();

  const { admissionId } = await params;

  return <RenderStudentEnrollementForm admissionId={admissionId} />;
};
