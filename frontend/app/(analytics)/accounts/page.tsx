export default function AccountsPage() {
  return (
    <div className="px-8 py-8 mx-auto max-w-7xl">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-4xl font-semibold tracking-tight text-slate-900">
            Hopkins Accounts Console
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Search and manage Hopkins HopHacks user accounts
          </p>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 mb-10 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Accounts" value="7,284" />
        <StatCard title="Verified Emails" value="6,911" />
        <StatCard title="Flagged Accounts" value="38" />
        <StatCard title="New This Week" value="124" />
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between mb-4">
        <input
          className="px-4 py-2 text-sm bg-white border rounded-lg outline-none w-72 border-slate-200 placeholder:text-slate-400 focus:ring-2 focus:ring-slate-300"
          placeholder="Search..."
        />
      </div>

      {/* Table */}
      <div className="overflow-hidden bg-white border rounded-xl border-slate-200">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr className="border-b border-slate-200">
              <th className="px-6 py-3 font-medium text-left">Name</th>
              <th className="px-6 py-3 font-medium text-left">School</th>
              <th className="px-6 py-3 font-medium text-left">Major</th>
              <th className="px-6 py-3 font-medium text-right">Event</th>
            </tr>
          </thead>
          <tbody className="text-slate-800">
            {[
              { name: "Ari Patel", school: "Johns Hopkins", major: "CS", event: "HopHacks 2025" },
              { name: "Mina Lopez", school: "UMD", major: "Data Science", event: "HopHacks 2024" },
              { name: "Noah Kim", school: "Towson", major: "Cybersecurity", event: "HopHacks 2025" },
            ].map((row) => (
              <tr key={row.name} className="border-b border-slate-100">
                <td className="px-6 py-4">{row.name}</td>
                <td className="px-6 py-4">{row.school}</td>
                <td className="px-6 py-4">{row.major}</td>
                <td className="px-6 py-4 text-right text-slate-500">{row.event}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 text-sm text-slate-500">
          <div>Showing 10 records</div>
          <div className="flex items-center gap-6">
            <button className="text-slate-700 hover:text-slate-900">Previous</button>
            <div className="w-6 h-6 border rounded border-slate-200 bg-slate-100" />
            <button className="text-slate-700 hover:text-slate-900">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="p-5 bg-white border shadow-sm rounded-xl border-slate-200">
      <div className="text-sm font-medium text-slate-800">{title}</div>
      <div className="mt-2 text-2xl font-semibold text-slate-900">{value}</div>
    </div>
  );
}