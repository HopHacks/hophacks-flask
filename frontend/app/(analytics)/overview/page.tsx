import DashboardHeader from "@/components/analytics/DashboardHeader";
import StatCard from "@/components/analytics/StatCard";
import Panel from "@/components/analytics/Panel";

export default function DashboardPage() {
  return (
    <div className="max-w-6xl px-8 py-8 mx-auto">
      <DashboardHeader />

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total HopHacks Accounts" value="7,284" />
        <StatCard title="Returning Users" value="2,903" />
        <StatCard title="Avg Accounts / Year" value="1,214" />
      </div>

      {/* Middle row: chart + ops */}
      <div className="grid grid-cols-1 gap-4 mb-6 lg:grid-cols-3">
        <Panel title="HopHacks Accounts by Year">
          <div className="flex items-center justify-center w-full h-64 text-sm border border-dashed rounded-lg border-slate-300 bg-slate-100 text-slate-500">
            Chart goes here
          </div>
          <div className="mt-3 text-xs text-slate-500">
            Tip: drop in Recharts/Chart.js later.
          </div>
        </Panel>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Panel title="HopHacks Yearly User Counts">
          <ul className="space-y-1 text-sm text-slate-700">
            <li className="flex justify-between">
              <span>HopHacks 2025</span>
              <span className="font-medium">1,932</span>
            </li>
            <li className="flex justify-between">
              <span>HopHacks 2024</span>
              <span className="font-medium">1,704</span>
            </li>
            <li className="flex justify-between">
              <span>HopHacks 2023</span>
              <span className="font-medium">1,420</span>
            </li>
            <li className="flex justify-between">
              <span>HopHacks 2022</span>
              <span className="font-medium">1,203</span>
            </li>
            <li className="flex justify-between">
              <span>HopHacks 2021</span>
              <span className="font-medium">1,019</span>
            </li>
          </ul>
        </Panel>
      </div>
    </div>
  );
}
