"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const app_entity_1 = require("./app.entity");
const access_rule_entity_1 = require("./access-rule.entity");
let AppsService = class AppsService {
    appRepository;
    accessRuleRepository;
    idpApps;
    constructor(appRepository, accessRuleRepository, idpApps) {
        this.appRepository = appRepository;
        this.accessRuleRepository = accessRuleRepository;
        this.idpApps = idpApps;
    }
    async listAppsForUser(user) {
        const idpApps = await this.idpApps.listAppsForUser(user);
        const idpSlugs = idpApps.map((app) => app.slug);
        const accessRuleAppIds = await this.findAppIdsByClaims(user.groups, user.roles);
        const appsByClaims = accessRuleAppIds.length
            ? await this.appRepository.find({
                where: { id: (0, typeorm_2.In)(accessRuleAppIds) },
                relations: ["accessRules"]
            })
            : [];
        const appsByIdp = idpSlugs.length
            ? await this.appRepository.find({ where: { slug: (0, typeorm_2.In)(idpSlugs) } })
            : [];
        const combined = new Map();
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
    async findAppIdsByClaims(groups, roles) {
        if (groups.length === 0 && roles.length === 0) {
            return [];
        }
        const queryBuilder = this.accessRuleRepository
            .createQueryBuilder("rule")
            .select(["rule.appId"]);
        const conditions = [];
        const parameters = {};
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
};
exports.AppsService = AppsService;
exports.AppsService = AppsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(app_entity_1.AppEntity)),
    __param(1, (0, typeorm_1.InjectRepository)(access_rule_entity_1.AccessRuleEntity)),
    __param(2, (0, common_1.Inject)("IDP_APPS")),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository, Object])
], AppsService);
//# sourceMappingURL=apps.service.js.map