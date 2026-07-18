/**biome-ignore-all assist/source/organizeImports: reason */

import { getQueryClient } from "@/components/providers/get-query-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { connection } from "next/server";
import { classQueryOptions } from "../../classes/actions/queries";
import { departmentsQueryOptions } from "../../departments/actions/queries";
import { studentsQueryOptions } from "../actions/queries";
import { StudentDataTable } from "./render-student-datatable";

export const StreamStudentsData = async () => {
  await connection();
  const queryClient = getQueryClient();

  await Promise.all([
    queryClient.ensureQueryData(departmentsQueryOptions),
    queryClient.ensureQueryData(classQueryOptions),
    queryClient.ensureQueryData(studentsQueryOptions),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <StudentDataTable />
    </HydrationBoundary>
  );
};
