/** biome-ignore-all assist/source/organizeImports: reason */
import { DotMatrixLoader } from "@/components/customComponents/dot-matrix-loader";
import type { Metadata } from "next";
import { Suspense } from "react";
import { getServiceTypes } from "./_actions/get-service-types";
import { VerifyStudentForm } from "./_components/verify-student-form";

export const metadata: Metadata = {
  title: "Student ID Verification | Online Admission",
  description:
    "A seamless way to verify the existence of a student on the system and ascertain the eligibility for online admission.",
  keywords: ["Student Verification", "Online Admission", "CSSPS Placements"],
  creator: "NPRESEC",
  authors: [{ name: "IT Directorate" }],
  robots: {
    index: false,
    follow: false,
    noarchive: true,
    nosnippet: true,
  },
};

export default function VerifyStudent() {
  return (
    <div>
      <Suspense fallback={<DotMatrixLoader />}>
        <LoadServices />
      </Suspense>
    </div>
  );
}

const LoadServices = async () => {
  const services = await getServiceTypes();

  return <VerifyStudentForm data={services} />;
};
