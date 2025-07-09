import OpenDialogs from "@/components/customComponents/OpenDialogs";
import { getClassesAction } from "./actions/server-actions";
import RenderClassesDataTable from "./components/RenderClassesDataTable";
import ClassesProvider from "./components/ClassesProvider";
import EditClassDialog from "./components/EditClassDialog";
import { Suspense } from "react";
import { DataTableSkeleton } from "@/components/customComponents/DataTable-Skeleton";
import { redirect } from "next/navigation";
import CreateClassDialog from "./components/CreateClassDialog";
import { getAuthUser } from "@/lib/getAuthUser";
import { headers } from "next/headers";

export default async function ClassesPage() {
  const user = await getAuthUser();
  if (!user || user.role?.name !== "admin") {
    const referer = (await headers()).get("referer") || "/sign-in";
    return redirect(referer);
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
      <CreateClassDialog />
    </>
  );
}
