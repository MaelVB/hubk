import type { JwtVerifierPort, RawIdpClaims } from "@hubk/auth-core";
import { createRemoteJWKSet, jwtVerify } from "jose";

export class JwtVerifier implements JwtVerifierPort {
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
