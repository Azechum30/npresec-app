import { hasPermissions } from "@/lib/hasPermission";
import { redirect } from "next/navigation";

export default async function DashboardOverviewPage() {
  const permissions = await hasPermissions(
    [
      "view:department",
      "view:student",
      "view:class",
      "view:course",
      "view:teacher",
    ],
    { requireAll: true }
  );
  if (!permissions) return redirect("/authenticate");
  return <div>Dashboard overview page</div>;
}
