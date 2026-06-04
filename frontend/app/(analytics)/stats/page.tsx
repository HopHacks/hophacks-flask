import DashboardHeader from '@/components/analytics/DashboardHeader';
import StatCard from '@/components/analytics/StatCard';
import Panel from '@/components/analytics/Panel';

export default function StatsPage() {
  return (
    <div className="px-8 py-8 mx-auto max-w-7xl">
      <DashboardHeader />

      {/* Top stats */}
      <div className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Profiles Analyzed" value="7,284" />
        <StatCard title="Distinct Schools" value="312" />
        <StatCard title="Distinct Majors" value="148" />
        <StatCard title="Low Coverage Fields" value="6" />
      </div>

      {/* Graph row */}
      <div className="grid grid-cols-1 gap-4 mb-6 lg:grid-cols-3">
        <Panel title="Gender Ratios">
          <div className="flex items-center justify-center h-64 text-sm border border-dashed rounded-lg bg-slate-100 text-slate-500">
            Graph goes here
          </div>

          <p className="mt-2 text-xs text-slate-500">Male 46% • Female 53% • Other 1%</p>
        </Panel>

        <Panel title="School Ratios">
          <div className="flex items-center justify-center h-64 text-sm border border-dashed rounded-lg bg-slate-100 text-slate-500">
            Graph goes here
          </div>

          <p className="mt-2 text-xs text-slate-500">
            JHU 18% • UMD 14% • Towson 9% • PSU 8% • Rutgers 7%
          </p>
        </Panel>

        <Panel title="Grade Ratios">
          <div className="flex items-center justify-center h-64 text-sm border border-dashed rounded-lg bg-slate-100 text-slate-500">
            Graph goes here
          </div>

          <p className="mt-2 text-xs text-slate-500">FR 16% • SO 33% • JR 25% • SR 18% • Grad 8%</p>
        </Panel>
      </div>

      {/* Bottom section */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
        <div className="lg:col-span-3">
          <Panel title="Major Ratios">
            <div className="flex items-center justify-center h-64 text-sm border border-dashed rounded-lg bg-slate-100 text-slate-500">
              Graph goes here
            </div>

            <p className="mt-2 text-xs text-slate-500">CS • DS • CE • BioE • EE • Other</p>
          </Panel>
        </div>
      </div>
    </div>
  );
}
