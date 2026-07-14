"use client";

import { useEffect, useId, useState } from "react";

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
        {(loaded ?? []).map((opt) => (
          <option key={opt} value={opt} />
        ))}
      </datalist>
    </>
  );
}
