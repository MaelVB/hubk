import type { IdpAdapter } from "@hubk/auth-core";
import type { NormalizedUserClaims } from "@hubk/shared";
export declare class AuthService {
    private readonly idpAdapter;
    constructor(idpAdapter: IdpAdapter);
    authenticate(token: string): Promise<NormalizedUserClaims>;
}
//# sourceMappingURL=auth.service.d.ts.map