import { ReactNode } from "react";

type Props = {
  title: string;
  children: ReactNode;
};

export default function Panel({ title, children }: Props) {
  return (
    <section className="p-4 bg-white border shadow-sm rounded-xl border-slate-200">
      <div className="mb-3 text-sm font-medium text-slate-900">{title}</div>
      {children}
    </section>
  );
}
