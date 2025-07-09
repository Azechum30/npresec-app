"use client";
import {
  BookOpen, ClipboardList,
  GraduationCap,
  Home,
  LayoutDashboard,
  LucideBuilding2,
  UserPen,
} from "lucide-react";
import LinkWithStyles from "./LinkWithStyles";
import UserButton from "./UserButton";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { cn } from "@/lib/utils";
import { buttonVariants } from "../ui/button";
import { useOpenSidebar } from "@/hooks/use-open-sidebar";
import { useAuth } from "./SessionProvider";


export const Links = {
  ADMIN: [
    {
      section: "User Management",
      Links: [
        {
          title: "Overview",
          href: "/admin/dashboard",
          icon: <LayoutDashboard />,
        },
        { title: "Students", href: "/admin/students", icon: <GraduationCap /> },
        { title: "Teachers", href: "/admin/teachers", icon: <UserPen /> },
      ],
    },
    {
      section: "Class Management",
      Links: [
        { title: "Classes", href: "/admin/classes", icon: <LucideBuilding2 /> },
        { title: "Departments", href: "/admin/departments", icon: <Home /> },
        { title: "Courses", href: "/admin/courses", icon: <BookOpen /> },
        {title: "Attendance", href: "/admin/attendance", icon: <ClipboardList />}
      ],
    },
  ],
  TEACHER: [
    {
      section: "Class Management",
      Links: [
        {
          title: "My Classes",
          href: "/my-classes",
          icon: <LucideBuilding2 />,
        },
        { title: "Courses", href: "/courses", icon: <BookOpen /> },
      ],
    },
  ],
  STUDENT: [
    {
      section: "My Dashboard",
      Links: [
        {
          title: "My Classes",
          href: "/my-classes",
          icon: <LucideBuilding2 />,
        },
        { title: "My Courses", href: "/my-courses", icon: <BookOpen /> },
      ],
    },
  ],
};

export default function Sidebar() {
  const { open } = useOpenSidebar();

  const user = useAuth();
  const role = user?.role?.name;

  // Get links based on the user's role
  const links =
    role === "admin"
      ? Links.ADMIN
      : role === "teacher"
      ? Links.TEACHER
      : Links.STUDENT;

  return (
    <div
      className={cn(
        "inset-[68px] bg-inherit sticky top-0 left-0 z-30 h-screen border-r aside backdrop-blur overflow-x-clip",
        open && "open"
      )}>
      <div className="w-fit md:w-full flex flex-col items-center md:items-start gap-y-4 relative h-full sidebar-content">
        <div
          className={cn(
            `${buttonVariants({
              variant: "outline",
            })} group backdrop-blur-sm w-fit md:w-full px-4 py-2 text-left justify-center md:justify-start flex gap-x-3 rounded-none items-center h-14 sticky top-0 left-0 z-30 border-0 border-b`
          )}>
          <div className="size-10 flex-shrink-0 flex items-center justify-center border-2 dark:group-hover:border-gray-600  rounded-full p-1.5 ">

          <Avatar className="backdrop-blur-sm w-full h-full" >
            <AvatarImage src="/logo.png" />
            <AvatarFallback>NP</AvatarFallback>
          </Avatar>
          </div>
          <h1 className="hidden md:block text-base font-semibold">NPRESEC</h1>
        </div>
        {links.map((link) => (
          <div
            key={link.section}
            className=" w-fit md:w-full flex flex-col items-center md:items-start gap-y-3 px-4 sm:px-2 lg:px-4">
            <span className=" hidden md:block text-sm">{link.section}</span>
            <div className="w-fit md:w-full">
              {link.Links.map((innerLink) => (
                <LinkWithStyles
                  key={innerLink.href}
                  title={innerLink.title}
                  href={innerLink.href}
                  icon={innerLink.icon}
                  className="mt-1 p-4 md:px-4 lg:px-4 md:py-2 text-muted-foreground hover:text-inherit hover:bg-blue-100 dark:hover:bg-blue-800 text-sm rounded-full md:rounded-md first:mt-0"
                />
              ))}
            </div>
          </div>
        ))}
        <div className="sticky bottom-0 left-0 z-30 h-14 border-t w-fit md:w-full">
          <UserButton />
        </div>
      </div>
    </div>
  );
}
