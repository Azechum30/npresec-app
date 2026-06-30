/** biome-ignore-all assist/source/organizeImports: reason */
import { DotMatrixLoader } from "@/components/customComponents/dot-matrix-loader";
import { ResultsVerification } from "@/components/customComponents/ResultsVerification";
import { env } from "@/lib/server-only-actions/validate-env";
import type { Metadata } from "next";
import { Suspense } from "react";
import { verifyStudentResults } from "./_actions/action";

type Props = {
  params: Promise<{ token: string }>;
};

// export const generateStaticParams = async () => {};

export const generateMetadata = async ({
  params,
}: Props): Promise<Metadata> => {
  const { token } = await params;

  const result = await verifyStudentResults({ token });

  // Fallback if no results found
  if (!result) {
    return {
      title: "Student Results - Not Found",
      description: "No results found for the requested student.",
      robots: { index: false },
    };
  }

  const {
    student,
    semester: resultSemester,
    academicYear: resultYear,
    gpa,
  } = result;
  const fullName = `${student.firstName} ${student.lastName}`.trim();

  return {
    title: `${fullName} | Semester Results`,
    description: `Semester ${resultSemester} ${resultYear} Academic Results for ${fullName}. GPA: ${gpa || "N/A"} | Presbyterian Senior High Technical School (NPRESEC)`,

    keywords: [
      `${fullName} Results`,
      "Student Results",
      "Semester Results",
      "Academic Report",
      "NPRESEC Results",
      "Presbyterian SHTS",
      "Student Portal",
    ],

    openGraph: {
      title: `${fullName} - Semester Results`,
      description: `View ${resultSemester} ${resultYear} academic performance and GPA for ${fullName} at NPRESEC.`,
      url: `${env.NEXT_PUBLIC_URL}/verify-results/${token}?semester=${resultSemester}&academicYear=${resultYear}`,
      images: [
        {
          url: "/opengraph-image",
          width: 1200,
          height: 630,
          alt: `${fullName} Semester Results - NPRESEC`,
        },
      ],
      siteName: "NPRESEC MIS",
    },

    twitter: {
      card: "summary_large_image",
      title: `${fullName} - Academic Results`,
      description: `Semester ${resultSemester} | ${resultYear} | GPA: ${gpa || "N/A"}`,
    },

    alternates: {
      canonical: `${env.NEXT_PUBLIC_URL}/verify-results/${token}`,
    },

    robots: {
      index: false,
      follow: false,
      noarchive: true,
      nosnippet: true,
    },
  };
};

export default function VerifyStudentResultsPage({ params }: Props) {
  return (
    <Suspense fallback={<DotMatrixLoader />}>
      <RenderResultsVerification params={params} />
    </Suspense>
  );
}

const RenderResultsVerification = async ({ params }: Props) => {
  const { token } = await params;

  const grades = await verifyStudentResults({ token });

  const isValid = !!grades.isPublished;

  return (
    <ResultsVerification isValid={isValid} grades={grades} studentId={token} />
  );
};
