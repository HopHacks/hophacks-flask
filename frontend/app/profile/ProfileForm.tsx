"use client";

import { useId, useMemo } from "react";
import { ProfileFieldDef, ProfileFieldKey, visibleFields } from "./schema";
import { useProfile } from "./useProfile";
import { INPUT_CLS, BTN_PRIMARY, BTN_SECONDARY, Field, ErrorNote } from "./ui";

type FieldProps = {
  def: ProfileFieldDef;
  value: string;
  error?: string;
  onChange: (value: string) => void;
};

/**
 * Free-text input with suggestions from a large option list (e.g. ~9.7k
 * schools) via a native <datalist>. Options are filtered and capped here so
 * the DOM never holds the full list; typing a value not in the list is
 * still allowed.
 */
function AutocompleteInput({
  def,
  value,
  onChange,
}: Omit<FieldProps, "error">) {
  const listId = useId();

  const matches = useMemo(() => {
    const query = value.trim().toLowerCase();
    if (!query || !def.options) return [];
    const out: string[] = [];
    for (const option of def.options) {
      if (option.toLowerCase().includes(query)) {
        out.push(option);
        if (out.length >= 20) break;
      }
    }
    return out;
  }, [def.options, value]);

  return (
    <>
      <input
        type="text"
        list={listId}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={INPUT_CLS}
        placeholder={`Start typing your ${def.label.toLowerCase()}…`}
        autoComplete="off"
      />
      <datalist id={listId}>
        {matches.map((o) => (
          <option key={o} value={o} />
        ))}
      </datalist>
    </>
  );
}

function ProfileField({ def, value, error, onChange }: FieldProps) {
  const isKnownOption = def.options?.includes(value) ?? false;

  return (
    <div className={def.fullWidth ? "sm:col-span-2" : undefined}>
      <Field label={def.label} optional={!def.requiredMsg} error={error}>
        {def.type === "select" ? (
          <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={INPUT_CLS}
          >
            {/* Optional selects can be cleared back to empty. */}
            <option value="" disabled={!!def.requiredMsg}>
              Select…
            </option>
            {/* Stored values from older event years may not match the current
                option list (e.g. "male" vs "Man") — keep them visible. */}
            {value && !isKnownOption && <option value={value}>{value}</option>}
            {def.options?.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        ) : def.type === "autocomplete" ? (
          <AutocompleteInput def={def} value={value} onChange={onChange} />
        ) : (
          <input
            type={def.type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={INPUT_CLS}
          />
        )}
      </Field>
    </div>
  );
}

export function ProfileForm() {
  const {
    loading,
    loadError,
    reload,
    values,
    setValue,
    errors,
    save,
    saveState,
  } = useProfile();

  if (loadError) {
    return (
      <div className="flex flex-col items-center gap-4 text-white">
        <p>Could not load your profile.</p>
        <button type="button" className={BTN_SECONDARY} onClick={reload}>
          Retry
        </button>
      </div>
    );
  }

  if (loading || !values) {
    return <p className="text-center text-white">Loading profile…</p>;
  }

  const hasErrors = Object.keys(errors).length > 0;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        save();
      }}
      className="flex flex-col gap-5"
    >
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {visibleFields(values).map((def) => (
          <ProfileField
            key={def.key}
            def={def}
            value={values[def.key as ProfileFieldKey]}
            error={errors[def.key as ProfileFieldKey]}
            onChange={(v) => setValue(def.key as ProfileFieldKey, v)}
          />
        ))}
      </div>

      {hasErrors && <ErrorNote msg="Please fix the highlighted fields." />}
      {saveState === "error" && (
        <ErrorNote msg="Could not save — please try again." />
      )}

      <div className="mt-1 flex items-center justify-center gap-4">
        <button
          type="submit"
          className={BTN_PRIMARY}
          disabled={saveState === "saving"}
        >
          {saveState === "saving" ? "Saving…" : "Save Profile"}
        </button>
      </div>
      <div className="h-5 text-center">
        {saveState === "saved" && (
          <p className="text-sm text-green-300">Profile saved!</p>
        )}
      </div>
    </form>
  );
}
