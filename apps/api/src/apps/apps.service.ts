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

  async listAppsForUser(user: NormalizedUserClaims): Promise<AppSummary[]> {
    const idpApps = await this.idpApps.listAppsForUser(user);
    const idpSlugs = idpApps.map((app) => app.slug);

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

    const rules = await this.accessRuleRepository
      .createQueryBuilder("rule")
      .select(["rule.appId"])
      .where(
        "(rule.claimType = :groupType AND rule.claimValue IN (:...groups))",
        { groupType: "GROUP", groups: groups.length ? groups : [""] }
      )
      .orWhere(
        "(rule.claimType = :roleType AND rule.claimValue IN (:...roles))",
        { roleType: "ROLE", roles: roles.length ? roles : [""] }
      )
      .getMany();

    return rules.map((rule) => rule.appId);
  }
}
