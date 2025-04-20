import { ReactNode } from "react";
import Sidebar from "@/components/customComponents/Sidebar";
import MainContainer from "@/components/customComponents/MainContainer";
import CreateDepartmentDialog from "./admin/departments/components/create-department-dialog";
import EditDepartment from "./admin/departments/components/EditDepartment";
import SessionProvider from "@/components/customComponents/SessionProvider";
import { getSession } from "@/lib/get-user";
import { redirect } from "next/navigation";
import CreateTeacherDialog from "./admin/teachers/components/CreateTeacherDialog";
import TanstackQueryProvider from "@/components/providers/tanstack-query-provider";
import CreateClassDialog from "./admin/classes/components/CreateClassDialog";
import CreateCourseDialog from "./admin/courses/components/create-course-dialog";
import { getAuthUser } from "@/lib/getAuthUser";

export default async function PrivateRoutesLayout({
  children,
}: {
  readonly children: ReactNode;
}) {
  const [sessionData, userData] = await Promise.all([
    getSession(),
    getAuthUser(),
  ]);

  if (!sessionData.user || !sessionData.user) {
    return redirect("/authenticate");
  }

  return (
    <SessionProvider value={userData}>
      <TanstackQueryProvider>
        <main className="w-full flex transition-all duration-300 ease">
          <Sidebar />
          <CreateDepartmentDialog />
          <CreateTeacherDialog />
          <CreateClassDialog />
          <CreateCourseDialog />
          <MainContainer>{children}</MainContainer>
        </main>
      </TanstackQueryProvider>
    </SessionProvider>
  );
}
