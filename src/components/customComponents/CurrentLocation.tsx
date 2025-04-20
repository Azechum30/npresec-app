"use client";
import { usePathname } from "next/navigation";

export default function CurrentLocation() {
  const pathname = usePathname().split("/").pop();
  const isStudentDetailPage = usePathname().split("/")[3];
  console.log(isStudentDetailPage);
  const transformedPath =
    pathname?.charAt(0).toUpperCase()! + pathname?.slice(1);

  return (
    <span>
      {isStudentDetailPage === "edit" ? "Edit Student" : transformedPath}
    </span>
  );
}
