/**biome-ignore-all assist/source/organizeImports: reason */
"use client";

import { useSystemWideActionsStore } from "@/hooks/use-system-wide-actions-store";
import { userHasRole } from "@/lib/user-has-role";
import type { Row, Table } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { Checkbox } from "../ui/checkbox";
import { useAuth } from "./SessionProvider";

type RowSelectionsProps<T> = {
  table?: Table<T>;
  isHeader: boolean;
  row?: Row<T>;
};

export const RowSelections = <T,>({
  table,
  isHeader,
  row,
}: RowSelectionsProps<T>) => {
  const _ = useSystemWideActionsStore((s) => s.settings?.enableDeleting);
  const [isMounted, setIsMounted] = useState(false);

  const user = useAuth();

  const { settings } = useSystemWideActionsStore();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted || !user) {
    return null;
  }

  const userRoles = userHasRole(user);

  if (userRoles.has("admin") || settings?.enableDeleting) {
    return (
      <Checkbox
        type="button"
        role="checkbox"
        aria-label="role-selection-checkbox"
        className="hover:cursor-pointer border-primary"
        checked={
          isHeader ? table?.getIsAllRowsSelected() : row?.getIsSelected()
        }
        onCheckedChange={
          isHeader
            ? () => table?.toggleAllRowsSelected()
            : () => row?.toggleSelected()
        }
      />
    );
  }
  return null;
};
