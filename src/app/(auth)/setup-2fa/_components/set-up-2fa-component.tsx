"use client";

import { ErrorComponent } from "@/components/customComponents/ErrorComponent";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { Loader } from "lucide-react";
import { ChangeEvent, useState, useTransition } from "react";

import { useAuth } from "@/components/customComponents/SessionProvider";
import VerifyTotp from "./verify-totp";

function Setup2FAComponent() {
  const [password, setPassword] = useState("");
  const [otpUrl, setOtpUrl] = useState("");
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [backupCodes, setBackupCodes] = useState([]);
  const [error, setError] = useState("");
  const user = useAuth();

  if (!user) return null;

  const handlInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    setPassword(value);
  };

  const handleSubmit = () => {
    setOtpUrl("");
    setBackupCodes([]);
    setError("");
    startTransition(async () => {
      await authClient.twoFactor.enable(
        {
          password,
        },
        {
          onSuccess(context) {
            setOtpUrl(context.data.totpURI);
            setBackupCodes(context.data.backupCodes);
            setOpen(false);
            setError("");
          },
          onError(context) {
            setError(context.error.message);
          },
        },
      );
    });
  };

  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle className="text-lg font-bold">
          {otpUrl || user.twoFactorEnabled
            ? "Verify TOTP Code"
            : "Enable Two Factor Authentication"}
        </CardTitle>
        <CardDescription className="text-justify">
          {otpUrl && !user.twoFactorEnabled ? (
            <>
              Kindly scan the Qrcode below with any authenticator app of your
              choice. When you are done, enter the code the authenticator app
              generates into the input field and then verify the it by clicking
              on the verify button.
            </>
          ) : user.twoFactorEnabled ? (
            <>
              Kindly enter your Time-Based One-Time-Password (TOTP) to verify
              your identity and continue.
            </>
          ) : (
            <>
              You are admonished to turn on or enable{" "}
              <span className="bg-linear-to-r from-primary to-muted-foreground bg-clip-text text-transparent font-semibold">
                Two Factor Authentication (2FA)
              </span>{" "}
              so as to provide an additional layer of security for you as you
              use the application. Please be informed that this a requirement
              and should be enabled by every user in order gain access.
            </>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="">
        {otpUrl || user.twoFactorEnabled ? (
          <VerifyTotp totpUrl={otpUrl} backupCodes={backupCodes} />
        ) : (
          <div className="flex space-x-4 mb-4" onClick={() => setOpen(true)}>
            <Button className="hover:cursor-pointer hover:bg-secondary transition-colors ">
              Enable 2FA
            </Button>
            <Button
              className="hover:cursor-pointer hover:bg-secondary transition-colors "
              variant="outline">
              Skip for now
            </Button>
          </div>
        )}
      </CardContent>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enter Password</DialogTitle>
            <DialogDescription>
              Kindly enter your password to continue.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col space-y-4">
            {error && <ErrorComponent error={error} />}
            <Input
              type="password"
              value={password}
              placeholder="Please enter your current password"
              onChange={handlInputChange}
            />

            <Button
              onClick={handleSubmit}
              disabled={isPending}
              className="w-full hover:cursor-pointer">
              {isPending ? (
                <>
                  <Loader className="size-4 animate-spin mr-2" />
                  Submitting...
                </>
              ) : (
                <>Continue</>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

export default Setup2FAComponent;
