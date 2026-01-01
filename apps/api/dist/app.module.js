"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const apps_module_1 = require("./apps/apps.module");
const app_entity_1 = require("./apps/app.entity");
const access_rule_entity_1 = require("./apps/access-rule.entity");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true
            }),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (config) => ({
                    type: "postgres",
                    host: config.getOrThrow("POSTGRES_HOST"),
                    port: Number(config.getOrThrow("POSTGRES_PORT")),
                    username: config.getOrThrow("POSTGRES_USER"),
                    password: config.getOrThrow("POSTGRES_PASSWORD"),
                    database: config.getOrThrow("POSTGRES_DB"),
                    entities: [app_entity_1.AppEntity, access_rule_entity_1.AccessRuleEntity],
                    synchronize: config.get("TYPEORM_SYNCHRONIZE") === "true"
                })
            }),
            apps_module_1.AppsModule
        ]
    })
], AppModule);
//# sourceMappingURL=app.module.js.map