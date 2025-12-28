import OpenDialogs from "@/components/customComponents/OpenDialogs";
import { Suspense } from "react";
import { RenderRolesDataTable } from "@/app/(private)/(admin)/admin/roles/components/RenderRolesDataTable";
import { getRoles } from "@/app/(private)/(admin)/admin/roles/actions/queries";
import { CreateRoleDialog } from "@/app/(private)/(admin)/admin/roles/components/CreateRoleDialog";
import { UpdateRoleDialog } from "@/app/(private)/(admin)/admin/roles/components/UpdateRoleDialog";
import { ErrorComponent } from "@/components/customComponents/ErrorComponent";
import { NoDataFound } from "@/components/customComponents/no-data-found";
import { FallbackComponent } from "@/components/customComponents/fallback-component";

export default function RolesPage() {
  return (
    <>
      <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
        <h1 className="text-lg font-semibold tracking-wider line-clamp-1">
          All Roles
        </h1>
        <OpenDialogs dialogKey={"createRole"} />
      </div>

      <Suspense fallback={<FallbackComponent />}>
        <RenderRolesTables />
      </Suspense>

      <CreateRoleDialog />
      <UpdateRoleDialog />
    </>
  );
}

const RenderRolesTables = async () => {
  const { roles, error } = await getRoles();

  if (error) {
    return <ErrorComponent error={error} />;
  }

  if (!roles) {
    return <NoDataFound />;
  }

  return <RenderRolesDataTable promise={{ roles }} />;
};
