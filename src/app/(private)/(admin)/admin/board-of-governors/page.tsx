/** biome-ignore-all assist/source/organizeImports: reason */
import { FallbackComponent } from "@/components/customComponents/fallback-component";
import { PageHeader } from "@/components/customComponents/page-header";
import { connection } from "next/server";
import { Suspense } from "react";
import { fetchBoardMembers } from "./_actions/fetch-board-members";
import { CreateBoardMemberDialog } from "./_components/create-board-member-dialog";
import { EditBoardMember } from "./_components/edit-board-member";
import { RenderBoardMembersTable } from "./_components/render-board-table";

// export const dynamic = "force-dynamic";

export default function AdminBoardOfGovernorsPage() {
  return (
    <>
      <PageHeader
        pageTitle="Manage Board Members"
        showAddButton
        buttonText="Add Board Member"
        modalKey="create-board-member"
        permission="create:staff"
      />
      <div>
        <CreateBoardMemberDialog />
        <Suspense fallback={<FallbackComponent />}>
          <RenderBoardMembersDataTable />
        </Suspense>
        <EditBoardMember />
      </div>
    </>
  );
}

const RenderBoardMembersDataTable = async () => {
  await connection();
  const { error, boardMembers } = await fetchBoardMembers();
  return (
    <RenderBoardMembersTable boardMembers={boardMembers ?? []} error={error} />
  );
};
