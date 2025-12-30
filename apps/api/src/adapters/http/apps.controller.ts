import { Controller, Get, Req, UseGuards } from "@nestjs/common";
import type { AppsResponse, MeResponse } from "@hubk/shared";
import type { NormalizedUserClaims } from "@hubk/shared";
import { AuthGuard, AuthenticatedRequest } from "./auth.guard";
import { ListAppsForUserService } from "../../application/services/list-apps-for-user.service";
import { GetMeService } from "../../application/services/get-me.service";
import type { Request } from "express";

@Controller()
export class AppsController {
  constructor(
    private readonly listApps: ListAppsForUserService,
    private readonly getMe: GetMeService
  ) {}

  @UseGuards(AuthGuard)
  @Get("/me")
  async me(@Req() request: Request): Promise<MeResponse> {
    const user = (request as AuthenticatedRequest).user as NormalizedUserClaims;
    return { user: this.getMe.execute(user) };
  }

  @UseGuards(AuthGuard)
  @Get("/apps")
  async list(@Req() request: Request): Promise<AppsResponse> {
    const user = (request as AuthenticatedRequest).user as NormalizedUserClaims;
    const apps = await this.listApps.execute(user.groups, user.roles);
    return {
      apps: apps.map((app) => ({
        id: app.id,
        slug: app.slug,
        name: app.name,
        description: app.description,
        iconUrl: app.iconUrl,
        targetUrl: app.targetUrl
      }))
    };
  }
}
