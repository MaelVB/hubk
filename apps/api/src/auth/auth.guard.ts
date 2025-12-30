import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException
} from "@nestjs/common";
import type { Request } from "express";
import type { NormalizedUserClaims } from "@hubk/shared";
import { AuthService } from "./auth.service";

export type AuthenticatedRequest = Request & {
  user?: NormalizedUserClaims;
};

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

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

    request.user = await this.authService.authenticate(token);
    return true;
  }
}
