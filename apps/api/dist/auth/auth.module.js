"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const idp_authentik_1 = require("@hubk/idp-authentik");
const auth_guard_1 = require("./auth.guard");
const auth_service_1 = require("./auth.service");
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [config_1.ConfigModule],
        providers: [
            {
                provide: "IDP_ADAPTER",
                inject: [config_1.ConfigService],
                useFactory: (config) => (0, idp_authentik_1.createAuthentikAdapter)({
                    issuer: config.getOrThrow("OIDC_ISSUER"),
                    audience: config.getOrThrow("OIDC_AUDIENCE"),
                    jwksUrl: config.get("OIDC_JWKS_URL"),
                    appsEndpoint: config.get("OIDC_APPS_ENDPOINT")
                })
            },
            {
                provide: auth_service_1.AuthService,
                inject: ["IDP_ADAPTER"],
                useFactory: (adapter) => new auth_service_1.AuthService(adapter)
            },
            {
                provide: auth_guard_1.AuthGuard,
                inject: [auth_service_1.AuthService],
                useFactory: (service) => new auth_guard_1.AuthGuard(service)
            },
            {
                provide: "IDP_APPS",
                inject: ["IDP_ADAPTER"],
                useFactory: (adapter) => adapter.apps
            }
        ],
        exports: [auth_guard_1.AuthGuard, auth_service_1.AuthService, "IDP_APPS"]
    })
], AuthModule);
//# sourceMappingURL=auth.module.js.map