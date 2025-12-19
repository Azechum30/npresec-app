"use client";

import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useGenericDialog } from "../../../../../../hooks/use-open-create-teacher-dialog";

export default function OpenCreateStaffButton() {
  const { onOpen } = useGenericDialog();
  return (
    <Button onClick={() => onOpen("createStaff")}>
      <PlusCircle className="size-5" />
      Add
    </Button>
  );
}
