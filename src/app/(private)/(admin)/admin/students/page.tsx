/**biome-ignore-all assist/source/organizeImports: reason */
import { FallbackComponent } from "@/components/customComponents/fallback-component";
import { getQueryClient } from "@/components/providers/get-query-client";
import { Button } from "@/components/ui/button";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { PlusCircle } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { classQueryOptions } from "../classes/actions/queries";
import { departmentsQueryOptions } from "../departments/actions/queries";
import { studentsQueryOptions } from "./actions/queries";
import { StudentDataTable } from "./components/render-student-datatable";
import StudentProvider from "./components/StudentProvider";

export const metadata: Metadata = {
  title: "Admin - Students",
};

export default async function StudentsPage() {
  const queryClient = getQueryClient();

  await Promise.all([
    queryClient.ensureQueryData(departmentsQueryOptions),
    queryClient.ensureQueryData(classQueryOptions),
    queryClient.ensureQueryData(studentsQueryOptions),
  ]);
  return (
    <>
      <div className="flex flex-col md:flex-row gap-4 md:justify-between md:items-center">
        <h3 className="text-base font-semibold line-clamp-1">
          Manage Students
        </h3>
        <Link href="/admin/students/onboarding">
          <Button variant="default" asChild className="w-full">
            <span>
              <PlusCircle className="size-5" />
              Add Student
            </span>
          </Button>
        </Link>
      </div>

      <Suspense fallback={<FallbackComponent />}>
        <HydrationBoundary state={dehydrate(queryClient)}>
          <StudentDataTable />
        </HydrationBoundary>
      </Suspense>
      <StudentProvider />
    </>
  );
}
