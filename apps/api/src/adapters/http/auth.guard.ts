import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException
} from "@nestjs/common";
import type { Request } from "express";
import type { IdpClaimsPort, JwtVerifierPort } from "@hubk/auth-core";
import type { NormalizedUserClaims } from "@hubk/shared";

export type AuthenticatedRequest = Request & {
  user?: NormalizedUserClaims;
};

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtVerifier: JwtVerifierPort,
    private readonly claimsAdapter: IdpClaimsPort
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const header = request.headers.authorization;

    if (!header?.startsWith("Bearer ")) {
      throw new UnauthorizedException("Missing bearer token");
    }

    const token = header.replace("Bearer ", "").trim();
    if (!token) {
      throw new UnauthorizedException("Missing bearer token");
    }

    try {
      const claims = await this.jwtVerifier.verify(token);
      request.user = this.claimsAdapter.normalize(claims);
      return true;
    } catch (error) {
      throw new UnauthorizedException("Invalid token");
    }
  }
}
