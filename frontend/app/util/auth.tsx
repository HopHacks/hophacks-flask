"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

type AuthContextValue = {
  isLoggedIn: boolean | null; // null = checking
  token: string;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function configureAxios() {
  const baseURL = process.env.NEXT_PUBLIC_BACKENDURL; // set this in .env.local
  if (baseURL) axios.defaults.baseURL = baseURL;
  axios.defaults.withCredentials = true; // important if refresh uses cookies
}

function setAuthHeader(tok: string | null) {
  if (tok) axios.defaults.headers.common["Authorization"] = `Bearer ${tok}`;
  else delete axios.defaults.headers.common["Authorization"];
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const refreshTimer = useRef<number | null>(null);

  const clearTimer = useCallback(() => {
    if (refreshTimer.current !== null) {
      window.clearTimeout(refreshTimer.current);
      refreshTimer.current = null;
    }
  }, []);

  const scheduleRefresh = useCallback(
    (ms: number) => {
      clearTimer();
      refreshTimer.current = window.setTimeout(() => {
        refreshToken();
      }, ms);
    },
    [clearTimer],
  );

  const refreshToken = useCallback(async () => {
    if (isLoggedIn === false) return;

    try {
      const res = await axios.get("/api/auth/session/refresh");
      const tok = res.data?.access_token as string;

      setAuthHeader(tok);
      setToken(tok);
      setIsLoggedIn(true);

      scheduleRefresh(60_000);
    } catch {
      setAuthHeader(null);
      setToken("");
      setIsLoggedIn(false);
      clearTimer();
    }
  }, [isLoggedIn, scheduleRefresh, clearTimer]);

  const login = useCallback(
    async (email: string, password: string) => {
      const res = await axios.post("/api/auth/login", {
        username: email,
        password,
      });

      const tok = res.data?.access_token as string;
      setAuthHeader(tok);
      setToken(tok);
      setIsLoggedIn(true);

      scheduleRefresh(60_000);
    },
    [scheduleRefresh],
  );

  const logout = useCallback(async () => {
    setAuthHeader(null);
    setToken("");
    setIsLoggedIn(false);
    clearTimer();

    try {
      await axios.get("/api/auth/session/logout");
    } catch {
      // ignore
    }
  }, [clearTimer]);

  useEffect(() => {
    configureAxios();
    refreshToken();
    return () => clearTimer();
  }, [refreshToken, clearTimer]);

  // Self-heal a stale access token: if any API call comes back 401 (e.g. the
  // in-memory token expired while the tab was asleep), refresh the session
  // once and retry the original request. Auth endpoints are excluded so a
  // failed login/refresh can't loop.
  useEffect(() => {
    const id = axios.interceptors.response.use(
      (res) => res,
      async (error: AxiosError) => {
        const cfg = error.config as
          | (InternalAxiosRequestConfig & { _authRetried?: boolean })
          | undefined;
        const url = String(cfg?.url ?? "");
        if (
          !cfg ||
          error.response?.status !== 401 ||
          cfg._authRetried ||
          url.includes("/api/auth/")
        ) {
          return Promise.reject(error);
        }
        cfg._authRetried = true;
        try {
          const res = await axios.get("/api/auth/session/refresh");
          const tok = res.data?.access_token as string;
          setAuthHeader(tok);
          setToken(tok);
          setIsLoggedIn(true);
          cfg.headers.Authorization = `Bearer ${tok}`;
          return axios(cfg);
        } catch {
          return Promise.reject(error);
        }
      },
    );
    return () => axios.interceptors.response.eject(id);
  }, []);

  const value = useMemo(
    () => ({ isLoggedIn, token, login, logout, refreshToken }),
    [isLoggedIn, token, login, logout, refreshToken],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider />");
  return ctx;
}
