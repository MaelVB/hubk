import type { NormalizedUserClaims } from "@hubk/shared";

export type RawIdpClaims = Record<string, unknown>;

export interface IdpClaimsPort {
  normalize(claims: RawIdpClaims): NormalizedUserClaims;
}

export interface JwtVerifierPort {
  verify(token: string): Promise<RawIdpClaims>;
}
