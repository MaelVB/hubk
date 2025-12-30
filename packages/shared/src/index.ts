export type NormalizedUserClaims = {
  subject: string;
  email?: string;
  displayName?: string;
  groups: string[];
  roles: string[];
};

export type AppSummary = {
  id: string;
  slug: string;
  name: string;
  description?: string;
  iconUrl?: string;
  targetUrl: string;
};

export type MeResponse = {
  user: NormalizedUserClaims;
};

export type AppsResponse = {
  apps: AppSummary[];
};
