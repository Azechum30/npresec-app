import { getServerSideProps } from "./actions/getServerSideProps";
import RenderDepartmentsDataTable from "./components/render-departments-datateble";
import DepartmentUploadProvider from "./components/DepartmentUploadProvider";
import { Suspense } from "react";
import { DataTableSkeleton } from "@/components/customComponents/DataTable-Skeleton";
import { hasPermissions } from "@/lib/hasPermission";
import { redirect } from "next/navigation";
import OpenDialogs from "@/components/customComponents/OpenDialogs";
import EditDepartment from "./components/EditDepartment";

export const runtime = "edge";

export default async function DepartmentPage() {
  const permissions = await hasPermissions("view:department");
  if (!permissions) {
    return redirect("/403");
  }

  const promise = getServerSideProps();

  return (
    <>
      <div className="flex flex-col gap-y-2 sm:flex-row sm:justify-between sm:items-center sm:gap-y-0">
        <h1 className="font-semibold line-clamp-1">All Departments</h1>
        <OpenDialogs dialogKey="createDepartment" />
      </div>
      <Suspense
        fallback={
          <DataTableSkeleton
            columnCount={7}
            filterCount={2}
            cellWidths={[
              "10rem",
              "30rem",
              "10rem",
              "10rem",
              "6rem",
              "6rem",
              "6rem",
            ]}
          />
        }>
        <RenderDepartmentsDataTable initialState={promise} />
      </Suspense>
      <DepartmentUploadProvider />
      <EditDepartment />
    </>
  );
}
