import { getServerSideProps } from "./actions/getServerSideProps";
import RenderDepartmentsDataTable from "./components/render-departments-datateble";
import DepartmentUploadProvider from "./components/DepartmentUploadProvider";
import { Suspense } from "react";
import OpenDialogs from "@/components/customComponents/OpenDialogs";
import EditDepartment from "./components/EditDepartment";
import CreateDepartmentDialog from "./components/create-department-dialog";
import { FallbackComponent } from "@/components/customComponents/fallback-component";

export default function DepartmentPage() {
  return (
    <>
      <div className="flex flex-col gap-y-2 sm:flex-row sm:justify-between sm:items-center sm:gap-y-0">
        <h1 className="font-semibold line-clamp-1">All Departments</h1>
        <OpenDialogs dialogKey="createDepartment" />
      </div>
      <Suspense fallback={<FallbackComponent />}>
        <RenderDepartments />
      </Suspense>
      <DepartmentUploadProvider />
      <EditDepartment />
      <CreateDepartmentDialog />
    </>
  );
}

export const RenderDepartments = async () => {
  const departments = await getServerSideProps();

  return <RenderDepartmentsDataTable initialState={departments} />;
};
