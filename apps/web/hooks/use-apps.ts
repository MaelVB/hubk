import { useCallback, useEffect, useState } from "react";
import type { AppSummary } from "@hubk/shared";
import { fetchApps } from "../lib/api";

type UseAppsState = {
  apps: AppSummary[];
  loading: boolean;
  error: string | null;
  reload: () => void;
};

export const useApps = (accessToken?: string): UseAppsState => {
  const [apps, setApps] = useState<AppSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  const reload = useCallback(() => {
    setReloadKey((value) => value + 1);
  }, []);

  useEffect(() => {
    if (!accessToken) {
      setApps([]);
      setLoading(false);
      setError(null);
      return;
    }

    let isActive = true;

    const loadApps = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchApps(accessToken);
        if (!isActive) {
          return;
        }
        setApps(data.apps ?? []);
      } catch (err) {
        if (!isActive) {
          return;
        }
        setError(err instanceof Error ? err.message : "Failed to load applications");
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    loadApps();

    return () => {
      isActive = false;
    };
  }, [accessToken, reloadKey]);

  return { apps, loading, error, reload };
};
