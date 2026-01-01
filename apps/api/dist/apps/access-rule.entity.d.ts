import { AppEntity } from "./app.entity";
export type AccessRuleClaimType = "GROUP" | "ROLE";
export declare class AccessRuleEntity {
    id: string;
    claimType: AccessRuleClaimType;
    claimValue: string;
    appId: string;
    app: AppEntity;
}
//# sourceMappingURL=access-rule.entity.d.ts.map