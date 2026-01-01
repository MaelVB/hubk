import { Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";
import type { AppSummary, NormalizedUserClaims } from "@hubk/shared";
import type { IdpAppsPort } from "@hubk/auth-core";
import { AppEntity } from "./app.entity";
import { AccessRuleEntity } from "./access-rule.entity";

@Injectable()
export class AppsService {
  constructor(
    @InjectRepository(AppEntity)
    private readonly appRepository: Repository<AppEntity>,
    @InjectRepository(AccessRuleEntity)
    private readonly accessRuleRepository: Repository<AccessRuleEntity>,
    @Inject("IDP_APPS")
    private readonly idpApps: IdpAppsPort
  ) {}

  async listAppsForUser(user: NormalizedUserClaims, accessToken?: string): Promise<AppSummary[]> {
    const idpApps = await this.idpApps.listAppsForUser(user, accessToken);
    const idpSlugs = idpApps.map((app: { slug: string }) => app.slug);

    const accessRuleAppIds = await this.findAppIdsByClaims(
      user.groups,
      user.roles
    );

    const appsByClaims = accessRuleAppIds.length
      ? await this.appRepository.find({
          where: { id: In(accessRuleAppIds) },
          relations: ["accessRules"]
        })
      : [];

    const appsByIdp = idpSlugs.length
      ? await this.appRepository.find({ where: { slug: In(idpSlugs) } })
      : [];

    const combined = new Map<string, AppEntity>();
    for (const app of [...appsByClaims, ...appsByIdp]) {
      combined.set(app.id, app);
    }

    return Array.from(combined.values()).map((app) => ({
      id: app.id,
      slug: app.slug,
      name: app.name,
      description: app.description,
      iconUrl: app.iconUrl,
      targetUrl: app.targetUrl
    }));
  }

  private async findAppIdsByClaims(
    groups: string[],
    roles: string[]
  ): Promise<string[]> {
    if (groups.length === 0 && roles.length === 0) {
      return [];
    }

    const queryBuilder = this.accessRuleRepository
      .createQueryBuilder("rule")
      .select(["rule.appId"]);

    const conditions: string[] = [];
    const parameters: Record<string, unknown> = {};

    if (groups.length > 0) {
      conditions.push("(rule.claimType = :groupType AND rule.claimValue IN (:...groups))");
      parameters.groupType = "GROUP";
      parameters.groups = groups;
    }

    if (roles.length > 0) {
      conditions.push("(rule.claimType = :roleType AND rule.claimValue IN (:...roles))");
      parameters.roleType = "ROLE";
      parameters.roles = roles;
    }

    if (conditions.length === 0) {
      return [];
    }

    queryBuilder.where(conditions.join(" OR "), parameters);
    const rules = await queryBuilder.getMany();

    return rules.map((rule) => rule.appId);
  }
}
