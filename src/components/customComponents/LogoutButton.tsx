"use client";
import { logOut } from "@/lib/server-only-actions/authenticate";
import { DropdownMenuItem } from "../ui/dropdown-menu";
import { Loader2, LogOutIcon } from "lucide-react";
import LoadingButton from "./LoadingButton";
import { useActionState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();
  const [state, action, isLoading] = useActionState(logOut, {
    success: false,
  });

  useEffect(() => {
    if (state.success) {
      router.push("/sign-in");
    }
  }, [state, router]);

  return (
    <>
      <Dialog open={isLoading}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Logging Out</DialogTitle>
            <DialogDescription>
              Kindly wait as the system invalidates your session and then logs
              you out eventually!
            </DialogDescription>
          </DialogHeader>
          <div className="w-full h-full flex justify-center items-center">
            <Loader2 className="size-10 animate-spin" />
          </div>
        </DialogContent>
      </Dialog>
      <form action={action}>
        <DropdownMenuItem>
          <LoadingButton
            loading={isLoading}
            className="text-sm w-full text-left flex items-center justify-start"
            size="sm"
            variant="ghost">
            <LogOutIcon className="size-4 mr-2" />
            Logout
          </LoadingButton>
        </DropdownMenuItem>
      </form>
    </>
  );
}
