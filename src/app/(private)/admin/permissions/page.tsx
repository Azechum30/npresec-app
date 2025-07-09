import { DataTableSkeleton } from "@/components/customComponents/DataTable-Skeleton";
import OpenDialogs from "@/components/customComponents/OpenDialogs";
import PermissionGuard from "@/components/customComponents/PermissionGuard";
import { Suspense } from "react";
import { getPermissions } from "./actions/queries";
import { CreatePermissionModal } from "./components/CreatePermissionModal";
import { RenderPermissionsTable } from "./components/render-permissions-table";
import { getAuthUser } from "@/lib/getAuthUser";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

export default async function PermissionsPage() {
  const user = await getAuthUser();
  if (!user || user.role?.name !== "admin") {
    const referer = (await headers()).get("referer") || "/admin/dashboard";
    return redirect(referer);
  }

  const promise = getPermissions();
  return (
    <PermissionGuard permission="view:permissions">
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
