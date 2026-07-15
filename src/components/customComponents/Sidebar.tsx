/**biome-ignore-all assist/source/organizeImports: reason */
"use client";
import { useOpenSidebar } from "@/hooks/use-open-sidebar";
import type { UserRole } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Award, BedDouble, ClipboardList } from "lucide-react";
import { buttonVariants } from "../ui/button";
import LinkWithStyles from "./LinkWithStyles";
import { useAuth } from "./SessionProvider";
import SidebarOpenButton from "./SidebarOpenButton";
import { AvatarComponent } from "./avatar-component";
import { Links } from "./sidebar-links";

export default function Sidebar() {
  const { open } = useOpenSidebar();

  const user = useAuth();
  const roles = new Set(
    user?.roles?.flatMap((rs) => rs.role?.name as UserRole).filter(Boolean) ??
      [],
  );

  const hasAttendancePermission =
    roles.has("admin") || roles.has("classTeacher");
  const hasHouseAllocationPermissions =
    roles.has("admin") ||
    roles.has("senior_house_master") ||
    roles.has("houseMaster");

  const hasRoomsPermissions =
    roles.has("admin") ||
    roles.has("senior_house_master") ||
    roles.has("houseMaster");

  let links:
    | typeof Links.ADMIN
    | typeof Links.TEACHING_STAFF
    | typeof Links.STUDENT
    | typeof Links.HOUSEMASTER = [];

  const newLink = {
    title: "Attendance",
    href: "/attendance",
    icon: <ClipboardList />,
  };

  if (roles.has("admin")) {
    links = Links.ADMIN;
  } else if (
    roles.has("teaching_staff") ||
    roles.has("houseMaster") ||
    roles.has("classTeacher") ||
    roles.has("senior_house_master")
  ) {
    links = Links.TEACHING_STAFF;
    if (roles.has("houseMaster") || roles.has("senior_house_master")) {
      links = Links.TEACHING_STAFF.concat(Links.HOUSEMASTER);
    }
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

    if (
      section.section === "Accommodation" &&
      hasHouseAllocationPermissions &&
      hasRoomsPermissions
    ) {
      return {
        ...section,
        Links: [
          ...section.Links,
          {
            title: "House Allocations",
            href: "/house-allocations",
            icon: <Award />,
          },
          {
            title: "Rooms",
            href: "/rooms",
            icon: <BedDouble />,
          },
        ].sort((a, b) => a.title.localeCompare(b.title)),
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
        {/* <div className="sticky bottom-0 left-0 md:z-30 h-14 border-t w-full">
          <UserButton />
        </div> */}
      </div>
    </div>
  );
}
