/** biome-ignore-all assist/source/organizeImports: reason */
"use client";

import { useVerifyOrUnverifyEmailFn } from "@/app/(private)/(admin)/admin/users/_actions/mutations";
import type { UserResponseType } from "@/lib/types";
import type { Row } from "@tanstack/react-table";
import { Loader, LockIcon, Unlock } from "lucide-react";
import { Button } from "../ui/button";

export const ApproveOrDisapproveButton = ({
  row,
}: {
  row: Row<UserResponseType>;
}) => {
  const { mutateAsync, isPending } = useVerifyOrUnverifyEmailFn(
    row.original.id,
  );

  const handleverifyOrUnverifyUserEmail = () => {
    Promise.try(async () => {
      mutateAsync({
        userId: row.original.id,
        emailVerified: row.original.emailVerified,
      });
    });
  };

  return (
    <>
      <input
        value={row.original.id}
        type="text"
        name="userId"
        hidden
        readOnly
      />
      <input
        value={row.original.emailVerified ? "true" : "false"}
        type="hidden"
        name="emailVerified"
        readOnly
      />
      <Button
        onClick={handleverifyOrUnverifyUserEmail}
        type="button"
        variant={row.original.emailVerified ? "outline" : "destructive"}
        size="sm"
        disabled={isPending}>
        {isPending ? (
          <Loader className="size-5 animate-spin" />
        ) : row.original.emailVerified ? (
          <Unlock className="size-5" />
        ) : (
          <LockIcon className="size-5" />
        )}
        <span className="">
          {isPending
            ? "Processing..."
            : row.original.emailVerified
              ? "Banish"
              : "Approve"}
        </span>
      </Button>
    </>
  );
};
