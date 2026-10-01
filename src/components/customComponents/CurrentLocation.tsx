/** biome-ignore-all assist/source/organizeImports:reason */

"use client";
import { toProperCase } from "@/lib/to-proper-case";
import { usePathname } from "next/navigation";

export default function CurrentLocation() {
  const pathname = usePathname().split("/").pop() ?? "";
  const isStudentDetailPage = usePathname().split("/")[3];
  const isExeatConfirmationPage = usePathname().split("/")[2];

  const transformedPath = toProperCase(pathname);

  return (
    <span>
      {isStudentDetailPage === "edit"
        ? "Edit Student"
        : pathname === "teachers"
          ? "Students"
          : isExeatConfirmationPage === "check-out-or-check-in"
            ? "Confirm Exeat"
            : transformedPath}
    </span>
  );
}
