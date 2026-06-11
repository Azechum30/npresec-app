"use client";

import { useSystemWideActionsStore } from "@/hooks/use-system-wide-actions-store";
import { Row, Table } from "@tanstack/react-table";
import { FC, useEffect, useState } from "react";
import { Checkbox } from "../ui/checkbox";
import { useAuth } from "./SessionProvider";

type RowSelectionsProps = {
  table?: Table<any>;
  isHeader: boolean;
  row?: Row<any>;
};

export const RowSelections: FC<RowSelectionsProps> = ({
  table,
  isHeader,
  row,
}) => {
  const enabled = useSystemWideActionsStore((s) => s.settings?.enableDeleting);
  const [isMounted, setIsMounted] = useState(false);

  const user = useAuth();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  const userRoles =
    user?.roles?.flatMap((r) => r.role?.name).filter((r) => r !== undefined) ??
    [];

  if (userRoles.includes("admin")) {
    return (
      <>
        <Checkbox
          checked={
            isHeader ? table?.getIsAllRowsSelected() : row?.getIsSelected()
          }
          onCheckedChange={
            isHeader
              ? () => table?.toggleAllRowsSelected()
              : () => row?.toggleSelected()
          }
        />
      </>
    );
  }
  return (
    <>
      <Checkbox
        disabled={!enabled}
        checked={
          isHeader ? table?.getIsAllRowsSelected() : row?.getIsSelected()
        }
        onCheckedChange={
          isHeader
            ? () => table?.toggleAllRowsSelected()
            : () => row?.toggleSelected()
        }
      />
    </>
  );
};
