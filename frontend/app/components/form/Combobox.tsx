"use client";

import { useEffect, useId, useMemo, useState } from "react";

/* Mobile Safari hangs or crashes the tab when a <datalist> holds thousands
   of options (the schools list is ~9.7k), so only a capped, pre-filtered
   slice is ever mounted; the browser then matches within that slice. */
const MAX_VISIBLE_OPTIONS = 50;

const INPUT_CLS = "input-sketch w-full rounded-lg px-4 py-2.5 text-base";

type Props = {
  value: string;
  onChange: (v: string) => void;
  /** Static list, or a loader (for large lists that should be code-split). */
  options?: string[];
  loadOptions?: () => Promise<string[]>;
  placeholder?: string;
  required?: boolean;
};

/**
 * Type-to-filter picker over a large option list using a native <datalist>.
 * The browser handles filtering/keyboard/a11y, free text is allowed (needed for
 * the school "Other" fallback), and big lists can be lazily loaded on first
 * focus so they stay off the critical path.
 */
export default function Combobox({
  value,
  onChange,
  options,
  loadOptions,
  placeholder,
  required,
}: Props) {
  const listId = useId();
  const [loaded, setLoaded] = useState<string[] | null>(options ?? null);

  useEffect(() => {
    if (options) setLoaded(options);
  }, [options]);

  async function handleFocus() {
    if (loaded === null && loadOptions) {
      setLoaded(await loadOptions());
    }
  }

  const visible = useMemo(() => {
    const all = loaded ?? [];
    const q = value.trim().toLowerCase();
    const matches = q ? all.filter((o) => o.toLowerCase().includes(q)) : all;
    return matches.slice(0, MAX_VISIBLE_OPTIONS);
  }, [loaded, value]);

  return (
    <>
      <input
        type="text"
        list={listId}
        value={value}
        placeholder={placeholder}
        required={required}
        onFocus={handleFocus}
        onChange={(e) => onChange(e.target.value)}
        className={INPUT_CLS}
        autoComplete="off"
      />
      <datalist id={listId}>
        {visible.map((opt) => (
          <option key={opt} value={opt} />
        ))}
      </datalist>
    </>
  );
}
