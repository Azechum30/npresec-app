/** biome-ignore-all assist/source/organizeImports: reason */
import { DotMatrixLoader } from "@/components/customComponents/dot-matrix-loader";
import { connection } from "next/server";
import { Suspense } from "react";
import { RenderStudentEnrollementForm } from "./_components/render-student-enrollment-form";

type Params = {
  params: Promise<{ admissionId: string }>;
};

export default function StudentEnrollmentPage({ params }: Params) {
  return (
    <div className="w-full md:max-w-2xl">
      <Suspense fallback={<DotMatrixLoader />}>
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
