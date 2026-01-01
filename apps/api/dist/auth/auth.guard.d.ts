import { CanActivate, ExecutionContext } from "@nestjs/common";
import type { Request } from "express";
import type { NormalizedUserClaims } from "@hubk/shared";
import { AuthService } from "./auth.service";
export type AuthenticatedRequest = Request & {
    user?: NormalizedUserClaims;
};
export declare class AuthGuard implements CanActivate {
    private readonly authService;
    constructor(authService: AuthService);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
//# sourceMappingURL=auth.guard.d.ts.map