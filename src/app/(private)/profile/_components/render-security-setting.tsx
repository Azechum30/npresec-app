import OpenDialogs from "@/components/customComponents/OpenDialogs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { connection } from "next/server";
import { Suspense } from "react";
import { UserAccounts } from "./user-accounts";
import { UserSessions } from "./user-sessions";

export const RenderSecuritySettings = () => {
  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle className="text-base">
          Configure System Security Settings
        </CardTitle>
        <CardDescription>
          This section allows you to configure the overall security settings of
          the system.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="mb-4 flex flex-col md:flex-row md:jusfity-between md:items-center gap-3">
          <Input
            placeholder="ApR12**********************************************************************1$ph"
            disabled
          />
          <OpenDialogs dialogKey="change-password" title="Change Password" />
        </div>
        <fieldset className="border rounded-lg p-4">
          <legend className="text-base font-bold p-2">Your Accounts</legend>

          <Suspense fallback={<>Loading...</>}>
            <RenderUserAccounts />
          </Suspense>
        </fieldset>
        <fieldset className="border rounded-lg p-4">
          <legend className="text-base font-bold p-2">Your Sessions</legend>

          <Suspense fallback={<>Loading...</>}>
            <RenderUserSessions />
          </Suspense>
        </fieldset>
      </CardContent>
    </Card>
  );
};

const RenderUserAccounts = async () => {
  await connection();
  const accounts = async () => {
    "use server";
    try {
      const accounts = await auth.api.listUserAccounts({
        headers: await headers(),
      });
      if (!accounts.length) {
        throw new Error("Failed to fetch user accounts");
      }

      return accounts;
    } catch (e) {
      console.error("Failed to fetch user accounts:", e);
    }
  };

  const userAccounts = await accounts();
  if (!userAccounts) {
    return null;
  }

  return <UserAccounts data={userAccounts} />;
};

const RenderUserSessions = async () => {
  await connection();
  const sessions = await auth.api.listSessions({
    headers: await headers(),
  });

  return <UserSessions data={sessions} />;
};
