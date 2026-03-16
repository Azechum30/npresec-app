import { FallbackComponent } from "@/components/customComponents/fallback-component";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";
import { Suspense } from "react";
import { getStudents } from "./actions/action";
import { StudentDataTable } from "./components/render-student-datatable";
import StudentProvider from "./components/StudentProvider";

export const metadata: Metadata = {
  title: "Admin - Students",
};

// export const dynamic = "force-dynamic";

export default function StudentsPage() {
  return (
    <>
      <div className="flex flex-col md:flex-row gap-4 md:justify-between md:items-center">
        <h3 className="text-base font-semibold line-clamp-1">All Students</h3>
        <Link href="/admin/students/onboarding">
          <Button variant="default" asChild>
            <span>
              <PlusCircle className="size-5" />
              Add new Student
            </span>
          </Button>
        </Link>
      </div>

      <Suspense fallback={<FallbackComponent />}>
        <RenderStudentsTable />
      </Suspense>
      <StudentProvider />
    </>
  );
}

const RenderStudentsTable = async () => {
  await connection();
  const students = await getStudents();

  return <StudentDataTable initialState={students} />;
};
