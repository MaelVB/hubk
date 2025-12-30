import type { AppRepositoryPort } from "../../application/ports/app-repository.port";
import type { App } from "../../domain/entities";
import { Repository } from "typeorm";
import { AppEntity } from "../typeorm/app.entity";

export class TypeormAppRepository implements AppRepositoryPort {
  constructor(private readonly repository: Repository<AppEntity>) {}

  async findAppsForClaims(groups: string[], roles: string[]): Promise<App[]> {
    if (groups.length === 0 && roles.length === 0) {
      return [];
    }

    const qb = this.repository
      .createQueryBuilder("app")
      .leftJoinAndSelect("app.accessRules", "accessRule")
      .where(
        "(accessRule.claimType = :groupType AND accessRule.claimValue IN (:...groups))",
        { groupType: "GROUP", groups: groups.length ? groups : [""] }
      )
      .orWhere(
        "(accessRule.claimType = :roleType AND accessRule.claimValue IN (:...roles))",
        { roleType: "ROLE", roles: roles.length ? roles : [""] }
      );

    const entities = await qb.getMany();

    return entities.map((entity) => ({
      id: entity.id,
      slug: entity.slug,
      name: entity.name,
      description: entity.description,
      iconUrl: entity.iconUrl,
      targetUrl: entity.targetUrl,
      accessRules: entity.accessRules?.map((rule) => ({
        id: rule.id,
        appId: entity.id,
        claimType: rule.claimType,
        claimValue: rule.claimValue
      })) ?? []
    }));
  }
}
