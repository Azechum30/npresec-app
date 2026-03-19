import { FallbackComponent } from "@/components/customComponents/fallback-component";
import OpenDialogs from "@/components/customComponents/OpenDialogs";
import { connection } from "next/server";
import { Suspense } from "react";
import { getPermissions } from "./actions/queries";
import { CreatePermissionModal } from "./components/CreatePermissionModal";
import { EditPermissionModal } from "./components/edit-permission-modal";
import { RenderPermissionsTable } from "./components/render-permissions-table";

// export const dynamic = "force-dynamic";

export default function PermissionsPage() {
  return (
    <>
      {" "}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
        <h1 className="text-base font-semibold line-clamp-1">
          All Permissions
        </h1>
        <OpenDialogs
          dialogKey="create-permission"
          title="Add a new Permission"
        />
      </div>
      <Suspense fallback={<FallbackComponent />}>
        <RenderPermissionsDataTable />
      </Suspense>
      <CreatePermissionModal />
      <EditPermissionModal />
    </>
  );
}

const RenderPermissionsDataTable = async () => {
  await connection();
  const { error, permissions } = await getPermissions();

  console.log("Permissions", permissions);
  return <RenderPermissionsTable permissions={permissions} error={error} />;
};
