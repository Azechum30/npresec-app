import { DataTableSkeleton } from "@/components/customComponents/DataTable-Skeleton";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { StudentDataTable } from "./components/render-student-datatable";
import { getStudents } from "./actions/action";
import StudentProvider from "./components/StudentProvider";

export default async function StudentsPage() {
  const promise = getStudents();
  return (
    <>
      <div className="flex flex-col md:flex-row gap-4 md:justify-between md:items-center">
        <h3 className="font-semibold">All Students</h3>
        <Link href="/admin/students/onboarding">
          <Button variant="default" asChild>
            <span>
              <PlusCircle className="size-5" />
              Add New
            </span>
          </Button>
        </Link>
      </div>

      <Suspense
        key={"students"}
        fallback={
          <DataTableSkeleton
            columnCount={7}
            cellWidths={[
              "10rem",
              "30rem",
              "10rem",
              "10rem",
              "6rem",
              "6rem",
              "6rem",
            ]}
            shrinkZero
            filterCount={2}
          />
        }>
        <StudentDataTable initialState={promise} />
      </Suspense>
      <StudentProvider />
    </>
  );
}
