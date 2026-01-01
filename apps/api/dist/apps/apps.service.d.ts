import { Repository } from "typeorm";
import type { AppSummary, NormalizedUserClaims } from "@hubk/shared";
import type { IdpAppsPort } from "@hubk/auth-core";
import { AppEntity } from "./app.entity";
import { AccessRuleEntity } from "./access-rule.entity";
export declare class AppsService {
    private readonly appRepository;
    private readonly accessRuleRepository;
    private readonly idpApps;
    constructor(appRepository: Repository<AppEntity>, accessRuleRepository: Repository<AccessRuleEntity>, idpApps: IdpAppsPort);
    listAppsForUser(user: NormalizedUserClaims): Promise<AppSummary[]>;
    private findAppIdsByClaims;
}
//# sourceMappingURL=apps.service.d.ts.map