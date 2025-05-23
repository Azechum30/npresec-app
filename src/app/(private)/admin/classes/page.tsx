import OpenDialogs from "@/components/customComponents/OpenDialogs";
import { getClassesAction } from "./actions/server-actions";
import RenderClassesDataTable from "./components/RenderClassesDataTable";
import ClassesProvider from "./components/ClassesProvider";
import EditClassDialog from "./components/EditClassDialog";
import { Suspense } from "react";
import { DataTableSkeleton } from "@/components/customComponents/DataTable-Skeleton";
import { hasPermissions } from "@/lib/hasPermission";
import { redirect } from "next/navigation";

export default async function ClassesPage() {
  const permissions = await hasPermissions("view:class");
  if (!permissions) {
    return redirect("/403");
  }
  const promise = getClassesAction();

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="font-medium line-clamp-1">All Classes</h1>
        <OpenDialogs dialogKey="createClass" />
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
        <RenderClassesDataTable initialState={promise} />
      </Suspense>
      <ClassesProvider />
      <EditClassDialog />
    </>
  );
}
