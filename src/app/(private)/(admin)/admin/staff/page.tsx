import EditStaffDialog from "./components/EditStaffDialog";
import RenderStaffData from "./components/Render-staff-data";
import StaffBulkUploadProvider from "./components/StaffBulkUploadProvider";
import CreateStaffDialog from "./components/CreateStaffDialog";
import OpenDialogs from "@/components/customComponents/OpenDialogs";
import { Suspense } from "react";
import { FallbackComponent } from "@/components/customComponents/fallback-component";
import StaffDataFetcher from "./components/StaffDataFetcher";
import { getStaff } from "./actions/server";
export const metadata = {
  title: "Admin - Staff",
};

export default function StaffPage() {
  return (
    <>
      <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-3 md:space-y-0">
        <h1 className="text-base font-semibold line-clamp-1">All Staff</h1>
        <OpenDialogs dialogKey="createStaff" />
      </div>

      <Suspense fallback={<FallbackComponent />}>
        <RenderStaffDataTable />
      </Suspense>

      <StaffBulkUploadProvider />
      <EditStaffDialog />
      <CreateStaffDialog />
    </>
  );
}

const RenderStaffDataTable = async () => {
  const data = await getStaff();
  return <RenderStaffData initialData={data} />;
};
