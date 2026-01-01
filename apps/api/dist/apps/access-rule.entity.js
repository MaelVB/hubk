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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccessRuleEntity = void 0;
const typeorm_1 = require("typeorm");
const app_entity_1 = require("./app.entity");
let AccessRuleEntity = class AccessRuleEntity {
    id;
    claimType;
    claimValue;
    appId;
    app;
};
exports.AccessRuleEntity = AccessRuleEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], AccessRuleEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], AccessRuleEntity.prototype, "claimType", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], AccessRuleEntity.prototype, "claimValue", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "appId" }),
    __metadata("design:type", String)
], AccessRuleEntity.prototype, "appId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => app_entity_1.AppEntity, (app) => app.accessRules, { onDelete: "CASCADE" }),
    (0, typeorm_1.JoinColumn)({ name: "appId" }),
    __metadata("design:type", app_entity_1.AppEntity)
], AccessRuleEntity.prototype, "app", void 0);
exports.AccessRuleEntity = AccessRuleEntity = __decorate([
    (0, typeorm_1.Entity)({ name: "access_rules" })
], AccessRuleEntity);
//# sourceMappingURL=access-rule.entity.js.map