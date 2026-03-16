import { UserLocationFromIp } from "@/components/customComponents/user-location";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProfileTab } from "./_components/profile-tab";
import { RenderBioForm } from "./_components/render-bio-form";
import { RenderChangePasswordModal } from "./_components/render-change-password-modal";
import { RenderSecuritySettings } from "./_components/render-security-setting";
import { RenderSettingsForm } from "./_components/render-settings-form";

// export const dynamic = "force-dynamic";

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
          security={
            <>
              <RenderSecuritySettings />
              <RenderChangePasswordModal />
            </>
          }
        />
        <UserLocationFromIp />
      </CardContent>
    </Card>
  );
}
