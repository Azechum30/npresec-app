"use client";
import { authClient } from "@/lib/auth-client";
import { Loader2, LogOutIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { DropdownMenuItem } from "../ui/dropdown-menu";
import LoadingButton from "./LoadingButton";

export default function LogoutButton() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isRedirecting, setIsRedirecting] = useState(false);

  const handleLogout = (e: React.FormEvent) => {
    e.preventDefault();

    startTransition(async () => {
      const { error } = await authClient.signOut();

      if (error) {
        toast.error(error.message || "Could not log user out");
      } else {
        setIsRedirecting(true);
        toast.success("Logout successful");
        setTimeout(() => {
          setIsRedirecting(false);
          router.push("/sign-in");
        }, 3000);
      }
    });
  };

  const showModal = isPending || isRedirecting;

  return (
    <>
      <Dialog open={showModal}>
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
            loading={showModal}
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
