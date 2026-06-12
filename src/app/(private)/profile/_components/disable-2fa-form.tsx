/** biome-ignore-all assist/source/organizeImports: reason */

"use client";

import InputWithLabel from "@/components/customComponents/InputWithLabel";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { useGenericDialog } from "@/hooks/use-open-create-teacher-dialog";
import { authClient } from "@/lib/auth-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader } from "lucide-react";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

const Disable2FAFormSchema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters long"),
});
type Disable2FAFormSchemaType = z.infer<typeof Disable2FAFormSchema>;

export const Disable2FAForm = () => {
  const { dialogs, onClose } = useGenericDialog();

  const [isPending, startTransition] = useTransition();
  const form = useForm<Disable2FAFormSchemaType>({
    defaultValues: {
      password: "",
    },
    mode: "onSubmit",
    resolver: zodResolver(Disable2FAFormSchema),
  });

  const handle2FADisabling = (data: Disable2FAFormSchemaType) => {
    startTransition(async () => {
      const { error } = await authClient.twoFactor.disable({
        password: data.password,
      });

      if (error) {
        toast.error(error.message || "Failed to disable 2FA");
        return;
      }

      toast.success("2FA disabled");
    });
  };

  const isOpen = !!dialogs["disable-2fa"];
  return (
    <Dialog open={isOpen} onOpenChange={() => onClose("disable-2fa")}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Disable 2FA</DialogTitle>
          <DialogDescription>
            Kindly provide your password to disable 2FA from your account.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handle2FADisabling)}
            className="p-4 space-y-4 border rounded-md">
            <InputWithLabel
              fieldTitle="Password"
              name="password"
              type="password"
              placeholder="Enter your password"
            />
            <Button className="w-full" disabled={isPending}>
              {isPending ? (
                <>
                  Disabling 2FA <Loader className="size-5 animate-spin" />
                </>
              ) : (
                "Disable 2FA"
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
