import OpenDialogs from "@/components/customComponents/OpenDialogs";
import { Suspense } from "react";
import { RenderRolesDataTable } from "@/app/(private)/admin/roles/components/RenderRolesDataTable";
import { getRoles } from "@/app/(private)/admin/roles/actions/queries";
import { DataTableSkeleton } from "@/components/customComponents/DataTable-Skeleton";
import { CreateRoleDialog } from "@/app/(private)/admin/roles/components/CreateRoleDialog";
import { UpdateRoleDialog } from "@/app/(private)/admin/roles/components/UpdateRoleDialog";
import { getAuthUser } from "@/lib/getAuthUser";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

export const dynamic = "force-dynamic";

export default async function RolesPage() {
  const user = await getAuthUser();
  if (!user || user.role?.name !== "admin") {
    const referer = (await headers()).get("referer") || "/admin/dashboard";
    return redirect(referer);
  }

  const promise = getRoles();
  return (
    <>
      <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
        <h1 className="text-lg font-semibold tracking-wider line-clamp-1">
          All Roles
        </h1>
        <OpenDialogs dialogKey={"createRole"} />
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
            filterCount={2}
          />
        }>
        <RenderRolesDataTable promise={promise} />
      </Suspense>

      <CreateRoleDialog />
      <UpdateRoleDialog />
    </>
  );
}
