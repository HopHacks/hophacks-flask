'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const nav = [
  { label: 'HopHacks Overview', href: '/overview' },
  { label: 'HopHacks Accounts', href: '/accounts' },
  { label: 'HopHacks Stats', href: '/stats' },
  { label: 'Applications', href: '/applications' }
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="px-6 py-8 border-r w-72 shrink-0 bg-slate-200/80 border-slate-300">
      <div className="mb-10">
        <div className="text-sm font-semibold tracking-wide text-slate-800">HOPHACKS</div>
        <div className="text-xs text-slate-600">Analytics Panel</div>
      </div>

      <nav className="space-y-2">
        {nav.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + '/');

          return (
            <Link
              key={item.href}
              href={item.href}
              className={[
                'block rounded-lg px-4 py-2 text-sm transition',
                active ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-700 hover:bg-slate-300/70'
              ].join(' ')}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
