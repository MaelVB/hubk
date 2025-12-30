export type AccessRuleType = "GROUP" | "ROLE";

export type AccessRule = {
  id: string;
  appId: string;
  claimType: AccessRuleType;
  claimValue: string;
};

export type App = {
  id: string;
  slug: string;
  name: string;
  description?: string;
  iconUrl?: string;
  targetUrl: string;
  accessRules: AccessRule[];
};

export type User = {
  subject: string;
  email?: string;
  displayName?: string;
  groups: string[];
  roles: string[];
};
