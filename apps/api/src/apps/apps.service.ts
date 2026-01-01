import { Inject, Injectable, Optional } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";
import type { AppSummary, NormalizedUserClaims } from "@hubk/shared";
import type { IdpAppAccess, IdpAppsPort } from "@hubk/auth-core";
import { AppEntity } from "./app.entity";
import { AccessRuleEntity } from "./access-rule.entity";

@Injectable()
export class AppsService {
  constructor(
    @Optional()
    @InjectRepository(AppEntity)
    private readonly appRepository?: Repository<AppEntity>,
    @Optional()
    @InjectRepository(AccessRuleEntity)
    private readonly accessRuleRepository?: Repository<AccessRuleEntity>,
    @Inject("IDP_APPS")
    private readonly idpApps: IdpAppsPort,
    private readonly configService: ConfigService
  ) {}

  async listAppsForUser(user: NormalizedUserClaims, accessToken?: string): Promise<AppSummary[]> {
    const idpApps = await this.idpApps.listAppsForUser(user, accessToken);
    const idpSlugs = idpApps.map((app) => app.slug);
    const idpSlugSet = new Set(idpSlugs);

    if (!this.isDbEnabled()) {
      const dynamicApps = idpApps
        .map((app) => this.mapIdpApp(app))
        .filter((app): app is AppSummary => app !== null);
      return this.sortApps(dynamicApps);
    }

    const accessRuleAppIds = await this.findAppIdsByClaims(
      user.groups,
      user.roles
    );

    const appsByClaims = accessRuleAppIds.length
      ? await this.appRepository!.find({
          where: { id: In(accessRuleAppIds) },
          relations: ["accessRules"]
        })
      : [];

    const appsByIdp = idpSlugs.length
      ? await this.appRepository!.find({ where: { slug: In(idpSlugs) } })
      : [];

    const overridesBySlug = new Map(appsByIdp.map((app) => [app.slug, app]));
    const dynamicSummaries = idpApps
      .map((app) => this.mergeIdpApp(app, overridesBySlug.get(app.slug)))
      .filter((app): app is AppSummary => app !== null);

    const manualSummaries = appsByClaims
      .filter((app) => !idpSlugSet.has(app.slug))
      .map((app) => this.mapDbApp(app))
      .filter((app): app is AppSummary => app !== null);

    return this.sortApps([...dynamicSummaries, ...manualSummaries]);
  }

  private async findAppIdsByClaims(
    groups: string[],
    roles: string[]
  ): Promise<string[]> {
    if (!this.accessRuleRepository) {
      return [];
    }

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

  private mapIdpApp(app: IdpAppAccess): AppSummary | null {
    const targetUrl = this.pickText(app.targetUrl);
    if (!targetUrl) {
      return null;
    }

    return {
      id: app.id ?? app.slug,
      slug: app.slug,
      name: this.pickText(app.name) ?? app.slug,
      description: this.pickText(app.description),
      iconUrl: this.pickText(app.iconUrl),
      notes: this.pickText(app.notes),
      widgetColor: this.pickText(app.widgetColor),
      sortOrder: app.sortOrder,
      targetUrl
    };
  }

  private mergeIdpApp(app: IdpAppAccess, override?: AppEntity): AppSummary | null {
    const base = this.mapIdpApp(app);
    if (!base) {
      return null;
    }

    if (!override) {
      return base;
    }

    if (override.isVisible === false) {
      return null;
    }

    const name = this.pickText(override.name) ?? base.name;
    const description = this.pickText(override.description) ?? base.description;
    const iconUrl = this.pickText(override.iconUrl) ?? base.iconUrl;
    const targetUrl = this.pickText(override.targetUrl) ?? base.targetUrl;

    return {
      id: override.id ?? base.id,
      slug: base.slug,
      name,
      description,
      iconUrl,
      notes: this.pickText(override.notes) ?? base.notes,
      widgetColor: this.pickText(override.widgetColor) ?? base.widgetColor,
      sortOrder: override.sortOrder ?? base.sortOrder,
      targetUrl
    };
  }

  private mapDbApp(app: AppEntity): AppSummary | null {
    if (app.isVisible === false) {
      return null;
    }

    const targetUrl = this.pickText(app.targetUrl);
    if (!targetUrl) {
      return null;
    }

    return {
      id: app.id,
      slug: app.slug,
      name: this.pickText(app.name) ?? app.slug,
      description: this.pickText(app.description),
      iconUrl: this.pickText(app.iconUrl),
      notes: this.pickText(app.notes),
      widgetColor: this.pickText(app.widgetColor),
      sortOrder: app.sortOrder,
      targetUrl
    };
  }

  private sortApps(apps: AppSummary[]): AppSummary[] {
    return apps.sort((a, b) => {
      const orderA = typeof a.sortOrder === "number" ? a.sortOrder : Number.MAX_SAFE_INTEGER;
      const orderB = typeof b.sortOrder === "number" ? b.sortOrder : Number.MAX_SAFE_INTEGER;
      if (orderA !== orderB) {
        return orderA - orderB;
      }
      return a.name.localeCompare(b.name, "fr", { sensitivity: "base" });
    });
  }

  private pickText(value?: string | null): string | undefined {
    if (typeof value !== "string") {
      return undefined;
    }
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : undefined;
  }

  private isDbEnabled(): boolean {
    const mode = String(this.configService.get("APPS_MODE") ?? "hybrid").toLowerCase();
    return mode !== "dynamic" && !!this.appRepository && !!this.accessRuleRepository;
  }
}
