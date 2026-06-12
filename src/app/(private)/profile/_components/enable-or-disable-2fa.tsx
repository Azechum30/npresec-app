/** biome-ignore-all assist/source/organizeImports: reason */
"use client";

import { useAuth } from "@/components/customComponents/SessionProvider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGenericDialog } from "@/hooks/use-open-create-teacher-dialog";
import Link from "next/link";
import { Disable2FAForm } from "./disable-2fa-form";

export const DisableOrEnable2FA = () => {
  const user = useAuth();
  const { onOpen } = useGenericDialog();

  if (!user) return null;

  return (
    <Card className="mt-6">
      <CardHeader className="flex justify-between items-center">
        <CardTitle>Two Factor Authentication Status</CardTitle>
        <Badge variant={user.twoFactorEnabled ? "default" : "destructive"}>
          {user.twoFactorEnabled ? "Enabled" : "Disabled"}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-6">
        <p>
          {!user.twoFactorEnabled
            ? "Two factor authentication (2FA) adds an additional layer of protection to your account. You are encouraged to enable it for the safety of your account. Click on the button below to enable it."
            : "Click on the button below to disable two factor authication for your account. It is not recommended that you disable 2FA since disabling it reduces the amount of security on your account."}
        </p>
        {user.twoFactorEnabled ? (
          <Button
            className="w-full sm:w-auto"
            variant="destructive"
            onClick={() => onOpen("disable-2fa")}>
            Disable 2FA
          </Button>
        ) : (
          <Button asChild className="w-full sm:w-auto">
            <Link href="/setup-2fa" prefetch="auto">
              Enable 2FA
            </Link>
          </Button>
        )}
      </CardContent>
      <Disable2FAForm />
    </Card>
  );
};
