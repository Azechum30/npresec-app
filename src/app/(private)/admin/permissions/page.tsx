import { DataTableSkeleton } from "@/components/customComponents/DataTable-Skeleton";
import OpenDialogs from "@/components/customComponents/OpenDialogs";
import PermissionGuard from "@/components/customComponents/PermissionGuard";
import { Suspense } from "react";
import { getPermissions } from "./actions/queries";
import { CreatePermissionModal } from "./components/CreatePermissionModal";
import { RenderPermissionsTable } from "./components/render-permissions-table";

export default async function PermissionsPage() {
  const promise = getPermissions();
  return (
    <PermissionGuard permission="view:permisions">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
        <h1 className="font-semibold line-clamp-1">All Permissions</h1>
        <OpenDialogs dialogKey="create-permission" />
      </div>

      <Suspense
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
        <RenderPermissionsTable promise={promise} />
      </Suspense>
      <CreatePermissionModal />
    </PermissionGuard>
  );
}
