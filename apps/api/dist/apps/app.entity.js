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
exports.AppEntity = void 0;
const typeorm_1 = require("typeorm");
const access_rule_entity_1 = require("./access-rule.entity");
let AppEntity = class AppEntity {
    id;
    slug;
    name;
    description;
    iconUrl;
    targetUrl;
    accessRules;
    createdAt;
    updatedAt;
};
exports.AppEntity = AppEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], AppEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], AppEntity.prototype, "slug", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], AppEntity.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], AppEntity.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], AppEntity.prototype, "iconUrl", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], AppEntity.prototype, "targetUrl", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => access_rule_entity_1.AccessRuleEntity, (rule) => rule.app, { cascade: true }),
    __metadata("design:type", Array)
], AppEntity.prototype, "accessRules", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], AppEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], AppEntity.prototype, "updatedAt", void 0);
exports.AppEntity = AppEntity = __decorate([
    (0, typeorm_1.Entity)({ name: "apps" })
], AppEntity);
//# sourceMappingURL=app.entity.js.map