"use client";

import { BaseDataTable } from "@/components/customComponents/BaseDataTable";
import { auth } from "@/lib/auth";
import { useMemo } from "react";
import { useGetUserAccountColumns } from "../_hooks/use-get-user-account-columns";

type UserAccountProps = {
  data: Awaited<ReturnType<typeof auth.api.listUserAccounts>>;
};

export const UserAccounts = ({ data }: UserAccountProps) => {
  const columns = useGetUserAccountColumns();
  const memoizedColumns = useMemo(() => columns, [columns]);
  const memoizedData = useMemo(() => data, [data]);
  return <BaseDataTable columns={memoizedColumns} data={memoizedData} />;
};
