import { FallbackComponent } from "@/components/customComponents/fallback-component";
import { PageHeader } from "@/components/customComponents/page-header";
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
      <PageHeader
        pageTitle="Manage Permissions"
        showAddButton
        buttonText="Add Permission"
        modalKey="create-permission"
        permission="create:permissions"
      />
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

  return <RenderPermissionsTable permissions={permissions} error={error} />;
};
