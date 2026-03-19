import { approveOrDisapproveLogin } from "@/app/(private)/(admin)/admin/users/_actions/approve-or-disapprove-loggin";
import { UserResponseType } from "@/lib/types";
import { Row } from "@tanstack/react-table";
import { Loader, LockIcon, Unlock } from "lucide-react";
import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";

export const ApproveOrDisapproveButton = ({
  row,
}: {
  row: Row<UserResponseType>;
}) => {
  const [state, formAction, isPending] = useActionState(
    approveOrDisapproveLogin,
    {
      success: false,
      error: "",
    },
  );

  const router = useRouter();

  useEffect(() => {
    if (!state) return;

    if (state.error) {
      toast.error(state.error);
      return;
    }

    if (state.success) {
      toast.success(
        `${row.original.emailVerified ? "User banished successfully" : "User approved successfully"}`,
      );

      router.refresh();
    }
  }, [state, row, router]);

  return (
    <form action={formAction}>
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
        type="submit"
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
    </form>
  );
};
