import OpenDialogs from "@/components/customComponents/OpenDialogs";
import { RenderCreateHouseModal } from "./_components/render-create-house-modal";

export default function HousesPage() {
  return (
    <div className="">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between md:gap-0">
        <h1 className="font-semibold text-base line-clamp-1">All Houses</h1>
        <OpenDialogs dialogKey="create-house" />
      </div>

      <RenderCreateHouseModal />
    </div>
  );
}
