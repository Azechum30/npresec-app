/**biome-ignore-all assist/source/organizeImports: reason */

"use client";
import { useGenericDialog } from "@/hooks/use-open-create-teacher-dialog";
import { PlusCircle } from "lucide-react";
import type { FC } from "react";
import { Button } from "../ui/button";
import { useAuth } from "./SessionProvider";

const variantType = [
  "default",
  "secondary",
  "ghost",
  "outline",
  "destructive",
  "link",
] as const;

const sizeVariants = ["lg", "sm", "icon", "default"] as const;

const OpenDialogs: FC<{
  dialogKey: string;
  title?: string;
  variant?: (typeof variantType)[number];
  size?: (typeof sizeVariants)[number];
  permission: string;
}> = ({ permission, dialogKey, title, variant, size }) => {
  const { onOpen } = useGenericDialog();

  const user = useAuth();

  const userHasPermission = new Set(
    user?.roles
      ?.flatMap((r) => r.role?.permissions?.map((p) => p.name).filter(Boolean))
      .filter((p) => p !== undefined) ?? [],
  );

  return (
    <>
      {userHasPermission.has(permission) ? (
        <Button
          aria-label={`${dialogKey}-button`}
          type="button"
          variant={variant ? variant : "default"}
          size={size ? size : "lg"}
          className="w-full md:w-auto hover:cursor-pointer"
          onClick={() => onOpen(dialogKey, dialogKey)}>
          <PlusCircle className="size-5 mr-1" />
          <span>{title ? title : "Add"}</span>
        </Button>
      ) : null}
    </>
  );
};

export default OpenDialogs;
