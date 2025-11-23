import { getTeachers } from "./actions/server";
import EditTeacherDialog from "./components/EditTeacherDialog";
import RenderTeacherData from "./components/Render-teacher-data";
import TeacherBulkUploadProvider from "./components/TeacherBulkUploadProvider";
// removed DataTableSkeleton as Suspense is not used here
import { redirect } from "next/navigation";
import CreateTeacherDialog from "./components/CreateTeacherDialog";
import { getAuthUser } from "@/lib/getAuthUser";
import { headers } from "next/headers";
import OpenDialogs from "@/components/customComponents/OpenDialogs";

export const metadata = {
  title: "Admin - Teachers",
};

export default async function TeachersPage() {
  const [user, initialData] = await Promise.all([getAuthUser(), getTeachers()]);

  if (!user || user.role?.name !== "admin") {
    const hdrs = await headers();
    const referer = hdrs.get("referer");
    const host = hdrs.get("host");
    const currentPath = "/admin/teachers";

    let target = "/sign-in";
    if (referer && host) {
      try {
        const url = new URL(referer);
        const isSameHost = url.host === host;
        const isInternal = url.pathname.startsWith("/");
        const isLoop = url.pathname === currentPath;
        if (isSameHost && isInternal && !isLoop) {
          target = `${url.pathname}${url.search}`;
        }
      } catch {}
    }

    return redirect(target);
  }

  return (
    <>
      <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-3 md:space-y-0">
        <h1 className="font-semibold line-clamp-1">All Teachers</h1>
        <OpenDialogs dialogKey="createTeacher" />
      </div>

      <RenderTeacherData initialData={initialData} />

      <TeacherBulkUploadProvider />
      <EditTeacherDialog />
      <CreateTeacherDialog />
    </>
  );
}
