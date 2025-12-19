import { toast } from "sonner";
import { getBoardOfGovernors } from "./actions/server";
import { BoardMembers } from "./_components/board-members";
import { FallbackComponent } from "@/components/customComponents/fallback-component";
import { ErrorComponent } from "@/components/customComponents/ErrorComponent";
import { Suspense } from "react";

export default function BoardOfGovernorsPage() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-5">
        <h2 className="text-2xl text-primary font-semibold relative after:absolute after:top-full after:w-1/12 after:inset-0 after:h-[1.5px] after:bg-primary after:flex after:items-center">
          Board of Governors
        </h2>
        <p className="lg:max-w-prose lg:text-justify">
          The governance and strategic oversight of Nakpanduri Presbyterian
          Senior High Technical School (NPRESEC) is entrusted to a dedicated
          Board of Governors, composed of key stakeholders who bring diverse
          expertise, spiritual guidance, and community representation to the
          institution. Their briefs can be found below. You can also view
          details of about each board member by clicking on the read more
          button.
        </p>
        <div className="flex flex-col gap-4">
          <h2 className="text-2xl text-primary mb-3 font-semibold relative after:absolute after:top-full after:w-1/12 after:inset-0 after:h-[1.5px] after:bg-primary after:flex after:items-center">
            List of Board of Governors
          </h2>
          <Suspense fallback={<FallbackComponent />}>
            <RenderBoardMembers />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

const RenderBoardMembers = async () => {
  const { boardMembers, error } = await getBoardOfGovernors();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {boardMembers ? (
        boardMembers.map((member) => (
          <BoardMembers key={member.id} {...member} />
        ))
      ) : boardMembers === undefined ? (
        <FallbackComponent />
      ) : error ? (
        <ErrorComponent error={error} />
      ) : null}
    </div>
  );
};
