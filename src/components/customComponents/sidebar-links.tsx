import {
  Award,
  BookOpen,
  BookPlus,
  Home,
  LayoutDashboard,
  List,
  LucideBuilding2,
  LucideGraduationCap,
  PoundSterling,
  Shield,
  TimerIcon,
  TrendingUpIcon,
  UserPen,
  UserPlus,
  UsersIcon,
} from "lucide-react";

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
        { title: "Students", href: "/admin/students", icon: <UsersIcon /> },
        { title: "Staff", href: "/admin/staff", icon: <UserPen /> },
      ],
    },
    {
      section: "Academics",
      Links: [
        { title: "Classes", href: "/admin/classes", icon: <LucideBuilding2 /> },
        { title: "Departments", href: "/admin/departments", icon: <Home /> },
        { title: "Courses", href: "/admin/courses", icon: <BookOpen /> },
        {
          title: "Promote Students",
          href: "/admin/promotion",
          icon: <LucideGraduationCap />,
        },
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
          icon: <BookPlus />,
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
  HOUSEMASTER: [
    {
      section: "Accommodation",
      Links: [],
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
