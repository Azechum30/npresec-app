"use client";

import { BaseDataTable } from "@/components/customComponents/BaseDataTable";
import { auth } from "@/lib/auth";
import { useMemo } from "react";
import { useGetUserSessionsColumns } from "../_hooks/use-get-user-sessions-columns";

type UserSessionsProps = {
  data: Awaited<ReturnType<typeof auth.api.listSessions>>;
};

export const UserSessions = ({ data }: UserSessionsProps) => {
  const columns = useGetUserSessionsColumns();
  const memoizedColumns = useMemo(() => columns, [columns]);
  const memoizedData = useMemo(() => data, [data]);
  return <BaseDataTable columns={memoizedColumns} data={memoizedData} />;
};
