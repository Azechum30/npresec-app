import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Lock, Settings2, User2 } from "lucide-react";

type ProfileTabProps = {
  bio: React.ReactNode;
  settings: React.ReactNode;
  security: React.ReactNode;
};

export const ProfileTab = ({ bio, settings, security }: ProfileTabProps) => {
  return (
    <Tabs defaultValue="bio">
      <TabsList className="w-full">
        <TabsTrigger className="hover:cursor-pointer" value="bio">
          <User2 />
          Profile
        </TabsTrigger>
        <TabsTrigger className="hover:cursor-pointer" value="settings">
          <Settings2 />
          Settings
        </TabsTrigger>
        <TabsTrigger className="hover:cursor-pointer" value="security">
          <Lock />
          Security
        </TabsTrigger>
      </TabsList>
      <TabsContent value="bio">{bio}</TabsContent>
      <TabsContent value="settings">{settings}</TabsContent>
      <TabsContent value="security">{security}</TabsContent>
    </Tabs>
  );
};
