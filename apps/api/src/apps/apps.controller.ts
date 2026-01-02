import { Controller, Get, Req, UseGuards } from "@nestjs/common";
import type {
  AppsConfigResponse,
  AppsResponse,
  MeResponse,
  NormalizedUserClaims
} from "@hubk/shared";
import type { Request } from "express";
import { AppsService } from "./apps.service";
import { AuthGuard, AuthenticatedRequest } from "../auth/auth.guard";

@Controller()
export class AppsController {
  constructor(private readonly appsService: AppsService) {}

  @UseGuards(AuthGuard)
  @Get("/me")
  me(@Req() request: Request): MeResponse {
    const user = (request as AuthenticatedRequest).user as NormalizedUserClaims;
    return { user };
  }

  @UseGuards(AuthGuard)
  @Get("/apps")
  async list(@Req() request: Request): Promise<AppsResponse> {
    const authReq = request as AuthenticatedRequest;
    const user = authReq.user as NormalizedUserClaims;
    const apps = await this.appsService.listAppsForUser(user, authReq.accessToken);
    return { apps };
  }

  @UseGuards(AuthGuard)
  @Get("/apps/config")
  config(): AppsConfigResponse {
    return { appsMode: this.appsService.getAppsMode() };
  }
}
