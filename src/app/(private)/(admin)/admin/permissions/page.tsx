import OpenDialogs from "@/components/customComponents/OpenDialogs";
import PermissionGuard from "@/components/customComponents/PermissionGuard";
import { Suspense } from "react";
import { getPermissions } from "./actions/queries";
import { CreatePermissionModal } from "./components/CreatePermissionModal";
import { RenderPermissionsTable } from "./components/render-permissions-table";
import { FallbackComponent } from "@/components/customComponents/fallback-component";
import { EditPermissionModal } from "./components/edit-permission-modal";

export default function PermissionsPage() {
  return (
    <PermissionGuard permission="view:permissions">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
        <h1 className="text-base font-semibold line-clamp-1">
          All Permissions
        </h1>
        <OpenDialogs dialogKey="create-permission" />
      </div>

      <Suspense fallback={<FallbackComponent />}>
        <RenderPermissionsDataTable />
      </Suspense>
      <CreatePermissionModal />
      <EditPermissionModal />
    </PermissionGuard>
  );
}

const RenderPermissionsDataTable = async () => {
  const { error, permissions } = await getPermissions();
  return <RenderPermissionsTable permissions={permissions} error={error} />;
};
