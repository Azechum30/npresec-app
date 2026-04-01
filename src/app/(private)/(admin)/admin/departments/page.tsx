import OpenDialogs from "@/components/customComponents/OpenDialogs";
import { FallbackComponent } from "@/components/customComponents/fallback-component";
import { connection } from "next/server";
import { Suspense } from "react";
import { getServerSideProps } from "./actions/getServerSideProps";
import DepartmentUploadProvider from "./components/DepartmentUploadProvider";
import EditDepartment from "./components/EditDepartment";
import CreateDepartmentDialog from "./components/create-department-dialog";
import RenderDepartmentsDataTable from "./components/render-departments-datateble";

// export const dynamic = "force-dynamic";

export default function DepartmentPage() {
  return (
    <>
      <div className="flex flex-col gap-y-2 sm:flex-row sm:justify-between sm:items-center sm:gap-y-0">
        <h1 className="font-semibold line-clamp-1">All Departments</h1>
        <OpenDialogs
          dialogKey="createDepartment"
          title="Add a new Department"
        />
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

const RenderDepartments = async () => {
  await connection();
  const departments = await getServerSideProps();

  return <RenderDepartmentsDataTable initialState={departments} />;
};
