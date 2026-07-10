import Sidebar from "@/components/analytics/Sidebar";
import { RequireAdmin } from "@/app/util/RequireAdmin";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <RequireAdmin>{children}</RequireAdmin>
      </main>
    </div>
  );
}
