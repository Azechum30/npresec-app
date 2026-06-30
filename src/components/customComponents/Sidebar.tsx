/**biome-ignore-all assist/source/organizeImports: reason */
"use client";
import { useOpenSidebar } from "@/hooks/use-open-sidebar";
import type { UserRole } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  Award,
  Bed,
  BookOpen,
  BookTemplate,
  ClipboardList,
  GraduationCap,
  Home,
  LayoutDashboard,
  List,
  LucideBuilding2,
  PoundSterling,
  Shield,
  TimerIcon,
  TrendingUpIcon,
  UserPen,
  UserPlus,
} from "lucide-react";
import { buttonVariants } from "../ui/button";
import LinkWithStyles from "./LinkWithStyles";
import { useAuth } from "./SessionProvider";
import SidebarOpenButton from "./SidebarOpenButton";
import UserButton from "./UserButton";
import { AvatarComponent } from "./avatar-component";

export const Links = {
  ADMIN: [
    {
      section: "User Managment",
      Links: [
        {
          title: "Dashboard",
          href: "/admin/dashboard",
          icon: <LayoutDashboard />,
        },
        { title: "Students", href: "/admin/students", icon: <GraduationCap /> },
        { title: "Staff", href: "/admin/staff", icon: <UserPen /> },
      ],
    },
    {
      section: "Academics",
      Links: [
        { title: "Classes", href: "/admin/classes", icon: <LucideBuilding2 /> },
        { title: "Departments", href: "/admin/departments", icon: <Home /> },
        { title: "Courses", href: "/admin/courses", icon: <BookOpen /> },
      ],
    },

    {
      section: "Admissions",
      Links: [
        { title: "CSSPS List", href: "/admin/admissions", icon: <List /> },
        {
          title: "Service Fees",
          href: "/admin/service-fees",
          icon: <PoundSterling />,
        },
        {
          title: "Payments",
          href: "/admin/payments",
          icon: <TrendingUpIcon />,
        },
      ],
    },

    {
      section: "Documents",
      Links: [
        {
          title: "Templates",
          href: "/admin/templates",
          icon: <BookTemplate />,
        },
      ],
    },
    {
      section: "Results",
      Links: [
        { title: "Grades", href: "/admin/grades", icon: <Award /> },
        { title: "Timelines", href: "/admin/timelines", icon: <TimerIcon /> },
      ],
    },
    {
      section: "Public Facing",
      Links: [
        {
          title: "Board of Governors",
          href: "/admin/board-of-governors",
          icon: <Shield />,
        },
      ],
    },
    {
      section: "Accommodation",
      Links: [
        {
          title: "Houses",
          href: "/admin/houses",
          icon: <Award />,
        },
        {
          title: "Rooms",
          href: "/admin/houses/rooms",
          icon: <Bed />,
        },
      ],
    },
  ],
  TEACHING_STAFF: [
    {
      section: "Academics",
      Links: [
        {
          title: "Dashboard",
          href: "/staff/dashboard",
          icon: <LayoutDashboard />,
        },
        {
          title: "Students",
          href: "/staff/students",
          icon: <UserPlus />,
        },
        { title: "Capture Scores", href: "/staff/scores", icon: <Award /> },
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
  const roles = new Set(
    user?.roles?.flatMap((rs) => rs.role?.name as UserRole).filter(Boolean) ??
      [],
  );

  const hasAttendancePermission =
    roles.has("admin") || roles.has("classTeacher");

  let links:
    | typeof Links.ADMIN
    | typeof Links.TEACHING_STAFF
    | typeof Links.STUDENT = [];

  const newLink = {
    title: "Attendance",
    href: "/attendance",
    icon: <ClipboardList />,
  };

  if (roles.has("admin")) {
    links = Links.ADMIN;
  } else if (roles.has("teaching_staff") || roles.has("classTeacher")) {
    links = Links.TEACHING_STAFF;
  } else if (roles.has("student")) {
    links = Links.STUDENT;
  }

  const processedLinks = links.map((section) => {
    if (section.section === "Academics" && hasAttendancePermission) {
      return {
        ...section,
        Links: [...section.Links, newLink].sort((a, b) =>
          a.title.localeCompare(b.title),
        ),
      };
    }
    return section;
  });

  return (
    <div
      className={cn(
        "inset-17 bg-background absolute md:sticky top-0 left-0 bottom-0 z-50 md:z-30 h-svh border-r aside overflow-x-hidden overflow-y-auto scrollbar-thin",
        open && "open",
      )}>
      <div className="self-start w-full flex flex-col items-center md:items-start gap-y-4 relative h-full sidebar-content">
        <div
          className={cn(
            `${buttonVariants({
              variant: "default",
            })} group bg-background hover:bg-background w-full px-4 py-2 text-left justify-start flex gap-x-3 rounded-none items-center h-14 sticky top-0 left-0 z-30 border-b border-card`,
          )}>
          <AvatarComponent image="/logo.png" fallback="Nakpanduri Presby" />
          <h1 className="block text-base font-semibold text-accent-foreground">
            NPRESEC
          </h1>

          <div className="md:hidden ml-auto">
            <SidebarOpenButton className="text-primary" />
          </div>
        </div>
        {processedLinks.map((link) => (
          <div
            key={link.section}
            className=" w-full flex flex-col items-center md:items-start gap-y-3 px-4 sm:px-2 lg:px-4 ">
            <span className="w-full py-1.5 text-accent-foreground font-bold block uppercase text-sm border-t">
              {link.section}
            </span>
            <div className="w-full">
              {link.Links.map((innerLink) => (
                <LinkWithStyles
                  key={innerLink.href}
                  title={innerLink.title}
                  href={innerLink.href}
                  icon={innerLink.icon}
                  className="mt-1 p-4 md:px-2 lg:px-4 md:py-2 hover:font-bold hover:bg-accent text-sm rounded-md first:mt-0"
                />
              ))}
            </div>
          </div>
        ))}
        <div className="sticky bottom-0 left-0 md:z-30 h-14 border-t w-full">
          <UserButton />
        </div>
      </div>
    </div>
  );
}
