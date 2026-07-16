"use client";

import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import {
  ProfileFieldKey,
  ProfileFormErrors,
  ProfileFormValues,
  buildApiProfile,
  toFormValues,
  validateProfileForm,
} from "./schema";

export type SaveState = "idle" | "saving" | "saved" | "error";

/**
 * Fetch/edit/save state for the profile form. Keeps the raw fetched profile
 * around so saves preserve fields the form doesn't know about (the update
 * endpoint replaces the whole profile object).
 */
export function useProfile() {
  const [rawProfile, setRawProfile] = useState<Record<string, unknown>>({});
  const [values, setValues] = useState<ProfileFormValues | null>(null);
  const [savedValues, setSavedValues] = useState<ProfileFormValues | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [errors, setErrors] = useState<ProfileFormErrors>({});
  const [saveState, setSaveState] = useState<SaveState>("idle");

  // No synchronous setState before the first await — this runs from an
  // effect and react-hooks/set-state-in-effect forbids sync updates there.
  const load = useCallback(async () => {
    try {
      const res = await axios.get("/api/accounts/profile/get");
      const raw = (res.data?.profile ?? {}) as Record<string, unknown>;
      const formValues = toFormValues(raw);
      setRawProfile(raw);
      setValues(formValues);
      setSavedValues(formValues);
      setLoadError(false);
    } catch {
      setLoadError(true);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const setValue = useCallback((key: ProfileFieldKey, value: string) => {
    setValues((prev) => (prev ? { ...prev, [key]: value } : prev));
    setErrors((prev) => {
      if (!(key in prev)) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
    setSaveState("idle");
  }, []);

  const save = useCallback(async () => {
    if (!values) return false;

    const validationErrors = validateProfileForm(values);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return false;

    setSaveState("saving");
    try {
      const profile = buildApiProfile(rawProfile, values);
      await axios.post("/api/accounts/profile/update", { profile });
      setRawProfile(profile);
      setSavedValues(values);
      setSaveState("saved");
      return true;
    } catch {
      setSaveState("error");
      return false;
    }
  }, [values, rawProfile]);

  const isDirty =
    values !== null &&
    savedValues !== null &&
    JSON.stringify(values) !== JSON.stringify(savedValues);

  return {
    loading: values === null && !loadError,
    loadError,
    reload: load,
    values,
    setValue,
    errors,
    save,
    saveState,
    isDirty,
  };
}
