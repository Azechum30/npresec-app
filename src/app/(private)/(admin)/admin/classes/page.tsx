import OpenDialogs from "@/components/customComponents/OpenDialogs";
import { Suspense } from "react";
import { getClassesAction } from "./actions/server-actions";
import ClassesProvider from "./components/ClassesProvider";
import EditClassDialog from "./components/EditClassDialog";
import RenderClassesDataTable from "./components/RenderClassesDataTable";

import { FallbackComponent } from "@/components/customComponents/fallback-component";
import CreateClassDialog from "./components/CreateClassDialog";

// export const dynamic = "force-dynamic";

export default function ClassesPage() {
  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-base font-semibold line-clamp-1">All Classes</h1>
        <OpenDialogs dialogKey="createClass" />
      </div>
      <Suspense fallback={<FallbackComponent />}>
        <RenderClasses />
      </Suspense>
      <ClassesProvider />
      <EditClassDialog />
      <CreateClassDialog />
    </>
  );
}

const RenderClasses = async () => {
  const data = await getClassesAction();
  return <RenderClassesDataTable initialState={data} />;
};
