import type { AppsResponse, MeResponse } from "@hubk/shared";
import type { Request } from "express";
import { AppsService } from "./apps.service";
export declare class AppsController {
    private readonly appsService;
    constructor(appsService: AppsService);
    me(request: Request): MeResponse;
    list(request: Request): Promise<AppsResponse>;
}
//# sourceMappingURL=apps.controller.d.ts.map