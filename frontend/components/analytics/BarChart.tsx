type Datum = { label: string; value: number };

/** Horizontal labelled bars for a categorical count breakdown. No chart lib. */
export default function BarChart({
  data,
  topN = 8,
}: {
  data: Record<string, number>;
  topN?: number;
}) {
  const entries: Datum[] = Object.entries(data)
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value);

  const total = entries.reduce((s, e) => s + e.value, 0) || 1;

  let shown = entries;
  if (entries.length > topN) {
    const top = entries.slice(0, topN);
    const otherVal = entries.slice(topN).reduce((s, e) => s + e.value, 0);
    shown = otherVal > 0 ? [...top, { label: "Other", value: otherVal }] : top;
  }
  const max = Math.max(...shown.map((e) => e.value), 1);

  if (shown.length === 0) {
    return <p className="text-sm text-slate-400">No data yet.</p>;
  }

  return (
    <div className="space-y-2">
      {shown.map((e) => (
        <div key={e.label}>
          <div className="mb-0.5 flex justify-between text-xs text-slate-600">
            <span className="truncate pr-2">{e.label}</span>
            <span className="tabular-nums">
              {e.value} ({Math.round((e.value / total) * 100)}%)
            </span>
          </div>
          <div className="h-2 rounded bg-slate-100">
            <div
              className="h-2 rounded bg-blue-500"
              style={{ width: `${(e.value / max) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
