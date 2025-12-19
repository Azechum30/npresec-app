"use client";
import { DropdownMenuItem } from "../ui/dropdown-menu";
import { Loader2, LogOutIcon } from "lucide-react";
import LoadingButton from "./LoadingButton";
import { useTransition } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

export default function LogoutButton() {
  const router = useRouter();

  const [isPending, startTransition] = useTransition();

  const handleLogout = (e: React.FormEvent) => {
    e.preventDefault();

    startTransition(async () => {
      const { error } = await authClient.signOut();

      if (error) {
        toast.error(error.message || "Could not log user out");
      } else {
        toast.success("logout successful");
        router.push("/sign-in");
      }
    });
  };

  return (
    <>
      <Dialog open={isPending}>
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
      <form onSubmit={handleLogout}>
        <DropdownMenuItem asChild>
          <LoadingButton
            loading={isPending}
            className="text-sm w-full text-left flex items-center justify-start hover:cursor-pointer"
            size="sm"
            variant="ghost">
            <LogOutIcon className="size-4" />
            Logout
          </LoadingButton>
        </DropdownMenuItem>
      </form>
    </>
  );
}
