import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { StudentDataTable } from "./components/render-student-datatable";
import { getStudents } from "./actions/action";
import StudentProvider from "./components/StudentProvider";
import { FallbackComponent } from "@/components/customComponents/fallback-component";

export const metadata = {
  title: "Admin - Students",
};

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
  const students = await getStudents();

  return <StudentDataTable initialState={students} />;
};
