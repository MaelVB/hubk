import type { IdpClaimsPort, RawIdpClaims } from "@hubk/auth-core";
import type { NormalizedUserClaims } from "@hubk/shared";

// Authentik-specific claim normalization. The rest of the app only uses the normalized shape.
export class AuthentikOIDCClaimsAdapter implements IdpClaimsPort {
  normalize(claims: RawIdpClaims): NormalizedUserClaims {
    const groups = Array.isArray(claims.groups)
      ? (claims.groups as string[])
      : [];
    const roles = Array.isArray(claims.roles) ? (claims.roles as string[]) : [];

    return {
      subject: String(claims.sub ?? ""),
      email: typeof claims.email === "string" ? claims.email : undefined,
      displayName: typeof claims.name === "string" ? claims.name : undefined,
      groups,
      roles
    };
  }
}
