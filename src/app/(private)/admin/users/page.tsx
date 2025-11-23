import OpenDialogs from "@/components/customComponents/OpenDialogs";
import { getAllUsersAction } from "./_actions/get-all-users-action";
import { RenderUsersTable } from "./_components/render-users-table";

export default async function UsersPage() {
  const { error, users } = await getAllUsersAction();
  return (
    <div>
      <div className="flex flex-col gap-3 md:flex-row md:justify-between md:items-center">
        <h1 className="font-medium line-clamp-1">All Users</h1>
        <OpenDialogs dialogKey="create-auth-user" />
      </div>
      <RenderUsersTable error={error} users={users} />
    </div>
  );
}
