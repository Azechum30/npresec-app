import OpenDialogs from "@/components/customComponents/OpenDialogs";
import { CreateBoardMemberDialog } from "./_components/create-board-member-dialog";
import { fetchBoardMembers } from "./_actions/fetch-board-members";
import { RenderBoardMembersTable } from "./_components/render-board-table";
import { EditBoardMember } from "./_components/edit-board-member";

export default async function AdminBoardOfGovernorsPage() {
  const { error, boardMembers } = await fetchBoardMembers();
  return (
    <>
      <div className="flex flex-col md:flex-row gap-4 md:justify-between md:items-center">
        <h1 className="text-lg font-medium">Board of Governors</h1>
        <OpenDialogs dialogKey="create-board-member" />
      </div>
      <div>
        <CreateBoardMemberDialog />
        <RenderBoardMembersTable boardMembers={boardMembers} error={error} />
        <EditBoardMember />
      </div>
    </>
  );
}
