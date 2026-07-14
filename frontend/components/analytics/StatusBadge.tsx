const STYLES: Record<string, string> = {
  applied: "bg-slate-100 text-slate-700 border-slate-200",
  accepted: "bg-green-100 text-green-800 border-green-200",
  waitlisted: "bg-amber-100 text-amber-800 border-amber-200",
  rejected: "bg-red-100 text-red-800 border-red-200",
  rsvped: "bg-blue-100 text-blue-800 border-blue-200",
  checked_in: "bg-indigo-100 text-indigo-800 border-indigo-200",
  email_not_confirmed: "bg-zinc-100 text-zinc-600 border-zinc-200",
  unknown: "bg-slate-100 text-slate-500 border-slate-200",
};

const LABELS: Record<string, string> = {
  applied: "Applied",
  accepted: "Accepted",
  waitlisted: "Waitlisted",
  rejected: "Rejected",
  rsvped: "RSVP'd",
  checked_in: "Checked in",
  email_not_confirmed: "Email not confirmed",
  unknown: "Unknown",
};

export default function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex whitespace-nowrap rounded-full border px-2 py-0.5 text-xs font-medium ${
        STYLES[status] ?? STYLES.unknown
      }`}
    >
      {LABELS[status] ?? status}
    </span>
  );
}
