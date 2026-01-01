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
exports.AppsController = void 0;
const common_1 = require("@nestjs/common");
const apps_service_1 = require("./apps.service");
const auth_guard_1 = require("../auth/auth.guard");
let AppsController = class AppsController {
    appsService;
    constructor(appsService) {
        this.appsService = appsService;
    }
    me(request) {
        const user = request.user;
        return { user };
    }
    async list(request) {
        const user = request.user;
        const apps = await this.appsService.listAppsForUser(user);
        return { apps };
    }
};
exports.AppsController = AppsController;
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Get)("/me"),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Object)
], AppsController.prototype, "me", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Get)("/apps"),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AppsController.prototype, "list", null);
exports.AppsController = AppsController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [apps_service_1.AppsService])
], AppsController);
//# sourceMappingURL=apps.controller.js.map