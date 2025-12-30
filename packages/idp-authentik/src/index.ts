import type {
  IdpAdapter,
  IdpAppsPort,
  IdpClaimsPort,
  RawIdpClaims
} from "@hubk/auth-core";
import type { NormalizedUserClaims } from "@hubk/shared";
import { createRemoteJWKSet, jwtVerify } from "jose";

export type AuthentikAdapterConfig = {
  issuer: string;
  audience: string;
  jwksUrl?: string;
  appsEndpoint?: string;
};

class AuthentikClaimsAdapter implements IdpClaimsPort {
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

class AuthentikJwtVerifier {
  private readonly jwks;

  constructor(
    private readonly issuer: string,
    private readonly audience: string,
    jwksUrl?: string
  ) {
    const jwksEndpoint = jwksUrl ?? `${issuer.replace(/\/$/, "")}/.well-known/jwks.json`;
    this.jwks = createRemoteJWKSet(new URL(jwksEndpoint));
  }

  async verify(token: string): Promise<RawIdpClaims> {
    const { payload } = await jwtVerify(token, this.jwks, {
      issuer: this.issuer,
      audience: this.audience
    });

    return payload as RawIdpClaims;
  }
}

class AuthentikAppsAdapter implements IdpAppsPort {
  constructor(private readonly endpoint?: string) {}

  async listAppsForUser(user: NormalizedUserClaims): Promise<{ slug: string }[]> {
    if (!this.endpoint) {
      return [];
    }

    const response = await fetch(this.endpoint, {
      headers: {
        "Content-Type": "application/json",
        "X-User-Sub": user.subject
      }
    });

    if (!response.ok) {
      return [];
    }

    const data = (await response.json()) as { apps?: { slug: string }[] };
    return data.apps ?? [];
  }
}

export function createAuthentikAdapter(config: AuthentikAdapterConfig): IdpAdapter {
  return {
    claims: new AuthentikClaimsAdapter(),
    jwtVerifier: new AuthentikJwtVerifier(
      config.issuer,
      config.audience,
      config.jwksUrl
    ),
    apps: new AuthentikAppsAdapter(config.appsEndpoint)
  };
}
