import type { NormalizedUserClaims } from "@hubk/shared";

export type RawIdpClaims = Record<string, unknown>;

export interface IdpClaimsPort {
  normalize(claims: RawIdpClaims): NormalizedUserClaims;
}

export type IdpAppAccess = {
  slug: string;
};

export interface IdpAppsPort {
  listAppsForUser(user: NormalizedUserClaims): Promise<IdpAppAccess[]>;
}

export interface JwtVerifierPort {
  verify(token: string): Promise<RawIdpClaims>;
}

export type IdpAdapter = {
  claims: IdpClaimsPort;
  jwtVerifier: JwtVerifierPort;
  apps: IdpAppsPort;
};
