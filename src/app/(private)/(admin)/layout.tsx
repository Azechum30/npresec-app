import { FallbackComponent } from "@/components/customComponents/fallback-component";
import { requireAdmin } from "@/lib/admin-guard";
import { ReactNode, Suspense } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<FallbackComponent />}>
      <AdminGuard>{children}</AdminGuard>
    </Suspense>
  );
}

const AdminGuard = async ({ children }: { children: ReactNode }) => {
  await requireAdmin();

  return <>{children}</>;
};
