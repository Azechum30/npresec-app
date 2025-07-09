"use client";
import { FC } from "react";
import { Button, buttonVariants } from "../ui/button";
import { PlusCircle } from "lucide-react";
import { useGenericDialog } from "@/hooks/use-open-create-teacher-dialog";


const variantType = ["default", "secondary", "ghost", "outline", "destructive", "link"] as const

const OpenDialogs: FC<{ dialogKey: string, title?:string, variant?: typeof variantType[number]}> = ({ dialogKey, title, variant }) => {
  const { onOpen } = useGenericDialog();

  return (
    <Button variant={variant ? variant: "default"}  onClick={() => onOpen(dialogKey, dialogKey)}>
      <PlusCircle className="size-5 mr-1" />
      <span>{title ? title : "Add"}</span>
    </Button>
  );
};

export default OpenDialogs;
