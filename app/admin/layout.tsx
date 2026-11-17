import type { ReactNode } from "react";
import type { Metadata } from "next";
import { requireAdminUser } from "@/lib/admin-auth";
import { adminGreetingName } from "@/lib/admin-display";
import AdminShell from "@/components/admin/AdminShell";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const user = await requireAdminUser();

  return (
    <AdminShell name={adminGreetingName(user)} email={user.email ?? ""}>
      {children}
    </AdminShell>
  );
}
