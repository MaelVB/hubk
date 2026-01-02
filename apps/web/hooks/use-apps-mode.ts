import { useEffect, useState } from "react";
import type { AppsMode } from "@hubk/shared";
import { fetchAppsConfig } from "../lib/api";

type UseAppsModeState = {
  mode: AppsMode | null;
  loading: boolean;
  error: string | null;
};

export const useAppsMode = (accessToken?: string): UseAppsModeState => {
  const [mode, setMode] = useState<AppsMode | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!accessToken) {
      setMode(null);
      setLoading(false);
      setError(null);
      return;
    }

    let isActive = true;

    const loadMode = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchAppsConfig(accessToken);
        if (!isActive) {
          return;
        }
        setMode(data.appsMode);
      } catch (err) {
        if (!isActive) {
          return;
        }
        setError(err instanceof Error ? err.message : "Failed to load configuration");
        setMode(null);
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    loadMode();

    return () => {
      isActive = false;
    };
  }, [accessToken]);

  return { mode, loading, error };
};
