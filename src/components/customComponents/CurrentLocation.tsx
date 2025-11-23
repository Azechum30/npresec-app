"use client";
import { transformString } from "@/utils/transform-string";
import { usePathname } from "next/navigation";

export default function CurrentLocation() {
  const pathname = usePathname().split("/").pop();
  const isStudentDetailPage = usePathname().split("/")[3];

  const transformedPath =
    pathname?.includes("-") || pathname?.includes("_")
      ? transformString(pathname)
      : pathname?.charAt(0).toUpperCase()! + pathname?.slice(1);

  return (
    <span>
      {isStudentDetailPage === "edit"
        ? "Edit Student"
        : pathname === "teachers"
          ? "Students"
          : transformedPath}
    </span>
  );
}
