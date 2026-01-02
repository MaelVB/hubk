import type { AppsConfigResponse, AppsResponse } from "@hubk/shared";
import { getApiBaseUrl } from "./runtime-env";

const requestJson = async <T>(
  path: string,
  accessToken: string,
  errorLabel: string
): Promise<T> => {
  const apiBaseUrl = getApiBaseUrl();
  if (!apiBaseUrl) {
    throw new Error("Missing API base URL configuration");
  }

  const response = await fetch(`${apiBaseUrl}${path}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });

  if (!response.ok) {
    throw new Error(`${errorLabel}: ${response.status} ${response.statusText}`);
  }

  return response.json() as Promise<T>;
};

export const fetchApps = (accessToken: string) =>
  requestJson<AppsResponse>("/apps", accessToken, "Failed to load applications");

export const fetchAppsConfig = (accessToken: string) =>
  requestJson<AppsConfigResponse>("/apps/config", accessToken, "Failed to load configuration");
