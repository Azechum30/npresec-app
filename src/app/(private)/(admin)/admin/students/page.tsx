/**biome-ignore-all assist/source/organizeImports: reason */
import { FallbackComponent } from "@/components/customComponents/fallback-component";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { StreamStudentsData } from "./components/stream-student-data";
import StudentProvider from "./components/StudentProvider";

export const metadata: Metadata = {
  title: "Manage Students",
  description:
    "Manage students data in real-time by CRUD operations on students data",
  keywords: ["students", "Manage", "Presby SHTS Nakpanduri"],
  creator: "NPRESEC",
  authors: [{ name: "IT Directorate", url: "https://nakpanduripresec.org" }],
  robots: {
    index: false,
    follow: false,
    noarchive: true,
    nosnippet: true,
  },
};

export default function StudentsPage() {
  return (
    <>
      <div className="flex flex-col md:flex-row gap-4 md:justify-between md:items-center">
        <h3 className="text-base font-semibold line-clamp-1">
          Manage Students
        </h3>
        <Link prefetch="auto" href="/admin/students/onboarding">
          <Button variant="default" asChild className="w-full">
            <span>
              <PlusCircle className="size-5" />
              Add Student
            </span>
          </Button>
        </Link>
      </div>

      <Suspense fallback={<FallbackComponent />}>
        <StreamStudentsData />
      </Suspense>

      <StudentProvider />
    </>
  );
}
