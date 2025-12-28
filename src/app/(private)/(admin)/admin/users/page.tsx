import OpenDialogs from "@/components/customComponents/OpenDialogs";
import { getAllUsersAction } from "./_actions/get-all-users-action";
import { RenderUsersTable } from "./_components/render-users-table";
import { Suspense } from "react";

import { FallbackComponent } from "@/components/customComponents/fallback-component";

export const dynamic = "force-dynamic";

export default function UsersPage() {
  return (
    <div>
      <div className="flex flex-col gap-3 md:flex-row md:justify-between md:items-center">
        <h1 className="text-base font-medium line-clamp-1">All Users</h1>
        <OpenDialogs dialogKey="create-auth-user" />
      </div>
      <Suspense fallback={<FallbackComponent />}>
        <RenderUserTable />
      </Suspense>
    </div>
  );
}

const RenderUserTable = async () => {
  const { error, users } = await getAllUsersAction();

  return <RenderUsersTable error={error} users={users} />;
};
