import { Injectable, UnauthorizedException, Logger } from "@nestjs/common";
import type { IdpAdapter } from "@hubk/auth-core";
import type { NormalizedUserClaims } from "@hubk/shared";

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(private readonly idpAdapter: IdpAdapter) {}

  async authenticate(token: string): Promise<NormalizedUserClaims> {
    try {
      this.logger.debug(`Verifying token: ${token.substring(0, 20)}...`);
      const claims = await this.idpAdapter.jwtVerifier.verify(token);
      this.logger.debug(`Token verified successfully for subject: ${claims.sub}`);
      return this.idpAdapter.claims.normalize(claims);
    } catch (error) {
      this.logger.error(`Token verification failed: ${error instanceof Error ? error.message : String(error)}`);
      throw new UnauthorizedException("Invalid token");
    }
  }
}
