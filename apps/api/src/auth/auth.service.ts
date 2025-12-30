import { Injectable, UnauthorizedException } from "@nestjs/common";
import type { IdpAdapter } from "@hubk/auth-core";
import type { NormalizedUserClaims } from "@hubk/shared";

@Injectable()
export class AuthService {
  constructor(private readonly idpAdapter: IdpAdapter) {}

  async authenticate(token: string): Promise<NormalizedUserClaims> {
    try {
      const claims = await this.idpAdapter.jwtVerifier.verify(token);
      return this.idpAdapter.claims.normalize(claims);
    } catch (error) {
      throw new UnauthorizedException("Invalid token");
    }
  }
}
