import OpenDialogs from "@/components/customComponents/OpenDialogs";
import { CreateBoardMemberDialog } from "./_components/create-board-member-dialog";
import { fetchBoardMembers } from "./_actions/fetch-board-members";
import { RenderBoardMembersTable } from "./_components/render-board-table";
import { EditBoardMember } from "./_components/edit-board-member";
import { Suspense } from "react";
import { FallbackComponent } from "@/components/customComponents/fallback-component";

export const dynamic = "force-dynamic";

export default function AdminBoardOfGovernorsPage() {
  return (
    <>
      <div className="flex flex-col md:flex-row gap-4 md:justify-between md:items-center">
        <h1 className="text-base font-medium line-clamp-1">
          Board of Governors
        </h1>
        <OpenDialogs dialogKey="create-board-member" />
      </div>
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
  const { error, boardMembers } = await fetchBoardMembers();
  return <RenderBoardMembersTable boardMembers={boardMembers} error={error} />;
};
