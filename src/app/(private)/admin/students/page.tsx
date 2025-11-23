import { DataTableSkeleton } from "@/components/customComponents/DataTable-Skeleton";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { StudentDataTable } from "./components/render-student-datatable";
import { getStudents } from "./actions/action";
import StudentProvider from "./components/StudentProvider";
import { getAuthUser } from "@/lib/getAuthUser";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Admin - Students",
};

export default async function StudentsPage() {
  const user = await getAuthUser();

  if (!user || user.role?.name !== "admin") {
    const referer = (await headers()).get("referer") || "/sign-in";
    return redirect(referer);
  }

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
        key={user.id ? user.id : (Math.random() * 1000000).toFixed(4)}
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
