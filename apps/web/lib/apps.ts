import type { AppSummary } from "@hubk/shared";

export const getAppDisplayName = (app: AppSummary): string => app.name ?? app.slug;

export const getAppInitials = (displayName: string): string =>
  displayName
    .split(" ")
    .filter(Boolean)
    .map((chunk) => chunk[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

export const filterApps = (apps: AppSummary[], query: string): AppSummary[] => {
  const trimmedQuery = query.trim().toLowerCase();
  if (!trimmedQuery) {
    return apps;
  }

  return apps.filter((app) => {
    const fields = [
      getAppDisplayName(app),
      app.slug,
      app.description,
      app.notes
    ].filter((value): value is string => Boolean(value));
    return fields.some((value) => value.toLowerCase().includes(trimmedQuery));
  });
};
