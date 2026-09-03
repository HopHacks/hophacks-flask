import { RequireAdmin } from "@/app/util/RequireAdmin";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-100">
      <RequireAdmin>{children}</RequireAdmin>
    </div>
  );
}
