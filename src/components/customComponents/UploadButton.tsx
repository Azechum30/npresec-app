import { UploadCloud } from "lucide-react";
import { Button } from "../ui/button";
import { useGenericDialog } from "@/hooks/use-open-create-teacher-dialog";
import { usePathname } from "next/navigation";
import React from "react";

const UploadButton: React.FC<{ className?: string }> = ({ className }) => {
  const { onOpen } = useGenericDialog();
  const pathname = usePathname().split("/").pop();

  const dialogId = pathname + "-upload";

  if (pathname === "attendance" || pathname === "teachers") return null;
  return (
    <Button
      variant="outline"
      onClick={() => onOpen(dialogId, dialogId)}
      className={className}>
      <UploadCloud className="size-5" />
      Upload
    </Button>
  );
};

export default UploadButton;
