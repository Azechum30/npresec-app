/** biome-ignore-all assist/source/organizeImports: reason */
import { AdminAuthGuard } from "@/components/customComponents/admin-guard";
import { FallbackComponent } from "@/components/customComponents/fallback-component";
import { type ReactNode, Suspense } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<FallbackComponent />}>
      <AdminGuard>{children}</AdminGuard>
    </Suspense>
  );
}

const AdminGuard = async ({ children }: { children: ReactNode }) => {
  return <AdminAuthGuard>{children}</AdminAuthGuard>;
};
