import TabSwitcher from "@/components/customComponents/TabSwitcher";
import { ProfileTab } from "./_components/profile-tab";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BioForm } from "./forms/bio-form";
import { RenderBioForm } from "./_components/render-bio-form";
import { RenderSettingsForm } from "./_components/render-settings-form";

export const dynamic = "force-dynamic";

export default function ProfilePage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-bold text-base">Account Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <ProfileTab
          bio={
            <>
              <RenderBioForm />
            </>
          }
          settings={
            <>
              <RenderSettingsForm />
            </>
          }
          security={<>Security Section</>}
        />
      </CardContent>
    </Card>
  );
}
