import OpenDialogs from "@/components/customComponents/OpenDialogs";
import { RenderCreateHouseModal } from "./_components/render-create-house-modal";
import { client } from "@/lib/orpc";
import { RenderHouseListTable } from "./_components/render-house-list-table";
import { Suspense } from "react";
import { DataTableSkeleton } from "@/components/customComponents/DataTable-Skeleton";
import { EditHouseModal } from "./_components/edit-house-modal";

export default function HousesPage() {
  return (
    <div className="">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between md:gap-0">
        <h1 className="font-semibold text-base line-clamp-1">All Houses</h1>
        <OpenDialogs dialogKey="create-house" />
      </div>

      <Suspense
        fallback={
          <DataTableSkeleton
            columnCount={7}
            cellWidths={[
              "10rem",
              "10rem",
              "10rem",
              "6rem",
              "10rem",
              "6rem",
              "6rem",
            ]}
            shrinkZero
          />
        }>
        <FetchHouseData />
      </Suspense>

      <RenderCreateHouseModal />
      <EditHouseModal />
    </div>
  );
}

const FetchHouseData = async () => {
  const houses = await client.house.getHouses();
  return <RenderHouseListTable houses={houses} />;
};
