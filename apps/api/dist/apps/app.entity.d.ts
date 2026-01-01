import { AccessRuleEntity } from "./access-rule.entity";
export declare class AppEntity {
    id: string;
    slug: string;
    name: string;
    description?: string;
    iconUrl?: string;
    targetUrl: string;
    accessRules: AccessRuleEntity[];
    createdAt: Date;
    updatedAt: Date;
}
//# sourceMappingURL=app.entity.d.ts.map