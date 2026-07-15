/** biome-ignore-all assist/source/organizeImports: reason */
"use client";

import { useStopImpersonatingUserMutationFn } from "@/app/(private)/(admin)/admin/users/_actions/mutations";
import type { ExtendedSession } from "@/lib/auth-client";
import { ShieldCheck } from "lucide-react";
import { DropdownMenuItem } from "../ui/dropdown-menu";

export const StopUserImpersonation = ({
  user,
}: {
  user: ExtendedSession["user"];
}) => {
  const { mutateAsync, isPending } = useStopImpersonatingUserMutationFn(
    user.id,
  );

  const handleStoppingUserImpersonation = async () => {
    await Promise.try(async () => await mutateAsync());
    window.location.reload();
  };

  return (
    <DropdownMenuItem
      disabled={isPending}
      className="hover:cursor-pointer hover:bg-accent"
      onClick={handleStoppingUserImpersonation}>
      <ShieldCheck className="size-4" />
      Stop Impersonation
    </DropdownMenuItem>
  );
};
